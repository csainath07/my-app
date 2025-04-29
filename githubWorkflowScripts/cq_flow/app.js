import { config } from 'dotenv';
import { getPRDiff, commentOnPR, getPRDetails, postReviewsOnPR } from './github.js';
import { generateReviewFeedback } from './agent.js';
import { sanitizeAIResponse, getOverallAIComment } from './helpers.js';
import chalk from 'chalk';

config();

export async function handlePullRequest(payload) {
  const { number, base, head, user } = payload.pull_request;
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;

  try {
    const diff = await getPRDiff(owner, repo, number);
    const prDetails = await getPRDetails(owner, repo, number);
    const feedback = await generateReviewFeedback(diff);
    const sanitizeResponsonJSON = JSON.parse(sanitizeAIResponse(feedback));
    await postReviewsOnPR(owner, repo, number, {
      comments: [...sanitizeResponsonJSON.comments],
      commit_id: prDetails?.head?.sha
    });
    const score = sanitizeResponsonJSON.overall_score;
    const summary = sanitizeResponsonJSON.score_justification;
    const comment = getOverallAIComment({
      score,
      summary
    });
    await commentOnPR(owner, repo, number, `🤖 AI Feedback for @${user.login}:\n\n${comment}`);
    console.log(chalk.blue("Completed!!"));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
