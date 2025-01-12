import { prisma } from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { subDays, isSameDay } from "date-fns";

interface LangInt {
    id: number;
    name: string;
}

const getLanguageId = async (language: string): Promise<number | null> => {
    try {
        const response = await axios.get("https://judge029.p.rapidapi.com/languages", {
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "judge029.p.rapidapi.com",
            },
        });
        const languageMatch = response.data.find((lang: LangInt) =>
            lang.name.toLowerCase().includes(language.toLowerCase())
        );
        return languageMatch ? languageMatch.id : null;
    } catch {
        return null;
    }
};

const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: number }
) => {
    try {
        const response = await axios.post(
            "https://judge029.p.rapidapi.com/submissions",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output,
            },
            {
                params: { base64_encoded: "false", wait: "true", fields: "*" },
                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY || "#",
                    "x-rapidapi-host": "judge029.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            testCaseId: testCase.caseId,
            status: response.data.status.description,
            stderr: response.data.stderr,
            stdout: response.data.stdout,
            timeTaken: response.data.time,
            memoryUsage: response.data.memory,
            expected: testCase.output,
        };
    } catch {
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName } = await req.json();
        const problem = await prisma.problem.findUnique({
            where: { problemId: parseInt(problemId) },
            include: { testCases: true },
        });

        if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

        const languageId = await getLanguageId(language);
        if (!languageId) return NextResponse.json({ error: "Unsupported language" }, { status: 400 });

        console.log(problem, languageId);
        const results = await Promise.all(
            problem.testCases.map((testCase) =>
                submitCode(code, languageId, testCase)
            )
        );
        console.log(results);

        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "Accepted" : "Failed";

        const submission = await prisma.submission.create({
            data: {
                userId: userName,
                problemId: problem.problemId,
                status: overallStatus,
                language,
                runtime: results[0]?.timeTaken || null,
                memory: results[0]?.memoryUsage || null,
            },
        });

        await prisma.problem.update({
            where: { problemId: problem.problemId },
            data: {
                attemptCount: { increment: 1 },
                ...(allPassed && { successCount: { increment: 1 } }),
                ...(allPassed && { user: { connect: { userName } } })
            },
        });
        const user = await prisma.user.findUnique({
            userName,
            include: {
                submissions: true
            }
        })

        const lastSubmissionDate = user.submissions[user.submissions.length - 1].submittedAt
        const today = new Date()
        let streak = 1
        const yesterday = subDays(today, 1)
        if (lastSubmissionDate) {
            const lastDate = new Date(lastSubmissionDate)
            if (isSameDay(lastDate, yesterday)) {
                streak = (user.streak || 0) + 1

            }
        }
        await prisma.user.update({
            where: {
                userName
            },
            data: {
                ...(allPassed && {
                    streak
                })
            }
        })

        await prisma.submission.update({
            where: { id: submission.id },
            data: {
                problem: { connect: { problemId } },
                user: { connect: { userName } }
            }
        })

        console.log("here")
        console.log(allPassed)
        return NextResponse.json({
            status: overallStatus,
            results,
            submissionId: submission.id,
        });
    } catch {
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}