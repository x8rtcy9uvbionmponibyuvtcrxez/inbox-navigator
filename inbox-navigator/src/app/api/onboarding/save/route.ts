import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    console.log('Onboarding save request:', { 
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

    console.log('Order found:', order ? 'Yes' : 'No', order?.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare data for database - convert arrays to JSON strings for SQLite
    const dbData = {
      ...onboardingData,
      customTags: customTags ? JSON.stringify(customTags) : null,
      personas: personas ? JSON.stringify(personas) : null,
      stepCompleted: stepCompleted || 0,
      isCompleted: isCompleted || false,
      completedAt: isCompleted ? new Date() : null,
    };

    // Update or create onboarding data
    const onboardingDataResult = await prisma.onboardingData.upsert({
      where: { workspaceId: order.workspaceId },
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
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'COMPLETED',
          fulfilledAt: new Date(),
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
    console.error('Error saving onboarding data:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to save onboarding data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
