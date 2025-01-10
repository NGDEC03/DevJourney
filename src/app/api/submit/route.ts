import { prisma } from "@/prismaClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface LangInt {
    id: number;
    name: string;
}

// Function to fetch language ID from Judge0 API
const getLanguageId = async (language: string): Promise<number | null> => {
    const options = {
        method: "GET",
        url: "https://judge029.p.rapidapi.com/languages",
        headers: {
            "x-rapidapi-key": "2ff3c734fdmshc675eb7785f9d76p13be5djsn486ab81f820d",
            "x-rapidapi-host": "judge029.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
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

export async function POST(req: NextRequest) {
    try {
        const { problemId, language, code } = await req.json();

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

        const results = [];
        const apiHeaders = {
            "x-rapidapi-key": "2ff3c734fdmshc675eb7785f9d76p13be5djsn486ab81f820d",
            "x-rapidapi-host": "judge029.p.rapidapi.com",
            "Content-Type": "application/json",
        };

        for (const testCase of problem.tCases) {
            const options = {
                method: "POST",
                url: "https://judge029.p.rapidapi.com/submissions",
                params: { base64_encoded: "false", wait: "true", fields: "*" },
                headers: apiHeaders,
                data: {
                    source_code: code,
                    language_id: languageId,
                    stdin: testCase.input, // Assuming `input` is plain text
                    expected_output: testCase.output,
                },
            };

            try {
                const response = await axios.request(options);

                results.push({
                    testCaseId: testCase.caseId,
                    status: response.data.status.description, // E.g., "Accepted" or "Wrong Answer"
                    output: response.data.stdout,
                    expected: testCase.output,
                });
            } catch (error) {
                console.error("Error during submission:", error);
                results.push({
                    testCaseId: testCase.caseId,
                    status: "Error",
                    error: "Submission failed due to an internal error.",
                });
            }
        }

        const allPassed = results.every((result) => result.status === "Accepted");
        const overallStatus = allPassed ? "All Test Cases Passed" : "Some Test Cases Failed";

        return NextResponse.json({ status: overallStatus, results });
    } catch (err) {
        console.error("Error in submit API:", err);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
