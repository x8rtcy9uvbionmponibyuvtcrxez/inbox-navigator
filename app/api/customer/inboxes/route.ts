import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the session/auth
    // For now, we'll get all inboxes (you should filter by user/workspace)
    const inboxes = await prisma.inbox.findMany({
      include: {
        domain: {
          select: {
            name: true,
          }
        },
        personas: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(inboxes)
  } catch (error) {
    console.error('Error fetching customer inboxes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inboxes' },
      { status: 500 }
    )
  }
}
