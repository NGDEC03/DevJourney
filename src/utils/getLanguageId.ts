import axios from "axios";

export const getLanguageId = async (language: string): Promise<number | null> => {
    try {
        const response = await axios.get("https://judge029.p.rapidapi.com/languages", {
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "judge029.p.rapidapi.com",
            },
        });
        const languageMatch = response.data.find((lang:any) =>
            lang.name.toLowerCase().includes(language.toLowerCase())
        );
        return languageMatch ? languageMatch.id : null;
    } catch {
        return null;
    }
};