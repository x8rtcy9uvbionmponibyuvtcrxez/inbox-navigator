import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the session/auth
    // For now, we'll get all orders (you should filter by user/workspace)
    const orders = await prisma.order.findMany({
      include: {
        client: true,
        workspace: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
