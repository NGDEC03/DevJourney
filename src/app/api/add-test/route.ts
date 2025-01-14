import { prisma } from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { input, output, explaination, problemId,timeLimit,memoryLimit } = await req.json();
        console.log(input, output, explaination, problemId,timeLimit,memoryLimit);
        await prisma.case.create({
            data: {
                input: input,
                output: output,
                explanation: explaination,
                timeLimit,
                memoryLimit,
                problem:{
                    connect:{
                        problemId
                    }
                }
            }
        })
        return NextResponse.json({
            status: "success",
        })
        
    } catch (error) {
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}