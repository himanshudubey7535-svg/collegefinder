import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'College ID is required' },
        { status: 400 }
      )
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { savedBy: true }
        }
      }
    })

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ college })

  } catch (error) {
    console.error('GET /api/colleges/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    )
  }
}