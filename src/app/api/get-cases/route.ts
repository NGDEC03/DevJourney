import { prisma } from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        let { problemId, count } = await req.json();
        // console.log(problemId, count);
        let data = await prisma.case.findMany({
            where: { problemId: problemId }
        })
        count = count !== undefined ? count : data.length;
        data = data.slice(0, count);
        // console.log(data.length);
        

        return NextResponse.json({ status: "success", data: data });
        
    } catch (error) {
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}