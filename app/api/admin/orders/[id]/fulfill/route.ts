import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { OrderStatus, InboxType, InboxStatus, InboxESP, DomainStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized order fulfillment request', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id: orderId } = params;
    const { 
      inboxes = [], 
      domains = [],
      personas = [],
      notes = ''
    } = await request.json();

    // Get order with related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        workspace: true,
        client: true,
        onboardingData: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status === OrderStatus.DELIVERED) {
      return NextResponse.json(
        { error: 'Order already fulfilled' },
        { status: 409 }
      );
    }

    // Create domains if provided
    const createdDomains = [];
    for (const domainData of domains) {
      const domain = await prisma.domain.create({
        data: {
          name: domainData.name,
          workspaceId: order.workspaceId,
          clientId: order.clientId,
          redirectUrl: domainData.redirectUrl || null,
          boughtByInboxNav: domainData.boughtByInboxNav || false,
          stripeCustomerId: order.stripeCustomerId,
          status: DomainStatus.ACTIVE,
        }
      });
      createdDomains.push(domain);
    }

    // Create inboxes
    const createdInboxes = [];
    for (const inboxData of inboxes) {
      const inbox = await prisma.inbox.create({
        data: {
          email: inboxData.email,
          name: inboxData.name || inboxData.email.split('@')[0],
          domainId: inboxData.domainId,
          clientId: order.clientId,
          workspaceId: order.workspaceId,
          esp: (inboxData.esp as InboxESP) || InboxESP.GSUITE,
          status: InboxStatus.ACTIVE,
          tags: inboxData.tags || [],
        }
      });
      createdInboxes.push(inbox);
    }

    // Create personas if provided
    const createdPersonas = [];
    for (const personaData of personas) {
      const persona = await prisma.persona.create({
        data: {
          fullName: personaData.fullName,
          firstName: personaData.firstName,
          lastName: personaData.lastName,
          role: personaData.role,
          workspaceId: order.workspaceId,
          clientId: order.clientId,
          tags: personaData.tags || [],
        }
      });
      createdPersonas.push(persona);
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED,
        fulfilledDate: new Date(),
        fulfillmentNotes: notes || null,
      },
      include: {
        workspace: true,
        client: true,
        onboardingData: true
      }
    });

    // Create subscription if this is a recurring order
    if (order.productsBought.includes('subscription')) {
      await prisma.subscription.create({
        data: {
          orderId: order.id,
          clientId: order.clientId,
          workspaceId: order.workspaceId,
          stripeSubscriptionId: order.stripeSubscriptionId || `sub_${Date.now()}`,
          status: 'ACTIVE',
          plan: 'BASIC',
          billingPeriod: 'MONTHLY',
          amount: order.totalAmount,
          startedAt: new Date(),
        }
      });
    }

    log.info('Order fulfilled successfully', { 
      requestId, 
      orderId, 
      adminId: user.id,
      inboxesCreated: createdInboxes.length,
      domainsCreated: createdDomains.length,
      personasCreated: createdPersonas.length
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      createdInboxes,
      createdDomains,
      createdPersonas
    });

  } catch (error) {
    log.error('Error fulfilling order', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
