import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}
const secretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(secretKey);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  let event;

  try {
    if (!sig) {
      throw new Error('Missing Stripe signature');
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    //console.log(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent was successful!`);
      
        // let's build the queue, the charge was successful now need to load the payload of numbers

      break;
    // other event types ?
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
