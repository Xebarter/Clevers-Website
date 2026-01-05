# PesaPal Application Payments Integration

## Overview
This document describes how PesaPal payments are integrated for applications, following the same pattern as the ticket payment implementation.

### Purpose
This documentation helps developers understand and maintain the PesaPal payment flow for applications.

### High-level flow
Frontend → POST /api/applications/pesapal → request Pesapal access token → SubmitOrderRequest → redirect user to Pesapal → Pesapal callback → app verifies status via IPN or GetTransactionStatus → application status updated and processed.

## Key Files

### Backend Payment Submit
- `route.ts`: `src/app/api/applications/pesapal/route.ts` (lines 1-100)
  - Handles POST requests to initiate application payments
  - Creates application record with pending status
  - Submits order to PesaPal
  - Returns redirect URL to frontend

### Backend Status Check
- `route.ts`: `src/app/api/check-payment-status/[orderTrackingId]/route.ts` (lines 1-78)
  - Gets transaction status from PesaPal
  - Updates application record with payment status
  - Returns payment status details

### PesaPal IPN Handler
- `route.ts`: `src/app/api/pesapal-ipn/route.ts` (lines 1-100)
  - Handles IPN notifications from PesaPal
  - Updates both ticket and application records based on transaction ID
  - Processes payment completion/failed notifications

### Frontend Payment Submit Usage
- `ApplicationForm.tsx`: `src/components/ApplicationForm.tsx` (lines 100-150)
  - Calls POST /api/applications/pesapal with application details
  - Redirects user to returned URL

### Payment-completion Verification
- `ApplicationForm.tsx`: `src/components/ApplicationForm.tsx` (lines 80-120)
  - Polls GET /api/check-payment-status/[orderTrackingId] to check payment status
  - Enables PDF download when payment is confirmed

## Environment Variables Required
- `PESAPAL_CONSUMER_KEY`: PesaPal consumer key
- `PESAPAL_CONSUMER_SECRET`: PesaPal consumer secret
- `PESAPAL_BASE_URL`: PesaPal base URL. Prod: https://pay.pesapal.com/v3. Sandbox: https://cybqa.pesapal.com/pesapalv3
- `PESAPAL_CALLBACK_URL`: URL PesaPal redirects the user to after payment
- `PESAPAL_IPN_ID`: Notification/registration ID for PesaPal IPNs

## Database Expectations (Supabase applications table fields used)

### Required/Used Columns:
- `id` (primary key) — used as orderTrackingId
- `name`, `email`, `phone`, `campus`, `grade_level`
- `status` — values: pending, submitted, awaiting_payment, paid, payment_failed
- `application_status` — values: SUBMITTED, AWAITING_PAYMENT, PAID, PAYMENT_FAILED
- `payment_status` — values: pending, completed, failed
- `pesapal_transaction_id` — set to PesaPal order_tracking_id
- `pesapal_status` — human-readable status from PesaPal/IPN
- `payment_confirmation_code`, `payment_amount`, `payment_currency`, `payment_method`, `payment_date`

## Detailed Backend Flow (what each endpoint does)

### POST /api/applications/pesapal (route.ts)
- Validates body: expects firstName, lastName, email, phoneNumber, amount, campus, gradeLevel
- Creates an application row with status: 'pending' and payment_status: 'pending'
- Calls PesaPal to get an access token (Request token: POST ${PESAPAL_BASE_URL}/api/Auth/RequestToken with consumer_key and consumer_secret)
- Builds SubmitOrderRequest payload:
  - id: local order tracking id (the created application id)
  - currency: "UGX" (hard-coded)
  - amount: numeric amount
  - description: "Application fee for Clevers Academy"
  - callback_url: PESAPAL_CALLBACK_URL
  - notification_id: PESAPAL_IPN_ID
  - billing_address: { email_address, first_name, last_name, phone_number, country_code }
- Calls POST ${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest with Authorization: Bearer <token>
- On success:
  - Expects JSON containing redirect_url and order_tracking_id (the PesaPal order id)
  - Updates the applications row setting pesapal_transaction_id to order_tracking_id
  - Returns { url: redirect_url, applicationId } to the frontend
- On failure:
  - Attempts to parse PesaPal error body; logs and updates local application to payment_status: 'failed'
  - Returns HTTP 500 with error message
- Timeouts: request has a 10s AbortSignal timeout

### GET /api/check-payment-status/[orderTrackingId] (route.ts)
- Validates orderTrackingId from path parameter and PesaPal credentials
- Obtains access token identical to submit flow
- Calls GET ${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=<id> with Authorization: Bearer <token>
- Parses response; maps payment_status_description to local applications.payment_status:
  - Contains completed/successful → completed
  - Contains failed/cancelled → failed
  - Otherwise remains pending
- Updates applications row where pesapal_transaction_id = orderTrackingId with payment_status and pesapal_status
- Returns JSON with the PesaPal response summary (status, payment_status_description, payment_method, confirmation_code)

### POST /api/pesapal-ipn (route.ts)
- Endpoint intended to receive PesaPal IPN notifications (PesaPal will POST JSON)
- Expects JSON body containing at least:
  - OrderTrackingId (the original application id)
  - OrderNotificationType (e.g., PAYMENT_COMPLETED, PAYMENT_FAILED, PAYMENT_CANCELLED)
- On PAYMENT_COMPLETED:
  - Updates applications row with payment_status: 'completed' and application_status: 'PAID'
- On PAYMENT_FAILED or PAYMENT_CANCELLED:
  - Updates applications row with payment_status: 'failed' and application_status: 'PAYMENT_FAILED'
- Returns { status: "success" } on handled notifications

## Frontend Integration & UX

### Where to Initiate Payment:
- The application form (ApplicationForm.tsx) calls:
  - POST /api/applications/pesapal with JSON: { firstName, lastName, email, phoneNumber, amount, campus, gradeLevel }
- Successful response contains { url }. Frontend redirects window.location.href = url

### Callback Handling:
- PESAPAL_CALLBACK_URL should point to the app page that displays payment completion
- The payment completion UI polls GET /api/check-payment-status/[orderTrackingId] several times to wait for PesaPal to update
- On confirmed payments, the UI enables the PDF download functionality

## PesaPal API Specifics Observed
- Token request:
  - Endpoint: POST ${PESAPAL_BASE_URL}/api/Auth/RequestToken
  - Body: { consumer_key, consumer_secret }
  - Response: JSON { token: "<jwt>" } (code expects data.token)
- Submit order:
  - Endpoint: POST ${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest
  - Auth: Authorization: Bearer <token>
  - Payload (from code):
    - id (orderTrackingId), currency (UGX), amount, description, callback_url, notification_id, billing_address (with email_address, first_name, last_name, phone_number, country_code)
  - Expected response: JSON including redirect_url and order_tracking_id (code uses them)
- GetTransactionStatus:
  - Endpoint: GET ${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=<id>
  - Expected response contains payment_status_description, payment_method, confirmation_code, etc.

## IPN Registration and Behavior
- The app supplies notification_id (from PESAPAL_IPN_ID) during SubmitOrderRequest
- You must register/configure this IPN in your PesaPal merchant dashboard so PesaPal will POST notifications to your app's IPN endpoint
- The code expects IPN bodies containing OrderTrackingId and OrderNotificationType
- The app's IPN handler updates application status on receipt (no signature verification implemented in the code — if PesaPal supports signed IPNs, consider validating)

## Error Handling & Important Implementation Notes
- The backend updates the created application to payment_status: 'failed' if SubmitOrderRequest fails
- Token fetching & transaction calls use a 10s AbortSignal timeout; caller should handle network/timeouts
- The app uses the created application id as orderTrackingId. Ensure your DB uses predictable id formats (strings/UUIDs)
- The IPN and status responses from PesaPal will contain that same id
- The code parses PesaPal responses defensively (handles HTML responses when endpoint wrong)
- There is no token caching — a new token is requested per submit/status call
- IPN endpoint currently does not authenticate/verify the sender: consider adding verification (HMAC, IP whitelist, or PesaPal signature check) in production

## Testing and Sandbox
- To test without production, set PESAPAL_BASE_URL to PesaPal sandbox: https://cybqa.pesapal.com/pesapalv3
- Use sandbox PESAPAL_CONSUMER_KEY/SECRET and register an IPN there
- Verify the full sequence:
  1. Frontend posts to /api/applications/pesapal
  2. App creates applications row with payment_status: pending
  3. App requests token and calls SubmitOrderRequest
  4. App receives redirect_url, saves pesapal_transaction_id
  5. User completes flow on PesaPal; PesaPal redirects to PESAPAL_CALLBACK_URL with orderTrackingId in URL
  6. PesaPal sends IPN to your registered IPN endpoint (/api/pesapal-ipn) — or use GetTransactionStatus to poll
  7. App updates applications row to completed or failed
  8. Frontend polling detects confirmed status and enables PDF download

## Checklist to Implement or Replicate
- Env: Set PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET, PESAPAL_CALLBACK_URL, PESAPAL_IPN_ID, PESAPAL_BASE_URL
- DB: Ensure applications table has the fields listed above
- IPN: Register the PESAPAL_IPN_ID (or configure notification URL) in the PesaPal merchant/sandbox dashboard and point it to /api/pesapal-ipn
- Routes: Ensure the Next.js routes in src/app/api/... are deployed/accessible over HTTPS
- Test: Run a sandbox flow, confirm applications row updates to completed, and that PDF generation works