import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';
import { InboxType, InboxStatus, InboxESP } from '@prisma/client';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized inboxes request', { requestId, error: error?.message });
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

    // Get inboxes for user's workspaces
    const inboxes = await prisma.inbox.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      },
      include: {
        domain: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        personas: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    log.info('Inboxes fetched', { requestId, userId: user.id, count: inboxes.length });

    return NextResponse.json(inboxes);
  } catch (error) {
    log.error('Error fetching inboxes', error as Error, { requestId });
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
      log.warn('Unauthorized inbox creation', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      email, 
      name, 
      domainId, 
      clientId, 
      workspaceId, 
      esp = 'GSUITE',
      tags = [],
      personaIds = []
    } = await request.json();

    if (!email || !domainId || !workspaceId) {
      return NextResponse.json(
        { error: 'Email, domainId, and workspaceId are required' },
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

    // Verify domain exists and belongs to workspace
    const domain = await prisma.domain.findFirst({
      where: {
        id: domainId,
        workspaceId: workspaceId
      }
    });

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found or access denied' },
        { status: 404 }
      );
    }

    // Check if email already exists
    const existingInbox = await prisma.inbox.findUnique({
      where: { email }
    });

    if (existingInbox) {
      return NextResponse.json(
        { error: 'Email address already exists' },
        { status: 409 }
      );
    }

    // Create inbox
    const inbox = await prisma.inbox.create({
      data: {
        email,
        name: name || email.split('@')[0],
        domainId,
        clientId: clientId || null,
        workspaceId,
        esp: esp as InboxESP,
        status: InboxStatus.PENDING,
        tags: tags,
      },
      include: {
        domain: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    // Connect personas if provided
    if (personaIds.length > 0) {
      await prisma.inbox.update({
        where: { id: inbox.id },
        data: {
          personas: {
            connect: personaIds.map((id: string) => ({ id }))
          }
        }
      });
    }

    log.info('Inbox created successfully', { 
      requestId, 
      inboxId: inbox.id, 
      email: inbox.email,
      userId: user.id 
    });

    return NextResponse.json(inbox, { status: 201 });
  } catch (error) {
    log.error('Error creating inbox', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
