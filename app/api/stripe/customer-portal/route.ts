import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import Stripe from 'stripe';
import { env } from '@/lib/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized customer portal request', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspaces to find Stripe customer ID
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { primaryUserId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      },
      select: { 
        id: true, 
        stripeCustomerId: true 
      }
    });

    // Find workspace with Stripe customer ID
    const workspaceWithCustomer = workspaces.find(w => w.stripeCustomerId);
    
    if (!workspaceWithCustomer?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please make a purchase first.' },
        { status: 404 }
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: workspaceWithCustomer.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    log.info('Customer portal session created', { 
      requestId, 
      userId: user.id,
      customerId: workspaceWithCustomer.stripeCustomerId
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    log.error('Error creating customer portal session', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}