import axios from "axios";

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {

        const response = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input
            },
            {
                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY || "#",
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            testCaseId: testCase.caseId,
            status: response.data.status?.description || "Unknown",
            stderr: response.data.stderr || null,
            stdout: response.data.stdout || null,
            timeTaken: response.data.time || 0,
            memoryUsage: response.data.memory || 0,
        };
    } catch (err) {
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};
