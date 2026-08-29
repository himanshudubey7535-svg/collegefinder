import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET — fetch all saved colleges for logged in user
export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request)

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: payload.userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            state: true,
            fees: true,
            rating: true,
            description: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ savedColleges })

  } catch (error) {
    console.error('GET /api/saved error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved colleges' },
      { status: 500 }
    )
  }
}

// POST — save a college
export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request)

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { collegeId } = body

    if (!collegeId) {
      return NextResponse.json(
        { error: 'College ID is required' },
        { status: 400 }
      )
    }

    // Check college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId }
    })

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      )
    }

    // @@unique on [userId, collegeId] prevents duplicates at DB level
    // But we catch it here to return a clean error message
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: payload.userId,
          collegeId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'College already saved' },
        { status: 409 }
      )
    }

    const saved = await prisma.savedCollege.create({
      data: {
        userId: payload.userId,
        collegeId
      }
    })

    return NextResponse.json(
      { message: 'College saved', saved },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/saved error:', error)
    return NextResponse.json(
      { error: 'Failed to save college' },
      { status: 500 }
    )
  }
}