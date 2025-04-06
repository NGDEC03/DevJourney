import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache for submission results to avoid redundant API calls
const submissionCache = new Map<string, any>();

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
        const submissionUrl = `http://${process.env.sub_url || "api.dev-journey.tech"}/submissions`;
        
        // Check cache first
        const cacheKey = `${code}-${languageId}-${testCase.input}`;
        if (submissionCache.has(cacheKey)) {
            return submissionCache.get(cacheKey);
        }

        const submissionResponse = await axios.post(
            submissionUrl,
            {
                source_code: code,
                language_id: languageId,
                stdin: testCase.input
            }
        );

        const { token } = submissionResponse.data;

        let resultResponse;
        let attempts = 0;
        let delay = 500; // Start with 500ms delay

        while (attempts < 8) { // Reduced max attempts since we're using exponential backoff
            resultResponse = await axios.get(
                `http://${process.env.sub_url || "api.dev-journey.tech"}/submissions/${token}?base64_encoded=false&fields=*`,
            );

            const status = resultResponse.data.status?.description || "";

            if (status !== "In Queue" && status !== "Processing") {
                break;
            }

            await sleep(delay);
            delay *= 1.5; // Exponential backoff
            attempts++;
        }

        const data = resultResponse?.data;
        const result = {
            testCaseId: testCase.caseId,
            status: data.status?.description || "Unknown",
            stderr: data.stderr || null,
            stdout: data.stdout || null,
            timeTaken: data.time || 0,
            memoryUsage: data.memory || 0,
        };

        // Cache the result
        submissionCache.set(cacheKey, result);

        return result;
    } catch (err) {
        console.error("Code submission error:", err);
        return { testCaseId: testCase.caseId, status: "Error" };
    }
};
