# Pesapal Environment Variables Setup

This document explains how to properly configure Pesapal environment variables for the Clevers Academy application.

## Server-Side Environment Variables (Required)

These variables must be set on the server and should NOT be prefixed with `NEXT_PUBLIC_`:

```
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_SANDBOX=true  # Set to false for production
```

## Public Environment Variables (Optional)

These variables can be public since they don't expose sensitive information:

```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com  # Your application's base URL
NEXT_PUBLIC_PESAPAL_SANDBOX=true  # Whether to use sandbox environment
```

## Configuration Notes

1. The `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` should never be exposed to the client-side
2. These variables are used server-side in API routes and server components
3. The Pesapal service now initializes server-side only, not on the client
4. The IPN (Instant Payment Notification) registration happens through the `/api/pesapal-init` endpoint

## Deployment Configuration

When deploying to platforms like Vercel:

1. Add the server-side environment variables in your deployment settings
2. Make sure `NEXT_PUBLIC_BASE_URL` is set to your production domain
3. Set `PESAPAL_SANDBOX=false` for production environments

## API Routes for Pesapal

- `/api/initiate-payment` - To initiate a payment request
- `/api/payment-callback` - To receive payment notifications from Pesapal
- `/api/pesapal-init` - To initialize Pesapal service server-side (if needed)