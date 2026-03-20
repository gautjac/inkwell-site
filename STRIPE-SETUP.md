# Inkwell Stripe Setup Guide

## Step 1: Create Stripe Products

Go to https://dashboard.stripe.com/products and create:

### Product 1: Creator
- Name: `Inkwell Creator`
- Description: `500 AI generations/month, cloud sync, priority support`
- Price: `$9/month` (recurring)
- Price ID: Save this → `price_creator_monthly`

### Product 2: Pro  
- Name: `Inkwell Pro`
- Description: `Unlimited AI generations, multi-device sync, all features`
- Price: `$19/month` (recurring)
- Price ID: Save this → `price_pro_monthly`

## Step 2: Get API Keys

Go to https://dashboard.stripe.com/apikeys

Save these:
- **Publishable key**: `pk_live_...` or `pk_test_...`
- **Secret key**: `sk_live_...` or `sk_test_...`

## Step 3: Add to Environment

Create `~/.openclaw/secrets/stripe.env`:
```
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_CREATOR=price_xxx
STRIPE_PRICE_PRO=price_xxx
```

## Step 4: Deploy with Netlify Functions

The checkout function is already in `netlify/functions/create-checkout.js`.

Add environment variables in Netlify:
1. Go to Site settings → Environment variables
2. Add all 4 variables from stripe.env

## Step 5: Test

1. Use Stripe test mode first
2. Test card: `4242 4242 4242 4242`
3. Any future expiry, any CVC

## Webhook (Optional but recommended)

Set up a webhook at https://dashboard.stripe.com/webhooks for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Endpoint: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
