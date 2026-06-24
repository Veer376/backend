import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

async function getGeminiResponse(prompt: string): Promise<any> {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("Gemini Response:", response.text);

    return response.text;
}

export { getGeminiResponse };
