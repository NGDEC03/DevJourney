import prisma  from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { input, output, explaination, problemId } = await req.json();
        console.log(input, output, explaination, problemId);
        await prisma.case.create({
            data: {
                input: input,
                output: output,
                explanation: explaination,
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