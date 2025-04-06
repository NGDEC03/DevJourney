import axios from "axios";

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
console.log(process.env.sub_url);

        const response = await axios.post(
            process.env.sub_url || "",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
            },
            {
                headers: {
                    "Content-Type":"application/json",
                },
            }
        );
console.log(response);

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
