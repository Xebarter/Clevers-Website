// Pesapal API Types

export interface PesapalBillingAddress {
  email_address?: string;
  phone_number?: string;
  country?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  line_1?: string;
  line_2?: string;
  postal_code?: string;
  state?: string;
}

export interface PesapalOrderRequest {
  id: string;
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  billing_address: PesapalBillingAddress;
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  orderTrackingId?: string | null;
  merchantReference?: string | null;
  redirectUrl?: string | null;
}

export interface PesapalTransactionStatus {
  payment_method?: string;
  amount: number;
  created_date: string;
  confirmation_code?: string;
  payment_status_description: string;
  description?: string;
  message: string;
  payment_account?: string;
  call_back_url?: string;
  status_code: number;
  merchant_reference: string;
  currency: string;
  error?: {
    error_type: string | null;
    code: string | null;
    message: string | null;
    call_back_url: string | null;
  };
  status: string;
}

export interface PesapalIPNResponse {
  ipn_id: string;
  url: string;
  http_method: string;
  notification_type: string;
}

export interface PesapalTokenResponse {
  token: string;
  expiry: number;
}

export interface PesapalError {
  error: {
    type: string;
    code: string;
    message: string;
  };
}