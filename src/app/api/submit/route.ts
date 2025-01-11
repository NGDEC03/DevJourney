import { prisma } from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface LangInt {
    id: number;
    name: string;
}

const getLanguageId = async (language: string): Promise<number | null> => {
    const apiUrl = "https://judge029.p.rapidapi.com/languages";
    const apiHeaders = {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "judge029.p.rapidapi.com",
    };

    try {
        const response = await axios.get(apiUrl, { headers: apiHeaders });
        const languages: LangInt[] = response.data;
        const languageMatch = languages.find((lang) =>
            lang.name.toLowerCase().includes(language.toLowerCase())
        );
        return languageMatch ? languageMatch.id : null;
    } catch (error) {
        console.error("Error fetching language ID:", error);
        return null;
    }
};

const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: number },
    apiHeaders: Record<string, string>
) => {
    const apiUrl = "https://judge029.p.rapidapi.com/submissions";
    const options = {
        method: "POST",
        url: apiUrl,
        params: { base64_encoded: "false", wait: "true", fields: "*" },
        headers: apiHeaders,
        data: {
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output,
        },
    };

    try {
        const response = await axios.request(options);
        return {
            testCaseId: testCase.caseId,
            status: response.data.status.description,
            stderr: response.data.stderr,
            stdout: response.data.stdout,
            timeTaken: response.data.time,
            memoryUsage: response.data.memory,
            expected: testCase.output,
        };
    } catch (error) {
        console.error("Error during submission:", error);
        return {
            testCaseId: testCase.caseId,
            status: "Error",
            error: "Submission failed due to an internal error.",
        };
    }
};

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code, userName } = await req.json();

        const problem = await prisma.problem.findUnique({
            where: { problemId },
            include: { tCases: true },
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const languageId = await getLanguageId(language);
        if (!languageId) {
            return NextResponse.json(
                { error: "Unsupported language" },
                { status: 400 }
            );
        }

        const apiHeaders = {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY || "#" ,
            "x-rapidapi-host": "judge029.p.rapidapi.com",
            "Content-Type": "application/json",
        };

        const results = await Promise.all(
            problem.tCases.map((testCase) =>
                submitCode(code, languageId, testCase, apiHeaders)
            )
        );

        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "All Test Cases Passed" : "Some Test Cases Failed";

        await prisma.problem.update({
            where: { problemId },
            data: {
                user: { connect: { userName } },
            },
        });

        return NextResponse.json({ status: overallStatus, results });
    } catch (error) {
        console.error("Error in submit API:", error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
