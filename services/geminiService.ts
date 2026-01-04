import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    // Correctly initialize using process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({
      apiKey: "AIzaSyAA-wGPNOroDmAyDANzpd1jbgfEw4iZxZg",
    });
  }

  async getHealthAdvice(
    prompt: string,
    history: { role: string; parts: any[] }[]
  ) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction:
            "You are SwasthAI's Medical Assistant. Provide helpful, empathetic, and professional health information. Always include a disclaimer that you are an AI and not a substitute for professional medical advice. Keep answers concise and informative.",
          temperature: 0.7,
        },
      });
      // Correctly access the .text property from GenerateContentResponse
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
