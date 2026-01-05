import { ApplicationData, PesapalIPNResponse, PesapalOrderResponse, PesapalTokenResponse, PesapalTransactionStatus } from '../types/pesapal';

// Pesapal configuration - using server-side only environment variables
const PESAPAL_CONFIG = {
  consumer_key: process.env.PESAPAL_CONSUMER_KEY || '',  // Removed NEXT_PUBLIC_ prefix
  consumer_secret: process.env.PESAPAL_CONSUMER_SECRET || '',  // Removed NEXT_PUBLIC_ prefix
  sandbox: process.env.PESAPAL_SANDBOX === 'true' || process.env.NEXT_PUBLIC_PESAPAL_SANDBOX === 'true', // Can be public since it's just environment indicator
};

// Base URLs
const BASE_URLS = {
  sandbox: 'https://cybqa.pesapal.com/pesapalv3',
  live: 'https://pay.pesapal.com/v3',
};

const API_BASE_URL = PESAPAL_CONFIG.sandbox ? BASE_URLS.sandbox : BASE_URLS.live;

/**
 * Pesapal API service class for handling payment processing.
 */
class PesapalService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get authentication token from Pesapal.
   * Caches the token for reuse within its validity period.
   */
  private async getAuthToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid
    if (this.token && now < this.tokenExpiry) {
      return this.token;
    }

    // Check if required environment variables are set
    if (!PESAPAL_CONFIG.consumer_key || !PESAPAL_CONFIG.consumer_secret) {
      throw new Error('Pesapal environment variables are not properly configured. Please set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          consumer_key: PESAPAL_CONFIG.consumer_key,
          consumer_secret: PESAPAL_CONFIG.consumer_secret,
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.error('Pesapal auth error response:', data);
        throw new Error(data.error?.message || `Failed to get authentication token: ${response.status} ${response.statusText}`);
      }

      // Set token and expiry (using the returned expiry time). Provide safe defaults.
      if (!data?.token) {
        console.error('Pesapal auth returned no token:', data);
        throw new Error('Pesapal authentication failed: no token returned');
      }

      this.token = data.token;
      const expirySeconds = typeof data.expiry === 'number' ? data.expiry : (typeof data.expires_in === 'number' ? data.expires_in : 3600);
      this.tokenExpiry = now + (expirySeconds * 1000); // Convert seconds to milliseconds

      return this.token;
    } catch (error) {
      console.error('Error getting Pesapal auth token:', error);
      throw error;
    }
  }

  /**
   * Register an Instant Payment Notification (IPN) URL with Pesapal.
   */
  async registerIPN(callbackUrl: string): Promise<PesapalIPNResponse> {
    const token = await this.getAuthToken();

    try {
      const response = await fetch(`${API_BASE_URL}/api/URLSetup/RegisterIPN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: callbackUrl,
          http_method: 'POST', // Changed to POST to receive IPN notifications properly
          notification_type: 'MERCHANT',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Failed to register IPN: ${response.status} ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error registering IPN:', error);
      throw error;
    }
  }

  /**
   * Submit an order request to Pesapal to initiate a payment.
   */
  async submitOrder(
    applicationId: string,
    amount: number,
    currency: string,
    callbackUrl: string,
    applicationData: ApplicationData
  ): Promise<PesapalOrderResponse> {
    const token = await this.getAuthToken();

    // Extract first and last name from applicant's name
    const nameParts = applicationData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const orderRequest = {
      id: applicationId,
      amount: amount,
      currency: currency,
      description: `Application fee for ${applicationData.name} at Clevers Academy`,
      callback_url: callbackUrl,
      billing_address: {
        email_address: applicationData.email,
        phone_number: applicationData.phone.replace(/\D/g, ''),
        country: 'UG',
        first_name: firstName,
        last_name: lastName,
        city: 'Kampala',
        line_1: `Application for ${applicationData.campus} campus`,
        line_2: '',
        postal_code: '00000',
        state: 'Central',
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderRequest),
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.error('Pesapal submitOrder error response:', data);
        // Check if it's a Pesapal error format
        if (data.error) {
          throw new Error(`Pesapal Error: ${data.error.message} (Type: ${data.error.type}, Code: ${data.error.code})`);
        } else {
          throw new Error(`Failed to submit order: ${response.status} ${response.statusText}`);
        }
      }

      // Normalize response to include camelCase properties and a stable redirect URL
      const normalized = {
        ...data,
        orderTrackingId: data.order_tracking_id || data.orderTrackingId || data.orderTrackingID || null,
        redirectUrl: data.redirect_url || data.redirectUrl || data.redirect || null,
        merchantReference: data.merchant_reference || data.merchantReference || null,
      } as PesapalOrderResponse & { orderTrackingId?: string; redirectUrl?: string; merchantReference?: string };

      return normalized;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  }

  /**
   * Check the status of a transaction using its tracking ID.
   */
  async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatus> {
    const token = await this.getAuthToken();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get transaction status');
      }

      return data;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Cancel an existing order.
   */
  async cancelOrder(orderTrackingId: string): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const response = await fetch(`${API_BASE_URL}/api/Transactions/CancelOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ order_tracking_id: orderTrackingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to cancel order');
      }

      return data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }
}

export const pesapalService = new PesapalService();