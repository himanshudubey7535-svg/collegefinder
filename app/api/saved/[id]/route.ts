import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// DELETE — remove a saved college
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyToken(request)

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify this saved college belongs to the logged in user
    const saved = await prisma.savedCollege.findUnique({
      where: { id }
    })

    if (!saved) {
      return NextResponse.json(
        { error: 'Saved college not found' },
        { status: 404 }
      )
    }

    if (saved.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.savedCollege.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'College removed from saved' })

  } catch (error) {
    console.error('DELETE /api/saved/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved college' },
      { status: 500 }
    )
  }
}