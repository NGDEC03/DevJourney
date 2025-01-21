import { prisma } from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { subDays, isSameDay } from "date-fns";
import { submitCode } from "@/utils/submitCode";
import { calculateStreak } from "@/utils/calculateStreak";
import { getLanguageId } from "@/utils/getLanguageId";


export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName } = await req.json();
        // console.log(problemId, language, code, userName)

        if (!problemId || !language || !code || !userName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const problem = await prisma.problem.findUnique({
            where: { problemId },
            include: { testCases: true },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const languageId = await getLanguageId(language);
        // console.log(languageId);

        if (!languageId) {
            return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }



        // Elkos Signy Pen



        const results: any[] = [];
        let abortDueToTLE = false;



        // const t:any[]=[]
        // // t.push(problem.testCases[1])
        // t.push(problem.testCases[2])
        // console.log(t);
        // console.log("entered");

        for (const testCase of problem.testCases) {
            if (abortDueToTLE) break;
            // console.log(testCase)

            const { input, output, caseId } = testCase;
            const timeLimit = problem.timeLimit;
            const memoryLimit = problem.memoryLimit;
            const result = await submitCode(code, languageId, {
                input,
                output,
                timeLimit,
                memoryLimit,
                caseId,
            });
            // console.log(result);

            // Check for TLE
            if (result.status.description === "Time Limit Exceeded") {
                abortDueToTLE = true;
            }

            results.push(result);
        }
        // console.log("exited");


        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "Accepted" : "Failed";
        console.log(allPassed, overallStatus);

        const {streak} = await calculateStreak(userName,new Date());

        // console.log(streak+" "+problem.problemId+" "+userName);

        await prisma.$transaction(async (prisma) => {
            await prisma.submission.create({
                data: {
                    status: overallStatus,
                    language: language,
                    problem: {
                        connect: {
                            problemId: problem.problemId
                        }
                    },
                    user: {
                        connect: {
                            userName: userName
                        }
                    }
                }
            });
        
            await prisma.problem.update({
                where: { problemId: problem.problemId },
                data: {
                    attemptCount: { increment: 1 },
                    ...(allPassed && {
                        successCount: { increment: 1 },
                        user: {
                            connect: {
                                userName
                            }
                        }
                    }),
                },
            });
        
            await prisma.user.update({
                where: { userName },
                data: {
                    ...(allPassed && { streak }),
                },
            });
            
        });
        
        const failedTestCase = results.find((result) => result.status !== "Accepted");
        const response = {
            status: overallStatus,
            results,
            ...(failedTestCase && {
                error: `Test case ${failedTestCase.testCaseId} failed: ${failedTestCase.status}`,
            }),
        };
        // console.log(response);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in submission:", error);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}
