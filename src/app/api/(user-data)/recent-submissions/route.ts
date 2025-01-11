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
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: userName },
      include: { problem: true },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    })

    return NextResponse.json(recentSubmissions)
  } catch (error) {
    console.error('Error fetching recent submissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

