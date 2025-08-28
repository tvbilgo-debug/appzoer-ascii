import { NextRequest, NextResponse } from 'next/server'
import { prisma, isBuildTime } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Export a GET handler to prevent build-time errors
export async function GET() {
  return NextResponse.json({ message: 'Register endpoint' })
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
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: 'credentials'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // Create default user settings
    await prisma.userSettings.create({
      data: {
        userId: user.id
      }
    })

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    // Handle Prisma connection errors
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 503 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


