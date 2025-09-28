import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
// import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return empty array since database is not set up
    // TODO: Implement proper database queries once Prisma is working
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // For now, return a mock workspace since database is not set up
    // TODO: Implement proper database creation once Prisma is working
    const mockWorkspace = {
      id: `workspace_${Date.now()}`,
      name,
      slug,
      description: description || null,
      ownerId: 'mock_user_id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        id: 'mock_user_id',
        email: 'mock@example.com',
        fullName: 'Mock User',
      },
      _count: {
        members: 1,
        clients: 0,
        domains: 0,
        inboxes: 0,
      },
    };

    console.log('Workspace created successfully:', mockWorkspace);
    return NextResponse.json(mockWorkspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
