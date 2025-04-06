import axios from "axios";

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
console.log(process.env.sub_url);

        const response = await axios.post(
           "https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false&fields=*",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
            },
            {
                headers: {
                    "Content-Type":"application/json",
                   "x-rapidapi-host":"judge0-extra-ce.p.rapidapi.com",
                   "x-rapidapi-key":"2ff3c734fdmshc675eb7785f9d76p13be5djsn486ab81f820d"

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
