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
      log.warn('Unauthorized customer orders request', { requestId, error: error?.message });
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

    // Get orders for user's workspaces
    const orders = await prisma.order.findMany({
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    log.info('Customer orders fetched', { requestId, userId: user.id, count: orders.length });

    return NextResponse.json(orders);
  } catch (error) {
    log.error('Error fetching customer orders', error as Error, { requestId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
