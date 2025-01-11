import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userName = searchParams.get('userName')

  if (!userName) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const recentProblems = await prisma.problem.findMany({
      where: { userName },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json(recentProblems)
  } catch (error) {
    console.error('Error fetching recent problems:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

