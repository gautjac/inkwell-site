// Stripe Checkout Session Creator
// Requires: STRIPE_SECRET_KEY, STRIPE_PRICE_CREATOR, STRIPE_PRICE_PRO in env

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { plan, successUrl, cancelUrl } = JSON.parse(event.body || '{}');

    // Map plan to price ID
    const priceIds = {
      creator: process.env.STRIPE_PRICE_CREATOR,
      pro: process.env.STRIPE_PRICE_PRO
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan' })
      };
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: successUrl || 'https://inkwell-lyric-app.netlify.app?checkout=success',
      cancel_url: cancelUrl || 'https://harmonious-biscochitos-b65214.netlify.app/#pricing',
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address for tax
      billing_address_collection: 'required',
      // Automatic tax (if enabled in Stripe dashboard)
      // automatic_tax: { enabled: true },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
