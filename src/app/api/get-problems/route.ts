import {prisma} from "@/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const problems = await prisma.problem.findMany({
            include:{
               testCases:true
            }
        })
        return NextResponse.json({ problems })
    }
    catch (err) {
        return NextResponse.json({ err })
    }
}