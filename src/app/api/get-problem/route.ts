import { prisma } from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const problemId = Number(searchParams.get("problem_Id"));

        if (isNaN(problemId)) {
            return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
        }

        const problem = await prisma.problem.findUnique({
            where: {
                problemId,
            },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        return NextResponse.json(problem, { status: 200 });
    } catch (error) {
        console.error("Error fetching problem:", error);
        return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
    }
}
