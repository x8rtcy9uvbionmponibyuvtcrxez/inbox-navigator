import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { InboxType } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing checkout session completed:', session.id);

    // Extract metadata
    const { workspace_id, workspace_name, quantity, type } = session.metadata || {};
    
    if (type !== 'inbox_purchase') {
      console.log('Ignoring non-inbox purchase event');
      return;
    }

    if (!workspace_id || !quantity) {
      console.error('Missing required metadata:', { workspace_id, quantity });
      return;
    }

    // Get or create customer
    let customer;
    if (session.customer) {
      customer = await stripe.customers.retrieve(session.customer as string);
    } else if (session.customer_email) {
      // Create customer if they don't exist
      customer = await stripe.customers.create({
        email: session.customer_email,
        name: session.customer_details?.name || undefined,
        metadata: {
          workspace_id,
        },
      });
    }

    // Find workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspace_id },
      include: { primaryUser: true }
    });

    if (!workspace) {
      console.error('Workspace not found:', workspace_id);
      return;
    }

    // Create or update client
    let client = await prisma.client.findFirst({
      where: {
        workspaceId: workspace_id,
        email: session.customer_email || undefined,
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: session.customer_details?.name || workspace.primaryUser.fullName || 'Unknown',
          email: session.customer_email || workspace.primaryUser.email,
          workspaceId: workspace_id,
          productsBought: [] as string[], // Empty array
        },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate amounts
    const quantityNum = parseInt(quantity);
    const unitAmount = 300; // $3.00 in cents
    const totalAmount = (quantityNum * unitAmount) / 100; // Convert to dollars

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PLACED',
        inboxCount: quantityNum,
        domainCount: 0, // Will be set during onboarding
        totalAmount: quantityNum * 300, // $3.00 per inbox in cents
        quantity: quantityNum,
        clientId: client.id,
        workspaceId: workspace_id,
        stripeSessionId: session.id,
        stripeCustomerId: customer?.id as string,
        productId: 'inbox_basic',
        priceId: 'price_inbox_basic',
        productsBought: ['inbox_basic'] as string[],
        typesOfInboxes: [InboxType.GSUITE],
      },
    });

    // Update workspace subscription status
    await prisma.workspace.update({
      where: { id: workspace_id },
      data: {
        subscriptionStatus: 'paid',
        stripeCustomerId: customer?.id as string,
      },
    });

    // Create onboarding data record
    await prisma.onboardingData.create({
      data: {
        workspaceId: workspace_id,
        orderId: order.id,
        stepCompleted: 0,
        isCompleted: false,
        preferredDomains: [] as string[], // Empty array
      },
    });

    console.log('Order created successfully:', order.id);

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Update order status to processing
    await prisma.order.updateMany({
      where: { stripeSessionId: paymentIntent.metadata?.session_id },
      data: { status: 'PROCESSING' },
    });

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    // Update order status to failed
    await prisma.order.updateMany({
      where: { stripeSessionId: paymentIntent.metadata?.session_id },
      data: { status: 'CANCELLED' },
    });

  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}
