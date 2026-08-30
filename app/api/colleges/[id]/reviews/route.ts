import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyToken(request)

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: collegeId } = await params
    const body = await request.json()
    const { rating, comment } = body

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } })

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: payload.userId,
        collegeId,
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({ review }, { status: 201 })

  } catch (error) {
    console.error('POST /api/colleges/[id]/reviews error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}