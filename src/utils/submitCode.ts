import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache for submission results to avoid redundant API calls
const submissionCache = new Map<string, any>();

// Get the base URL based on environment
const getBaseUrl = () => {
    const subUrl = process.env.NEXT_PUBLIC_SUB_URL || process.env.sub_url || "api.dev-journey.tech";
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
   console.log(protocol)
    return `${protocol}://${subUrl}`;
};

export const submitCode = async (
    code: string,
    languageId: number,
    testCase: { input: string; output: string; caseId: string; timeLimit: number; memoryLimit: number }
) => {
    try {
        const baseUrl = getBaseUrl();
        const submissionUrl = `${baseUrl}/submissions`;
        
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
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        const { token } = submissionResponse.data;

        let resultResponse;
        let attempts = 0;
        let delay = 500; // Start with 500ms delay

        while (attempts < 8) {
            try {
                resultResponse = await axios.get(
                    `${baseUrl}/submissions/${token}?base64_encoded=false&fields=*`,
                    {
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                const status = resultResponse.data.status?.description || "";

                if (status !== "In Queue" && status !== "Processing") {
                    break;
                }

                await sleep(delay);
                delay *= 1.5; // Exponential backoff
                attempts++;
            } catch (error) {
                console.error('Error polling submission result:', error);
                if (attempts >= 7) throw error;
                await sleep(delay);
                delay *= 1.5;
                attempts++;
            }
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
    } catch (error) {
        console.error("Code submission error:", error);
        return { 
            testCaseId: testCase.caseId, 
            status: "Error",
            error: error.message || "An error occurred during submission"
        };
    }
};
