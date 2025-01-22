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
      include: {
        problems: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            problemId: true,
            problemName: true,
            difficulty: true,
            createdAt: true,
          },
        },
        submissions: {
          orderBy: { submittedAt: 'desc' },
          take: 5,
          include: {
            problem: {
              select: { problemName: true, difficulty: true },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const problemDistribution = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    }

    user.problems.forEach((problem:{problemId:string,difficulty:string,problemName:string,createdAt:Date}) => {
      problemDistribution[problem.difficulty as keyof typeof problemDistribution]++
    })

    const distributionResult = [
      { name: 'Easy', value: problemDistribution.Easy, color: '#4ade80' },
      { name: 'Medium', value: problemDistribution.Medium, color: '#fbbf24' },
      { name: 'Hard', value: problemDistribution.Hard, color: '#f87171' },
    ]

    const totalUsers = await prisma.user.count()
    const rankingPercentile = Math.round((1 - (user.ranking || totalUsers) / totalUsers) * 100)

    return NextResponse.json({
      userStats: {
        totalSolved: user.problems.length,
        solvedLastWeek: user.problems.filter(
          (p) => p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        streak: user.streak,
        ranking: user.ranking,
        rankingPercentile,
        learningProgress: user.learningProgress,
      },
      recentProblems: user.problems,
      recentSubmissions: user.submissions,
      problemDistribution: distributionResult,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
