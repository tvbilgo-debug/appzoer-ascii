import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const presetSchema = z.object({
  name: z.string().min(1),
  settings: z.record(z.any())
})

// Export a GET handler to prevent build-time errors
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const presets = await prisma.preset.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(presets)
  } catch (error) {
    console.error('Error fetching presets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = presetSchema.parse(body)

    const preset = await prisma.preset.create({
      data: {
        name: validatedData.name,
        settings: JSON.stringify(validatedData.settings),
        userId: session.user.id
      }
    })

    return NextResponse.json(preset, { status: 201 })
  } catch (error) {
    console.error('Error creating preset:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

