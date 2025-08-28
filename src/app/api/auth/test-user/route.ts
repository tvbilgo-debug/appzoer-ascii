import { NextRequest, NextResponse } from 'next/server'
import { prisma, isBuildTime } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Export a GET handler to prevent build-time errors
export async function GET() {
  return NextResponse.json({ message: 'Test user endpoint' })
}

export async function POST(request: NextRequest) {
  // Prevent database calls during build time
  if (isBuildTime()) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }

  try {
    const hashedPassword = await bcrypt.hash('password123', 12)

    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        password: hashedPassword
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        provider: 'credentials'
      }
    })

    return NextResponse.json(
      { message: 'Test user created/updated successfully', user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test user creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
