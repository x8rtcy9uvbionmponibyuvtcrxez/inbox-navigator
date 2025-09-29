import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { SubscriptionStatus, SubscriptionPlan, BillingPeriod } from '@prisma/client';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized subscriptions request', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspaces
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { primaryUserId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      },
      select: { id: true }
    });

    const workspaceIds = workspaces.map(w => w.id);

    if (workspaceIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get subscriptions for user's workspaces
    const subscriptions = await prisma.subscription.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            quantity: true,
            createdAt: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    log.info('Subscriptions fetched', { requestId, userId: user.id, count: subscriptions.length });

    return NextResponse.json(subscriptions);
  } catch (error) {
    log.error('Error fetching subscriptions', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized subscription creation', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      orderId, 
      clientId, 
      workspaceId, 
      stripeSubscriptionId,
      plan = 'BASIC',
      billingPeriod = 'MONTHLY',
      amount
    } = await request.json();

    if (!orderId || !clientId || !workspaceId || !stripeSubscriptionId || !amount) {
      return NextResponse.json(
        { error: 'orderId, clientId, workspaceId, stripeSubscriptionId, and amount are required' },
        { status: 400 }
      );
    }

    // Verify user has access to workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { primaryUserId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      }
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      );
    }

    // Verify order exists and belongs to workspace
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        workspaceId: workspaceId
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Check if subscription already exists for this order
    const existingSubscription = await prisma.subscription.findUnique({
      where: { orderId }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription already exists for this order' },
        { status: 409 }
      );
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        orderId,
        clientId,
        workspaceId,
        stripeSubscriptionId,
        status: SubscriptionStatus.ACTIVE,
        plan: plan as SubscriptionPlan,
        billingPeriod: billingPeriod as BillingPeriod,
        amount: parseFloat(amount),
        startedAt: new Date(),
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            quantity: true,
            createdAt: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    log.info('Subscription created successfully', { 
      requestId, 
      subscriptionId: subscription.id,
      orderId: subscription.orderId,
      userId: user.id 
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    log.error('Error creating subscription', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
