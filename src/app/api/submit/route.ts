import prisma from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { submitCode } from "@/utils/submitCode";
import { getLanguageId } from "@/utils/getLanguageId";

interface TestCase {
    input: string;
    output: string;
    caseId: string;
}

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 30;
const MAX_TEST_CASES_PER_BATCH = 5; // Reduced to match Vercel's limits
const BATCH_SIZE = 2; // Process 2 test cases at a time
const MAX_EXECUTION_TIME = 8000; // 8 seconds timeout

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName, test, customInput, batchIndex = 0 } = await req.json();

        if (!problemId || !language || !code || !userName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        let cases = [];
        if (test === -1) {
            // For full submission, get the next batch of test cases
            const startIndex = batchIndex * MAX_TEST_CASES_PER_BATCH;
            cases = problem.testCases.slice(startIndex, startIndex + MAX_TEST_CASES_PER_BATCH);
        } else if (customInput) {
            cases = [{
                caseId: 'custom',
                input: customInput,
                output: '',
                timeLimit: problem.timeLimit,
                memoryLimit: problem.memoryLimit
            }];
        } else {
            cases = problem.testCases.slice(0, test);
        }

        const results = [];
        const startTime = Date.now();

        for (let i = 0; i < cases.length; i += BATCH_SIZE) {
            if (Date.now() - startTime > MAX_EXECUTION_TIME) {
                return NextResponse.json({
                    status: "Timeout",
                    results,
                    warning: "Execution timed out. Some test cases were not processed.",
                    error: "Execution time exceeded the limit"
                }, { status: 200 });
            }

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

        // For full submissions, check if there are more test cases to process
        const hasMoreTestCases = test === -1 && 
            (batchIndex + 1) * MAX_TEST_CASES_PER_BATCH < problem.testCases.length;

        return NextResponse.json({
            status: "Success",
            results,
            hasMoreTestCases,
            nextBatchIndex: hasMoreTestCases ? batchIndex + 1 : null,
            totalTestCases: problem.testCases.length
        });
    } catch (error: any) {
        console.error("Error in submit route:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred during submission" },
            { status: 500 }
        );
    }
}
