import { prisma } from "@/prismaClient";
// import { Tag } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { number } from "yup";

interface ProblemInput {
  problemName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemD: string;
  timeLimit: number;
  memoryLimit: number;
  tags: string[];
}

export async function POST(req: NextRequest) {
  try {
const problemData=await req.json() as ProblemInput
    // console.log(problemData);
    problemData.memoryLimit = Number(problemData.memoryLimit)
    problemData.timeLimit = Number(problemData.timeLimit)
    // const count = String(Number(await prisma.problem.count()) + 1);
    const problem = await prisma.problem.create({
      data: {
        problemDescription: problemData.problemD,
        problemName: problemData.problemName,
        difficulty: problemData.difficulty,
        tags: problemData.tags,
        memoryLimit:problemData.memoryLimit,
        timeLimit:problemData.timeLimit
      },
    });
    
    // console.log(problem);

    return NextResponse.json({ 
      success: true,
      data: problem
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ 
      success: false,
      error: err instanceof Error ? err.message : "Internal server error"
    }, { 
      status: 500 
    });
  }
}