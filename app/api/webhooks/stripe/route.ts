import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { InboxType, OrderStatus } from '@prisma/client';
import { env } from '@/lib/env';
import { log } from '@/lib/logger';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// In-memory idempotency store (in production, use Redis)
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      log.error('No Stripe signature found', new Error('Missing signature'), { requestId });
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      log.error('Webhook signature verification failed', err as Error, { requestId });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Idempotency check
    if (processedEvents.has(event.id)) {
      log.info('Event already processed, skipping', { requestId, eventId: event.id });
      return NextResponse.json({ received: true, idempotent: true });
    }

    log.info('Processing webhook event', { requestId, eventType: event.type, eventId: event.id });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, requestId);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, requestId);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, requestId);
        break;
      default:
        log.info('Unhandled event type', { requestId, eventType: event.type });
    }

    // Mark event as processed
    processedEvents.add(event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    log.error('Webhook error', error as Error, { requestId });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, requestId: string) {
  try {
    log.info('Processing checkout session completed', { requestId, sessionId: session.id });

    // Extract metadata
    const { workspace_id, workspace_name, quantity, type } = session.metadata || {};
    
    if (type !== 'inbox_purchase') {
      log.info('Ignoring non-inbox purchase event', { requestId, type });
      return;
    }

    if (!workspace_id || !quantity) {
      log.error('Missing required metadata', new Error('Missing metadata'), { requestId, workspace_id, quantity });
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
      log.error('Workspace not found', new Error('Workspace not found'), { requestId, workspace_id });
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
          productsBought: [], // Empty array
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
        status: OrderStatus.PLACED,
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
        productsBought: ['inbox_basic'],
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
        preferredDomains: [], // Empty array
      },
    });

    log.info('Order created successfully', { requestId, orderId: order.id });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

  } catch (error) {
    log.error('Error handling checkout session completed', error as Error, { requestId });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  try {
    log.info('Payment succeeded', { requestId, paymentIntentId: paymentIntent.id });
    
    // Update order status to processing
    await prisma.order.updateMany({
      where: { stripeSessionId: paymentIntent.metadata?.session_id },
      data: { status: OrderStatus.PROCESSING },
    });

  } catch (error) {
    log.error('Error handling payment intent succeeded', error as Error, { requestId });
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, requestId: string) {
  try {
    log.info('Payment failed', { requestId, paymentIntentId: paymentIntent.id });
    
    // Update order status to cancelled
    await prisma.order.updateMany({
      where: { stripeSessionId: paymentIntent.metadata?.session_id },
      data: { status: OrderStatus.CANCELLED },
    });

  } catch (error) {
    log.error('Error handling payment intent failed', error as Error, { requestId });
  }
}
