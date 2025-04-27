// run.js

import { handlePullRequest } from './app.js';
import fs from 'fs';

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const eventName = process.env.GITHUB_EVENT_NAME;
  
  if (!eventPath) {
    console.error('No GITHUB_EVENT_PATH found');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

  if (eventName === 'pull_request' && payload.action === 'opened') {
    await handlePullRequest(payload);
  } else {
    console.log('Event ignored');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
