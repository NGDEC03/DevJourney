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

   
    const problem = await prisma.problem.create({
      data: {
        problemDescription: problemData.problemD,
        problemName: problemData.problemName,
        memoryLimit: problemData.memoryLimit,
        timeLimit: problemData.timeLimit,
        difficulty: problemData.difficulty,
        tags: problemData.tags
      }
    });

    return NextResponse.json({ 
      success: true,
      data: problem
    });

  } catch (err) {
    console.error("Error creating problem:", err);
    return NextResponse.json({ 
      success: false,
      error: err instanceof Error ? err.message : "Internal server error"
    }, { 
      status: 500 
    });
  }
}