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
      log.warn('Unauthorized user request', { requestId, error: error?.message });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        ownedWorkspaces: {
          include: {
            _count: {
              select: {
                members: true,
                clients: true,
                domains: true,
                inboxes: true,
              }
            }
          }
        }
      }
    });

    if (!dbUser) {
      log.warn('User not found in database', { requestId, userId: user.id });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    log.info('User data retrieved', { requestId, userId: user.id, userRole: dbUser.role });

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      fullName: dbUser.fullName,
      role: dbUser.role,
      avatarUrl: dbUser.avatarUrl,
      workspaces: dbUser.ownedWorkspaces,
    });

  } catch (error) {
    log.error('Error fetching user', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
