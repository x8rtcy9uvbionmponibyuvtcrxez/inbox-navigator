import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { log } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      log.warn('Unauthorized workspace request', { requestId, error: error?.message });
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
      include: {
        primaryUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            members: true,
            clients: true,
            domains: true,
            inboxes: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    log.info('Workspaces fetched', { requestId, userId: user.id, count: workspaces.length });

    return NextResponse.json(workspaces);
  } catch (error) {
    log.error('Error fetching workspaces', error as Error, { requestId });
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
      log.warn('Unauthorized workspace creation', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug }
    });

    if (existingWorkspace) {
      return NextResponse.json(
        { error: 'Workspace with this name already exists' },
        { status: 409 }
      );
    }

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description: description || null,
        primaryUserId: user.id,
      },
      include: {
        primaryUser: {
          select: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            members: true,
            clients: true,
            domains: true,
            inboxes: true,
          }
        }
      }
    });

    // Add user as workspace member
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'OWNER'
      }
    });

    log.info('Workspace created successfully', { requestId, workspaceId: workspace.id, userId: user.id });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    log.error('Error creating workspace', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
