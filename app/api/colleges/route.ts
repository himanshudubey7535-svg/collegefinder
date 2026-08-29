import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || ''
    const state = searchParams.get('state') || ''
    const minFees = parseInt(searchParams.get('minFees') || '0')
    const maxFees = parseInt(searchParams.get('maxFees') || '10000000')
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validate pagination inputs
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Build filter conditions
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { location: { contains: search, mode: 'insensitive' as const } },
          ]
        } : {},
        state ? { state: { contains: state, mode: 'insensitive' as const } } : {},
        { fees: { gte: minFees, lte: maxFees } },
        { rating: { gte: minRating } },
      ]
    }

    // Run both queries in parallel for performance
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          fees: true,
          rating: true,
          description: true,
        }
      }),
      prisma.college.count({ where })
    ])

    return NextResponse.json({
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('GET /api/colleges error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    )
  }
}