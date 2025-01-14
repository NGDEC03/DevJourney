import { prisma } from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        let { problemId, count } = await req.json();
        // console.log(problemId, count);
        let data = await prisma.case.findMany({
            where: { problemId: problemId },
            take:count
        })
  

        return NextResponse.json({ status: "success", data: data });
        
    } catch (error) {
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}