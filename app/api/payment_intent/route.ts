import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { products } from '../../../data/products';

const secretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(secretKey, {});

export async function POST(request: NextRequest) {
  const { phoneNumbers, paymentMethod, productId } = await request.json();

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }

  const amount = product.price * phoneNumbers.length;

  try {

    // need to add the metadata for the phone numbers and the plan chosen

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: 'usd',
      payment_method: paymentMethod,
      confirmation_method: 'manual',
      confirm: true,
    });

    return NextResponse.json(paymentIntent.client_secret);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
