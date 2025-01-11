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
    const problems = await prisma.problem.findMany({
      where: { userName },
      select: { difficulty: true },
    })

    const distribution = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    }

    problems.forEach((problem) => {
      distribution[problem.difficulty as keyof typeof distribution]++
    })

    const result = [
      { name: 'Easy', value: distribution.Easy, color: '#4ade80' },
      { name: 'Medium', value: distribution.Medium, color: '#fbbf24' },
      { name: 'Hard', value: distribution.Hard, color: '#f87171' },
    ]

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching problem distribution:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

