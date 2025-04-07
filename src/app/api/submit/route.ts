import prisma from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { subDays, isSameDay } from "date-fns";
import { submitCode } from "@/utils/submitCode";
import { calculateStreak } from "@/utils/calculateStreak";
import { getLanguageId } from "@/utils/getLanguageId";

interface TestCase {
    input: string;
    output: string;
    caseId: string;
}

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 30;
const MAX_TEST_CASES = 20; 
const BATCH_SIZE = 3; 

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName, test } = await req.json();

        if (!problemId || !language || !code || !userName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const now = Date.now();
        const userRateLimit = rateLimit.get(userName);
        if (userRateLimit) {
            if (now - userRateLimit.timestamp > RATE_LIMIT_WINDOW) {
                rateLimit.set(userName, { count: 1, timestamp: now });
            } else if (userRateLimit.count >= MAX_REQUESTS) {
                return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
            } else {
                userRateLimit.count++;
            }
        } else {
            rateLimit.set(userName, { count: 1, timestamp: now });
        }

        const [problem, languageId] = await Promise.all([
            prisma.problem.findUnique({
                where: { problemId },
                include: { testCases: true },
            }),
            getLanguageId(language)
        ]);

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        if (!languageId) {
            return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }

        let cases = test !== -1 ? problem.testCases.slice(0, test) : problem.testCases;
        let warning = null;
        
        if (cases.length > MAX_TEST_CASES) {
            warning = `Note: Only the first ${MAX_TEST_CASES} test cases will be evaluated due to system limitations.`;
            cases = cases.slice(0, MAX_TEST_CASES);
        }

        const results = [];
        for (let i = 0; i < cases.length; i += BATCH_SIZE) {
            const batch = cases.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(async (testCase: TestCase) => {
                    try {
                        const { input, output, caseId } = testCase;
                        const result = await submitCode(code, languageId, {
                            input,
                            output,
                            timeLimit: problem.timeLimit,
                            memoryLimit: problem.memoryLimit,
                            caseId,
                        });
console.log(result.stderr);

                        if (result.stderr) {
                            return {
                                ...result,
                                status: "Error",
                                testCaseId: caseId,
                                error: result.stderr
                            };
                        }

                        const isCorrect = result.stdout?.trim() === output.trim();
                        return {
                            ...result,
                            status: isCorrect ? "Accepted" : "Wrong Answer",
                            testCaseId: caseId
                        };
                    } catch (error: any) {
                        console.error(`Error processing test case ${testCase.caseId}:`, error);
                        return {
                            testCaseId: testCase.caseId,
                            status: "Error",
                            error: error.message || "An error occurred while processing this test case",
                            stderr: error.message || "An error occurred while processing this test case"
                        };
                    }
                })
            );
            results.push(...batchResults);
        }

        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "Accepted" : "Failed";

        if (test === -1) {
            try {
                const { streak } = await calculateStreak(userName, new Date());

                await prisma.$transaction([
                    prisma.submission.create({
                        data: {
                            status: overallStatus,
                            language: language,
                            problem: { connect: { problemId: problem.problemId } },
                            user: { connect: { userName } }
                        }
                    }),
                    prisma.problem.update({
                        where: { problemId: problem.problemId },
                        data: {
                            attemptCount: { increment: 1 },
                            ...(allPassed && {
                                successCount: { increment: 1 },
                                user: { connect: { userName } }
                            })
                        }
                    }),
                    prisma.user.update({
                        where: { userName },
                        data: allPassed ? { streak } : {}
                    })
                ]);
            } catch (error: any) {
                console.error("Error updating database:", error);
            }
        }

        const failedTestCase = results.find((result) => result.status !== "Accepted");
        return NextResponse.json({
            status: overallStatus,
            results,
            warning,
            ...(failedTestCase && {
                error: `Test case ${failedTestCase.testCaseId} failed: ${failedTestCase.status}`
            })
        });
    } catch (error: any) {
        console.error("Error in submission:", error);
        return NextResponse.json({ 
            error: "An internal error occurred",
            details: error.message || "Unknown error"
        }, { status: 500 });
    }
}
