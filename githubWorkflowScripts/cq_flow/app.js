// app.js

import { config } from 'dotenv';
import { getPRDiff, commentOnPR } from './github.js';
import { generateReviewFeedback } from './agent.js';
import { saveReview, getCodeQualityScoreFromFeedback } from './reviewsManager.js';
import chalk from 'chalk';

config();

export async function handlePullRequest(payload) {
  const { number, base, head, user } = payload.pull_request;
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;

  try {
    const diff = await getPRDiff(owner, repo, number);
    console.log(chalk.green(diff));
    const feedback = await generateReviewFeedback(diff);
    await commentOnPR(owner, repo, number, `🤖 AI Feedback for @${user.login}:\n\n${feedback}`);
    const score = getCodeQualityScoreFromFeedback(feedback);
    const review = {
      owner,
      repo,
      pull_request_no: number,
      score,
      feedback
    }
    saveReview(user.login, review);
    console.log(chalk.blue("Completed!!"));
  } catch (err) {
    console.error(err);
    throw err;
  }
}
