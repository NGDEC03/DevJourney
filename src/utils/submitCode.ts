import axios from "axios";

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
      
        const submissionRes = await axios.post(
            process.env.sub_url || "",
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = submissionRes.data.token;
        if (!token) throw new Error("No token received from submission");

        const resultUrl = `${process.env.sub_url}/${token}`;
        let resultRes;
        let attempts = 0;

        while (attempts < 10) {
            resultRes = await axios.get(resultUrl, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const status = resultRes.data.status?.description || "";
            if (status !== "In Queue" && status !== "Processing") {
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 1500)); 
            attempts++;
        }

        const data = resultRes?.data;

        return {
            testCaseId: testCase.caseId,
            status: data.status?.description || "Unknown",
            stderr: data.stderr || null,
            stdout: data.stdout || null,
            timeTaken: data.time || 0,
            memoryUsage: data.memory || 0,
        };
    } catch (err) {
        console.error("Submission error:", err);
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};
