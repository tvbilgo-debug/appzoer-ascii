import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const presetSchema = z.object({
  name: z.string().min(1, 'Preset name is required'),
  settings: z.any(),
  isPublic: z.boolean().default(false)
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

    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get('public') === 'true'

    const where: any = {
      OR: [
        { userId: session.user.id },
        { isPublic: true }
      ]
    }

    if (isPublic) {
      where.isPublic = true
    }

    const presets = await prisma.preset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        settings: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(presets)
  } catch (error) {
    console.error('Get presets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const presetData = presetSchema.parse(body)

    const preset = await prisma.preset.create({
      data: {
        name: presetData.name,
        settings: JSON.stringify(presetData.settings),
        isPublic: presetData.isPublic,
        userId: session.user.id
      }
    })

    return NextResponse.json(preset, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create preset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

