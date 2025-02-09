import prisma from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { tests, problemId } = await req.json();
        const responses = await Promise.all(tests.map(async (test) => {
            try {
                // console.log(test);
                return await prisma.case.create({
                    data: {
                        input: test.input,
                        output: test.output,
                        explanation: test.explanation,
                        problem:{
                            connect:{
                                problemId
                            }
                        }
                    }
                })
            } catch (error) {
                return { error: error || "Failed to add test case" };
            }
        }));
        return NextResponse.json({
            status: "Success",
            response: responses,
        })
    } catch (error) {
        return NextResponse.json({ error: error }, {
            status: 500
        });
    }
}