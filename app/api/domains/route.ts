import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { DomainStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized domains request', { requestId, error: error?.message });
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

    // Get domains for user's workspaces
    const domains = await prisma.domain.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        inboxes: {
          select: {
            id: true,
            email: true,
            status: true
          }
        },
        _count: {
          select: {
            inboxes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    log.info('Domains fetched', { requestId, userId: user.id, count: domains.length });

    return NextResponse.json(domains);
  } catch (error) {
    log.error('Error fetching domains', error as Error, { requestId });
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
      log.warn('Unauthorized domain creation', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, 
      workspaceId, 
      clientId, 
      redirectUrl,
      boughtByInboxNav = false,
      stripeCustomerId
    } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Domain name and workspaceId are required' },
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

    // Check if domain already exists
    const existingDomain = await prisma.domain.findUnique({
      where: { name }
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: 'Domain already exists' },
        { status: 409 }
      );
    }

    // Create domain
    const domain = await prisma.domain.create({
      data: {
        name,
        workspaceId,
        clientId: clientId || null,
        redirectUrl: redirectUrl || null,
        boughtByInboxNav,
        stripeCustomerId: stripeCustomerId || null,
        status: DomainStatus.PENDING,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            inboxes: true
          }
        }
      }
    });

    log.info('Domain created successfully', { 
      requestId, 
      domainId: domain.id, 
      name: domain.name,
      userId: user.id 
    });

    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    log.error('Error creating domain', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
