import axios from "axios";

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
        const response = await axios.post(
            "https://judge029.p.rapidapi.com/submissions",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
                cpu_time_limit: testCase.timeLimit,
                memory_limit: testCase.memoryLimit,
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
        };
    } catch (err) {
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};
