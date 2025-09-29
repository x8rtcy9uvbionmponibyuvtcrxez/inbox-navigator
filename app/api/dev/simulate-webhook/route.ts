import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus, InboxType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { 
      sessionId, 
      customerEmail, 
      customerName, 
      totalAmount, 
      quantity = 2,
      workspaceSlug = 'test-workspace',
      productId = 'prod_test',
      priceId = 'price_test',
      productsBought = ['inbox_basic'],
      typesOfInboxes = [InboxType.GSUITE]
    } = await request.json();

    if (!sessionId || !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID and customer email are required' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 100' },
        { status: 400 }
      );
    }

    console.log('Simulating Stripe webhook for session:', sessionId);

    // Create a dummy user first
    const user = await prisma.user.upsert({
      where: { email: customerEmail },
      update: {},
      create: {
        email: customerEmail,
        name: customerName || 'Test User',
        role: UserRole.USER
      }
    });

    // Create a dummy workspace
    const workspace = await prisma.workspace.upsert({
      where: { slug: workspaceSlug },
      update: {},
      create: {
        name: `${customerName || 'Test User'}'s Workspace`,
        slug: workspaceSlug,
        primaryUserId: user.id
      },
      include: { primaryUser: true }
    });

    // Create a dummy client
    const client = await prisma.client.create({
      data: {
        name: customerName || 'Test User',
        email: customerEmail,
        workspaceId: workspace.id,
        productsBought: productsBought
      }
    });

    // Check if order already exists
    let order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId }
    });

    if (!order) {
      // Create a dummy order (simulating webhook behavior)
      order = await prisma.order.create({
        data: {
          workspaceId: workspace.id,
          clientId: client.id,
          orderNumber: `ORD-${Date.now()}`,
          stripeSessionId: sessionId,
          status: OrderStatus.PLACED,
          totalAmount: totalAmount || (quantity * 300), // $3 per inbox in cents
          currency: 'usd',
          quantity: quantity,
          inboxCount: quantity,
          domainCount: Math.min(quantity, 3),
          productId: productId,
          priceId: priceId,
          productsBought: productsBought,
          typesOfInboxes: typesOfInboxes,
          orderDate: new Date()
        }
      });
      console.log('Created new order:', order.orderNumber);
    } else {
      console.log('Order already exists:', order.orderNumber);
    }

    console.log('Created order via simulated webhook:', order.orderNumber);

    return NextResponse.json({
      success: true,
      order,
      message: `Simulated webhook created order ${order.orderNumber}`
    });

  } catch (error) {
    console.error('Error simulating webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to simulate webhook', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
