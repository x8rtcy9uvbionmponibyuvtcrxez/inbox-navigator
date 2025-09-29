import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus, InboxType } from '@prisma/client';
import { 
  validateRequiredString, 
  validateEmail, 
  validateNumberRange, 
  validateArray,
  validateEnum,
  combineValidationResults,
  createValidationErrorResponse
} from '../../../../lib/validation';
import { log } from '../../../../lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
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

    log.apiRequest('POST', '/api/dev/simulate-webhook', { requestId, sessionId, customerEmail });

    // Validate input
    const validationResult = combineValidationResults(
      validateRequiredString(sessionId, 'sessionId'),
      validateRequiredString(customerEmail, 'customerEmail'),
      validateEmail(customerEmail) ? null : { field: 'customerEmail', message: 'customerEmail must be a valid email address' },
      validateNumberRange(quantity, 'quantity', 1, 100),
      validateArray(productsBought, 'productsBought', 1),
      validateArray(typesOfInboxes, 'typesOfInboxes', 1)
    );

    if (!validationResult.isValid) {
      log.warn('Validation failed for simulate-webhook', { requestId, errors: validationResult.errors });
      return NextResponse.json(
        createValidationErrorResponse(validationResult.errors),
        { status: 400 }
      );
    }

    log.info('Simulating Stripe webhook for session', { requestId, sessionId, customerEmail, quantity });

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
      log.businessEvent('Order created', { requestId, orderId: order.id, orderNumber: order.orderNumber });
    } else {
      log.info('Order already exists', { requestId, orderId: order.id, orderNumber: order.orderNumber });
    }

    const duration = Date.now() - startTime;
    log.apiResponse('POST', '/api/dev/simulate-webhook', 200, duration, { requestId, orderId: order.id });

    return NextResponse.json({
      success: true,
      order,
      message: `Simulated webhook created order ${order.orderNumber}`
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    log.apiError('POST', '/api/dev/simulate-webhook', error as Error, 500, { requestId });
    
    return NextResponse.json(
      { 
        error: 'Failed to simulate webhook', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
