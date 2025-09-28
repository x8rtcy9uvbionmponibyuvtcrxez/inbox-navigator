import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get total counts
    const [
      totalInboxes,
      totalDomains,
      totalOrders,
      totalClients,
      recentOrders,
      recentInboxes
    ] = await Promise.all([
      prisma.inbox.count(),
      prisma.domain.count(),
      prisma.order.count(),
      prisma.client.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: true }
      }),
      prisma.inbox.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: true }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalInboxes,
        totalDomains,
        totalOrders,
        totalClients
      },
      recentOrders,
      recentInboxes
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard stats', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
