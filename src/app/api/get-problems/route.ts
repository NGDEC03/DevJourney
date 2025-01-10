import {prisma} from "@/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const problems = await prisma.problem.findMany()
        return NextResponse.json({ problems })
    }
    catch (err) {
        return NextResponse.json({ err })
    }
}