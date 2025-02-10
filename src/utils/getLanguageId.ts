import axios from "axios";

export const getLanguageId = async (language: string): Promise<number | null> => {
    console.log(process.env.RAPIDAPI_KEY);
    
    try {
        const response = await axios.get("https://judge0-ce.p.rapidapi.com/languages", {
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
        });
        // console.log(response);
        const languageMatch = response.data.find((lang:any) =>
            lang.name.toLowerCase().includes(language.toLowerCase())
        );
        return languageMatch ? languageMatch.id : null;
    } catch {
        return null;
    }
};