import { pesapalService } from './pesapal';

/**
 * Registers the IPN URL with Pesapal on application startup
 */
export const registerPesapalIPN = async (): Promise<void> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const ipnUrl = `${baseUrl}/api/pesapal/ipn`;
    
    console.log(`Registering IPN URL with Pesapal: ${ipnUrl}`);
    
    await pesapalService.registerIPN(ipnUrl);
    
    console.log('Pesapal IPN registered successfully');
  } catch (error) {
    console.error('Failed to register Pesapal IPN:', error);
    throw error;
  }
};

// Remove automatic execution during import to prevent build-time issues
// The IPN registration should only happen when explicitly called during runtime

/**
 * Initialize Pesapal service by registering the IPN
 * This should be called server-side when needed
 */
export const initializePesapal = async (): Promise<void> => {
  await registerPesapalIPN();
};
