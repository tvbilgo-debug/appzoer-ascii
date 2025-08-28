import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Test user created/updated',
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Error creating test user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test user' },
      { status: 500 }
    )
  }
}
