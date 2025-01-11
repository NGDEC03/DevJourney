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
    const user = await prisma.user.findUnique({
      where: { userName },
      include: { problems: true, submissions: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const totalSolved = user.problems.length
    const solvedLastWeek = user.problems.filter(
      (p) => p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    const totalUsers = await prisma.user.count()
    const rankingPercentile = Math.round((1 - (user.ranking || totalUsers) / totalUsers) * 100)

    return NextResponse.json({
      totalSolved,
      solvedLastWeek,
      streak: user.streak,
      ranking: user.ranking,
      rankingPercentile,
      learningProgress: user.learningProgress,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

