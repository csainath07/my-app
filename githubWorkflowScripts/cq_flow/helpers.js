export function sanitizeAIResponse(response) {
    // Remove ```json and ``` from start and end
    return response
      .replace(/^```json\s*/, '')  // remove ```json from start
      .replace(/```$/, '')         // remove ``` from end
      .trim();                     // remove any extra whitespace
}

export function getOverallAIComment(data) {
    return `
    **Overall Code Quality Score (1-10):**
    ${data?.score || '-'}

    **Score Justification & Key Takeaways:**
    ${data?.summary || '-'}
    `
}