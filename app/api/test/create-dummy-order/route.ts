import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus, InboxType, DomainStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, quantity = 1 } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
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
        productsBought: '["inbox_basic"]'
      }
    });

    // Create a dummy order
    const order = await prisma.order.create({
      data: {
        workspaceId: workspace.id,
        clientId: client.id,
        orderNumber: `ORD-${Date.now()}`,
        stripeSessionId: `test-session-${Date.now()}`,
        status: OrderStatus.PLACED,
        totalAmount: quantity * 300, // $3 per inbox in cents
        currency: 'usd',
        quantity: quantity,
        inboxCount: quantity,
        domainCount: Math.min(quantity, 3),
        productId: 'prod_test',
        priceId: 'price_test',
        productsBought: '["inbox_basic"]',
        typesOfInboxes: `["${InboxType.GSUITE}"]`,
        orderDate: new Date()
      }
    });

    // Create some dummy domains first
    const domains = [];
    for (let i = 0; i < Math.min(quantity, 3); i++) {
      const domain = await prisma.domain.create({
        data: {
          workspaceId: workspace.id,
          clientId: client.id,
          name: `testdomain${i + 1}.com`,
          status: DomainStatus.LIVE,
          dnsRecords: '[]'
        }
      });
      domains.push(domain);
    }

    // Create some dummy inboxes
    const inboxes = [];
    for (let i = 0; i < quantity; i++) {
      const inbox = await prisma.inbox.create({
        data: {
          workspaceId: workspace.id,
          clientId: client.id,
          domainId: domains[i % domains.length]?.id || domains[0]?.id, // Use first domain if not enough domains
          email: `test${i + 1}@example.com`,
          name: `Test Inbox ${i + 1}`,
          password: 'testpassword123',
          status: 'ACTIVE',
          esp: 'GSUITE',
          tags: '["test", "demo"]'
        }
      });
      inboxes.push(inbox);
    }

    return NextResponse.json({
      success: true,
      order,
      workspace,
      client,
      inboxes,
      domains,
      message: `Successfully created ${quantity} inbox(es) and ${domains.length} domain(s)`
    });

  } catch (error) {
    console.error('Error creating dummy order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create dummy order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
