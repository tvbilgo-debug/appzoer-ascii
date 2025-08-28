import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
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
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!userSettings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          theme: 'system',
          defaultWidth: 80,
          defaultCharSet: ' .:-=+*#%@',
          defaultBrightness: 1.0,
          defaultContrast: 1.0,
          defaultGamma: 1.0,
          autoSave: true
        }
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(userSettings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(validatedData.theme && { theme: validatedData.theme }),
        ...(validatedData.defaultWidth && { defaultWidth: validatedData.defaultWidth }),
        ...(validatedData.defaultCharSet && { defaultCharSet: validatedData.defaultCharSet }),
        ...(validatedData.defaultBrightness && { defaultBrightness: validatedData.defaultBrightness }),
        ...(validatedData.defaultContrast && { defaultContrast: validatedData.defaultContrast }),
        ...(validatedData.defaultGamma && { defaultGamma: validatedData.defaultGamma }),
        ...(validatedData.autoSave !== undefined && { autoSave: validatedData.autoSave })
      },
      create: {
        userId: session.user.id,
        theme: validatedData.theme || 'system',
        defaultWidth: validatedData.defaultWidth || 80,
        defaultCharSet: validatedData.defaultCharSet || ' .:-=+*#%@',
        defaultBrightness: validatedData.defaultBrightness || 1.0,
        defaultContrast: validatedData.defaultContrast || 1.0,
        defaultGamma: validatedData.defaultGamma || 1.0,
        autoSave: validatedData.autoSave ?? true
      }
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating user settings:', error)
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


