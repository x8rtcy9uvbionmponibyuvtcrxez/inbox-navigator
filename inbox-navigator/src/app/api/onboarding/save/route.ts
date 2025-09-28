import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      businessName,
      businessType,
      industry,
      companySize,
      website,
      preferredDomains,
      domainRequirements,
      personas,
      espProvider,
      specialRequirements,
      stepCompleted,
      isCompleted,
    } = await request.json();

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

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update or create onboarding data
    const onboardingData = await prisma.onboardingData.upsert({
      where: { workspaceId: order.workspaceId },
      update: {
        businessName,
        businessType,
        industry,
        companySize,
        website,
        preferredDomains: preferredDomains || [],
        domainRequirements,
        personas: personas || [],
        espProvider,
        specialRequirements,
        stepCompleted: stepCompleted || 0,
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        workspaceId: order.workspaceId,
        orderId: order.id,
        businessName,
        businessType,
        industry,
        companySize,
        website,
        preferredDomains: preferredDomains || [],
        domainRequirements,
        personas: personas || [],
        espProvider,
        specialRequirements,
        stepCompleted: stepCompleted || 0,
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
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
      onboardingData 
    });

  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
