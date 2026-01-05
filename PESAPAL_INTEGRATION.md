# Pesapal Integration for Clevers Frontend

This document explains how the Pesapal payment gateway has been integrated into the Clevers Frontend application to handle application fee payments.

## Architecture Overview

The integration follows the Pesapal API 3.0 specification with the following components:

1. **Client components/pages**: Display payment options and collect customer details
2. **Next.js API routes (server)**: Handle secure payment operations
3. **Database**: Store order information and payment status

## API Routes

### `/api/pesapal/checkout`
- Creates an order with Pesapal and returns the redirect URL
- Called when a user clicks "Pay Now with Pesapal"
- Requires: `applicationId`, `amount`, `currency`

### `/api/pesapal/ipn`
- Public endpoint that Pesapal calls to notify payment status changes
- Updates the application record with payment status
- Responds with acknowledgment to Pesapal

### `/api/pesapal/status`
- For frontend to poll the database for transaction status
- Takes `orderTrackingId` as a query parameter

### `/api/pesapal-init`
- Internal endpoint to register IPN URL with Pesapal
- Should be called during application setup

## Environment Variables

Required environment variables for Pesapal integration:

```bash
# Pesapal credentials
PESAPAL_CONSUMER_KEY=xxx
PESAPAL_CONSUMER_SECRET=xxx
PESAPAL_SANDBOX=true  # Set to false for production

# URLs
PESAPAL_CALLBACK_URL=https://your-domain.com/pesapal/callback
PESAPAL_IPN_URL=https://your-domain.com/api/pesapal/ipn
```

## Database Schema

The application table has been updated to include:

- `payment_status`: Tracks payment status (pending, completed, failed)
- `payment_confirmation_code`: Confirmation code from Pesapal
- `payment_amount`: Amount paid
- `payment_currency`: Currency used
- `payment_date`: When payment was processed
- `payment_method`: Payment method used
- `application_status`: Updated to "PAID" when payment is completed
- `message`: JSON field containing additional payment details

## Flow

1. User fills out application form and submits
2. Application is saved with `payment_status` as "pending"
3. User clicks "Pay Now with Pesapal"
4. Frontend calls `/api/pesapal/checkout` to create order with Pesapal
5. User is redirected to Pesapal checkout page
6. After payment, Pesapal redirects user to callback URL
7. Pesapal sends IPN notification to `/api/pesapal/ipn` endpoint
8. Application record is updated with payment status
9. User sees payment status on callback page

## Security

- Pesapal credentials are stored as server-side environment variables
- The IPN endpoint uses Supabase service role key for database access
- All payment-related operations happen server-side to prevent tampering

## Error Handling

- Token caching with refresh when expired
- Proper error responses with appropriate HTTP status codes
- Logging for debugging and monitoring
- Retry logic for critical operations

## Testing

For testing in sandbox mode:

1. Use sandbox credentials from Pesapal
2. Ensure `PESAPAL_SANDBOX=true` in environment variables
3. Register your test IPN and callback URLs in Pesapal dashboard
4. Use the sandbox environment base URL: `https://cybqa.pesapal.com/pesapalv3`