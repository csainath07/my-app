// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export async function generateReviewFeedback(code_diff) {
    // Load OpenAI
    const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
    
    const prompt = `
    Act as a senior software engineer reviewing the following code pull request diff: ${code_diff}

    Your primary goal is to provide clear, constructive feedback to help the developer improve their code quality.

    Evaluate the changes based on key software engineering principles, including (but not limited to):

    1. Readability & Maintainability: (Clarity, simplicity, naming conventions, comments, style consistency, modularity)
    2. Correctness & Robustness: (Logical soundness, handling of edge cases and errors, potential bugs)
    3. Testability & Test Coverage: (Presence, quality, and sufficiency of automated tests for the changes)
    4. Design & Architecture: (Adherence to established patterns, SOLID principles, project architecture, avoiding unnecessary complexity or coupling)
    5. Security: (Awareness and mitigation of potential security vulnerabilities relevant to the changes)
    6. Performance: (Consideration of obvious performance implications or anti-patterns)
    7. Adherence to Standards: (Compliance with project/team coding standards and best practices)

    Based on your evaluation across these areas, please provide:

    1. Detailed Constructive Feedback: Clearly articulate specific strengths and weaknesses observed in the code diff. Reference the principles above and provide examples from the code where possible.
    2. Actionable Suggestions: Propose concrete improvements, alternative approaches, or specific code changes where applicable. Explain the "why" behind your suggestions.
    3. Overall Code Quality Score (1-10): Assign a holistic score (where 1 indicates major issues needing significant rework, and 10 represents excellent, production-ready code) primarily as a summary indicator reflecting your overall assessment.
    4. Score Justification & Key Takeaways: Briefly summarize the main reasons for the assigned score, highlighting the 1-3 most impactful feedback points (both positive and areas for improvement) as key takeaways for the developer.
    `

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    return response.text;
}