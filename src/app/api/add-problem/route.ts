import { prisma } from "@/prismaClient";
// import { Tag } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

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
    // const count = String(Number(await prisma.problem.count()) + 1);
    const problem = await prisma.problem.create({
      data: {
        problemDescription: problemData.problemD,
        problemName: problemData.problemName,
        memoryLimit: problemData.memoryLimit,
        timeLimit: problemData.timeLimit,
        difficulty: problemData.difficulty,
        tags: problemData.tags
      },
    });
    
    // console.log(problem);

    return NextResponse.json({ 
      success: true,
      data: problem
    });

  } catch (err) {
    console.log("Error creating problem:");
    return NextResponse.json({ 
      success: false,
      error: err instanceof Error ? err.message : "Internal server error"
    }, { 
      status: 500 
    });
  }
}