import { ai, GEMINI_MODEL } from "./config";
import { FORMATTER_PROMPT } from "./prompts/formatter";

export async function generateFinalResponse(
    contents: any[]
) {
    const response =
        await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                systemInstruction: FORMATTER_PROMPT,
            },
        });

    return response;
}