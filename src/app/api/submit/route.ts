import { prisma } from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { subDays, isSameDay } from "date-fns";

interface LangInt {
    id: number;
    name: string;
}


const calculateStreak = async (userName:string) => {
    const user = await prisma.user.findUnique({
        where: { userName },
        include: {
            submissions: {
                orderBy: { submittedAt: "desc" },
            },
        },
    });

    if (!user || user.submissions.length === 0) {
        return 0; 
    }

    let streak = 0; 
    const today = new Date();
    let lastStreakDate = today;

    for (const submission of user.submissions) {
        const submissionDate = new Date(submission.submittedAt);

        if (isSameDay(submissionDate, lastStreakDate)) {
            
            streak++;
        } else if (isSameDay(submissionDate, subDays(lastStreakDate, 1))) {

            streak++;
            lastStreakDate = subDays(lastStreakDate, 1);
        } else {
            
            break;
        }
    }

    return streak;
};


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
    testCase: { input: string; output: string; caseId: string;timeLimit:number;memoryLimit:number }
) => {
    try {
        const response = await axios.post(
            "https://judge029.p.rapidapi.com/submissions",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
                cpu_time_limit:testCase.timeLimit,
                memory_limit:testCase.memoryLimit,
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
        console.log(response);
        
        return {
            testCaseId: testCase.caseId,
            status: response.data.status.description,
            stderr: response.data.stderr,
            stdout: response.data.stdout,
            timeTaken: response.data.time,
            memoryUsage: response.data.memory,
        };
    } catch(err){
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName } = await req.json();

        if (!problemId || !language || !code || !userName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
// console.log(problemId,language,code,userName);

        const problem = await prisma.problem.findUnique({
            where: { problemId },
            include: { testCases: true },
        });
        // console.log(problem);
        
        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const languageId = await getLanguageId(language);
        console.log(languageId);
        
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
console.log("entered");

        for (const testCase of problem.testCases) {
            if (abortDueToTLE) break;

            const { input, output, caseId, timeLimit,memoryLimit } = testCase;
            const result = await submitCode(code, languageId, {
                input,
                output,
                timeLimit,
                memoryLimit,
                caseId,
            });
console.log(result);

            // Check for TLE
            if (result.status.description === "Time Limit Exceeded") {
                abortDueToTLE = true;
            }

            results.push(result);
        }
        console.log("exited");
        

        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "Accepted" : "Failed";
console.log(allPassed,overallStatus);

        const streak = await calculateStreak(userName);

        
            prisma.submission.create({
                data: {
                    userId: userName,
                    problemId: problem.problemId,
                    status: overallStatus,
                    language,
                    runtime: results[0]?.timeTaken || null,
                    memory: results[0]?.memoryUsage || null,
                },
            })
        //     prisma.problem.update({
        //         where: { problemId: problem.problemId },
        //         data: {
        //             attemptCount: { increment: 1 },
        //             ...(allPassed && { successCount: { increment: 1 } }),
        //         },
        //     }),
        //     prisma.user.update({
        //         where: { userName },
        //         data: {
        //             ...(allPassed && { streak }),
        //         },
        //     }),
        
        const failedTestCase = results.find((result) => result.status !== "Accepted");
        const response = {
            status: overallStatus,
            results,
            ...(failedTestCase && {
                error: `Test case ${failedTestCase.testCaseId} failed: ${failedTestCase.status}`,
            }),
        };
console.log(response);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in submission:", error);
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 });
    }
}
