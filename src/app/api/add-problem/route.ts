import prisma from "@/prismaClient";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest) {

    try {
        const body = await req.json()
        const { name, difficulty, description, tLimit, mLimit } = body
        const problem = await prisma.problem.create({
            data: {
                problemName: name,
                difficulty,
                problemD: description,
                timeLimit: tLimit,
                memoryLimit: mLimit
            }
        })
        return NextResponse.json({ problem })
    }
    catch (err) {
        return NextResponse.json({ err })
    }
}