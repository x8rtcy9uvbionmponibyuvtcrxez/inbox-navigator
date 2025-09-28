import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe Product and Price IDs
const STRIPE_PRODUCT_ID = 'prod_T8Wg4WOdnZMvCq';
const STRIPE_PRICE_ID = 'price_1SCFcnBTWWHTKTJvdwKiINPy';

export async function POST(request: NextRequest) {
  try {
    const { quantity, customerEmail, workspaceId, workspaceName } = await request.json();

    // Validate input
    if (!quantity || quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Calculate total amount (quantity * $3 per inbox)
    const unitAmount = 300; // $3.00 in cents
    const totalAmount = quantity * unitAmount;

    // Create Stripe checkout session
    const successUrl = `http://localhost:3000/onboarding/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `http://localhost:3000/dashboard/billing`;
    
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: quantity,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        workspace_id: workspaceId || 'unknown',
        workspace_name: workspaceName || 'Unknown Workspace',
        quantity: quantity.toString(),
        type: 'inbox_purchase',
        product_id: STRIPE_PRODUCT_ID,
        price_id: STRIPE_PRICE_ID,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
    console.error('Stripe key length:', process.env.STRIPE_SECRET_KEY?.length);
    console.error('App URL:', process.env.NEXT_PUBLIC_APP_URL);
    console.error('App URL exists:', !!process.env.NEXT_PUBLIC_APP_URL);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
