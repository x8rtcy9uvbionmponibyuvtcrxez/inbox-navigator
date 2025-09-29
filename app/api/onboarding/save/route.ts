import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { log } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const body = await request.json();
    const { 
      sessionId, 
      espPlatform, 
      stepCompleted, 
      isCompleted, 
      customTags,
      personas,
      ...onboardingData 
    } = body;

    log.info('Onboarding save request', { 
      requestId,
      sessionId, 
      espPlatform, 
      stepCompleted, 
      isCompleted,
      customTagsCount: customTags?.length || 0,
      personasCount: personas?.length || 0
    });

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the order by session ID
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { workspace: true },
    });

    log.info('Order lookup result', { requestId, orderFound: !!order, orderId: order?.id });

    if (!order) {
      log.warn('Order not found for session', { requestId, sessionId });
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

          // Prepare data for database - handle arrays properly for PostgreSQL
          const dbData = {
            businessType: onboardingData.businessType,
            industry: onboardingData.industry,
            companySize: onboardingData.companySize,
            website: onboardingData.website,
            preferredDomains: onboardingData.preferredDomains || [],
            domainRequirements: onboardingData.domainRequirements,
            personas: personas || null,
            personaCount: personas ? personas.length : 0,
            espProvider: onboardingData.espProvider,
            espCredentials: onboardingData.espCredentials || null,
            specialRequirements: onboardingData.specialRequirements,
            stepCompleted: stepCompleted || 0,
            isCompleted: isCompleted || false,
            completedAt: isCompleted ? new Date() : null,
          };

    // Update or create onboarding data
    const onboardingDataResult = await prisma.onboardingData.upsert({
      where: { orderId: order.id },
      update: {
        ...dbData,
        updatedAt: new Date(),
      },
      create: {
        workspaceId: order.workspaceId,
        orderId: order.id,
        ...dbData,
      },
    });

    // If onboarding is completed, update order status
    if (isCompleted) {
        log.info('Onboarding completed, updating order status', { requestId, orderId: order.id });
        
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            status: OrderStatus.DELIVERED,
            fulfilledDate: new Date(),
          },
        });

      // TODO: Create actual inboxes based on the order
      // TODO: Set up domains
      // TODO: Create personas
      // TODO: Send completion email
    }

    return NextResponse.json({ 
      success: true, 
      onboardingData: onboardingDataResult 
    });

  } catch (error) {
    log.error('Error saving onboarding data', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Failed to save onboarding data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Test payload example for onboarding save:
 * 
 * POST /api/onboarding/save
 * {
 *   "sessionId": "cs_test_1234567890",
 *   "businessType": "SaaS",
 *   "industry": "Technology",
 *   "companySize": "10-50",
 *   "website": "https://example.com",
 *   "preferredDomains": ["example.com", "mycompany.com"],
 *   "domainRequirements": "Need custom domain for email",
 *   "espProvider": "Smartlead",
 *   "espCredentials": {
 *     "apiKey": "sk_1234567890",
 *     "username": "user@example.com"
 *   },
 *   "specialRequirements": "Need warmup for cold outreach",
 *   "stepCompleted": 5,
 *   "isCompleted": true,
 *   "customTags": ["enterprise", "high-value"],
 *   "personas": [
 *     {
 *       "fullName": "John Doe",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "role": "CEO",
 *       "tags": ["decision-maker", "enterprise"]
 *     }
 *   ]
 * }
 */
