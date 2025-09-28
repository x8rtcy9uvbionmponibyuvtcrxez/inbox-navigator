import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus, InboxType, DomainStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, customerEmail, customerName, quantity = 2 } = await request.json();

    if (!sessionId || !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID and customer email are required' },
        { status: 400 }
      );
    }

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
      where: { slug: 'test-workspace' },
      update: {},
      create: {
        name: 'Test Workspace',
        slug: 'test-workspace',
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
        productsBought: ['inbox_basic']
      }
    });

    // Create a dummy order for onboarding
    const order = await prisma.order.create({
      data: {
        workspaceId: workspace.id,
        clientId: client.id,
        orderNumber: `ORD-${Date.now()}`,
        stripeSessionId: sessionId,
        status: OrderStatus.PLACED,
        totalAmount: quantity * 300, // $3 per inbox in cents
        currency: 'usd',
        quantity: quantity,
        inboxCount: quantity,
        domainCount: Math.min(quantity, 3),
        productId: 'prod_test',
        priceId: 'price_test',
        productsBought: ['inbox_basic'],
        typesOfInboxes: [InboxType.GSUITE],
        orderDate: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      order,
      message: `Created order ${order.orderNumber} for onboarding`
    });

  } catch (error) {
    console.error('Error creating onboarding order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create onboarding order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
