import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Inbox Management - ${quantity} Inbox${quantity > 1 ? 'es' : ''}`,
              description: `Professional inbox management for ${quantity} email inbox${quantity > 1 ? 'es' : ''}`,
              metadata: {
                workspace_id: workspaceId || 'unknown',
                workspace_name: workspaceName || 'Unknown Workspace',
              },
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
      customer_email: customerEmail,
      metadata: {
        workspace_id: workspaceId || 'unknown',
        workspace_name: workspaceName || 'Unknown Workspace',
        quantity: quantity.toString(),
        type: 'inbox_purchase',
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
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
