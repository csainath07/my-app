export function sanitizeAIResponse(response) {
  // Remove ```json and ``` from start and end
  return response
    .replace(/^```json\s*/, "") // remove ```json from start
    .replace(/```$/, "") // remove ``` from end
    .trim(); // remove any extra whitespace
}

export function getOverallAIComment(data) {
  return (
    `**🤖 AI Feedback for @${user.login}:**\n\n` +
    `**Overall Code Quality Score (1-10):**\n${data?.score || "-"}` +
    "\n\n" +
    `**Score Justification & Key Takeaways:**\n${data?.summary || "-"}`
  );
}
