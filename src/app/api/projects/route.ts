import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['image', 'text', 'batch']),
  settings: z.record(z.any()),
  asciiResult: z.string().optional()
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

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
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
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        type: validatedData.type,
        settings: JSON.stringify(validatedData.settings),
        asciiResult: validatedData.asciiResult || '',
        userId: session.user.id
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
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


