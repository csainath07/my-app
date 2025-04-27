import express from 'express';
import { config } from 'dotenv';
import { getPRDiff, commentOnPR } from './github.js';
import { generateReviewFeedback } from './agent.js';
import { saveReview, getCodeQualityScoreFromFeedback } from './reviewsManager.js';
import chalk from 'chalk';

config();
const app = express();
app.use(express.json());

app.post('/ai-agent-code-review', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'pull_request' && payload.action === 'opened') {
    const { number, base, head, user } = payload.pull_request;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    try {
      const diff = await getPRDiff(owner, repo, number);
      console.log(chalk.green(diff));
      const feedback = await generateReviewFeedback(diff);
      await commentOnPR(owner, repo, number, `🤖 AI Feedback for @${user.login}:\n\n${feedback}`);
      res.status(200).send('Feedback posted!');
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
      res.status(500).send('Error processing PR');
    }
  } else {
    res.status(200).send('Event ignored');
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`AI agent running on ${port}`));
