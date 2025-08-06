import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prismaClient";

// Calculate similarity score between user profile and problem
function calculateSimilarityScore(
  userProfile: {
    difficultyDistribution: { Easy: number; Medium: number; Hard: number };
    topicsCovered: Set<string>;
    totalSolved: number;
    streak: number;
  },
  problem: any,
  topicStats: Map<string, { solved: number; total: number }>
) {
  let score = 0;

  const difficultyWeight = {
    Easy: 0.1,
    Medium: 0.3,
    Hard: 0.5,
  };
  score += difficultyWeight[problem.difficulty] * 30;

  const topicCoverage = problem.tags.filter((tag: string) =>
    userProfile.topicsCovered.has(tag)
  ).length;
  score += (topicCoverage / problem.tags.length) * 25;

  const topicSuccessRates = problem.tags.map((tag: string) => {
    const stats = topicStats.get(tag);
    return stats ? stats.solved / stats.total : 0;
  });
  const avgSuccessRate =
    topicSuccessRates.reduce((a: number, b: number) => a + b, 0) /
    topicSuccessRates.length;
  score += avgSuccessRate * 20;

  const progressScore = Math.min(userProfile.totalSolved / 100, 1);
  score += progressScore * 15;

  const streakBonus = Math.min(userProfile.streak / 10, 1);
  score += streakBonus * 10;

  return score;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session.user);
    
    if (!session?.user?.Email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const problems = await prisma.problem.findMany();
    const user = await prisma.user.findUnique({
      where: { email: session.user.Email },
      include: {
        problems: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const solvedProblems = user.problems;

    // Calculate difficulty distribution
    const difficultyCount = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    solvedProblems.forEach((problem) => {
      difficultyCount[problem.difficulty as keyof typeof difficultyCount]++;
    });

    // Get topics covered and their success rates
    const topicStats = new Map<string, { solved: number; total: number }>();
    problems.forEach((p) => {
      p.tags.forEach((tag) => {
        const stat = topicStats.get(tag) || { solved: 0, total: 0 };
        stat.total++;
        topicStats.set(tag, stat);
      });
    });

    solvedProblems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        const stats = topicStats.get(tag) || { solved: 0, total: 0 };
        stats.solved++;
        topicStats.set(tag, stats);
      });
    });

    const userProfile = {
      difficultyDistribution: difficultyCount,
      topicsCovered: new Set(solvedProblems.flatMap((p) => p.tags)),
      totalSolved: solvedProblems.length,
      streak: user.streak || 0,
    };

    const problemScores = problems
      .filter((p) => !solvedProblems.some((sp) => sp.problemId === p.problemId))
      .map((problem) => ({
        problem,
        score: calculateSimilarityScore(userProfile, problem, topicStats),
      }))
      .sort((a, b) => b.score - a.score);

    // Select top 3 problems and randomly choose one to add variety
    const topProblems = problemScores.slice(0, 3);
    const selectedProblem =
      topProblems[Math.floor(Math.random() * topProblems.length)].problem;

    // Determine learning path and topic focus
    const weakTopics = Array.from(topicStats.entries())
      .filter(([_, stats]) => stats.solved / stats.total < 0.6)
      .map(([topic]) => topic);

    const learningPath = weakTopics.length > 0 ? "Topic Improvement" : "New Topic Exploration";
    const topicFocus = selectedProblem.tags.find((tag) =>
      weakTopics.includes(tag)
    ) || selectedProblem.tags[0];

    return NextResponse.json({
      problem: selectedProblem,
      learningPath,
      topicFocus,
      userStats: {
        totalSolved: solvedProblems.length,
        difficultyDistribution: difficultyCount,
        weakTopics: weakTopics.slice(0, 3),
        similarityScore: problemScores[0].score,
      },
    });
  } catch (error) {
    console.error("Error in POTD:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 