import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  defaultWidth: z.number().min(20).max(200).optional(),
  defaultCharSet: z.string().optional(),
  defaultBrightness: z.number().min(0.1).max(3.0).optional(),
  defaultContrast: z.number().min(0.1).max(3.0).optional(),
  defaultGamma: z.number().min(0.1).max(3.0).optional(),
  autoSave: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.userSettings.create({
        data: { userId: session.user.id }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get user settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updateData = settingsSchema.parse(body)

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId: session.user.id }
      })
    }

    const updatedSettings = await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: updateData
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update user settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


