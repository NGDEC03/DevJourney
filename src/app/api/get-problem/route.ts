import prisma from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const problemId = searchParams.get("problem_Id") || "67853a1d15827bfa11f500d7";
console.log(problemId);

        const problem = await prisma.problem.findUnique({
            where: {
                problemId,
            },
            include:{
                testCases:true
            }
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        return NextResponse.json(problem, { status: 200 });
    } catch (error) {
        console.error("Error fetching problem:");
        return NextResponse.json({ error: `An internal server error occurred \n${error}` }, { status: 500 });
    }
}
