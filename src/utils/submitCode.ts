import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
        console.log(process.env.sub_url);
        
        const submissionResponse = await axios.post(
            `http://${process.env.sub_url || "api.dev-journey.tech"}/submissions`,
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input
            }
        );

        const { token } = submissionResponse.data;

        let resultResponse;
        let attempts = 0;

        while (attempts < 10) {
            resultResponse = await axios.get(
                `http://${process.env.sub_url || "api.dev-journey.tech"}/submissions/${token}?base64_encoded=false&fields=*`,
            );

            const status = resultResponse.data.status?.description || "";

            if (status !== "In Queue" && status !== "Processing") {
                break;
            }

            await sleep(1500);
            attempts++;
        }

        const data = resultResponse?.data;

        return {
            testCaseId: testCase.caseId,
            status: data.status?.description || "Unknown",
            stderr: data.stderr || null,
            stdout: data.stdout || null,
            timeTaken: data.time || 0,
            memoryUsage: data.memory || 0,
        };
    } catch (err) {
        console.error("Code submission error:", err);
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};
