import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface TokenPayload {
  userId: string
  email: string
}

export function verifyToken(request: NextRequest): TokenPayload | null {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    return payload

  } catch {
    return null
  }
}
