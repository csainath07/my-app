// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export async function generateReviewFeedback(code_diff) {
    // Load OpenAI
    const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
    
    const prompt = `Act as a senior software engineer reviewing the following code pull request diff: ${code_diff}
        Your primary goal is to provide clear, targeted code review feedback, with each comment precisely linked to a specific file and line number.
        Evaluate the changes based on key software engineering principles, including (but not limited to):
        - Readability & Maintainability
        - Correctness & Robustness
        - Testability & Test Coverage
        - Design & Architecture
        - Security
        - Performance
        - Adherence to Standards
        For your output, respond with a JSON array called "comments", where each object contains:
        - "body": (string) — The review comment text explaining the issue and suggestion clearly.
        - "path": (string) — The file path relative to the repository root (e.g., "src/components/Button.tsx").
        - "side": (string) — Always "RIGHT" (indicating the new changes side).
        - "line": (integer) — The line number in the diff where the comment should be placed.
        Also, after the array, provide:
        - "overall_score" (integer, 1-10): A holistic score for the overall code quality.
        - "score_justification" (string): A short paragraph explaining the key reasons for the assigned score.
        Respond strictly with valid JSON, without any extra commentary or text outside the JSON structure.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    return response.text;
}