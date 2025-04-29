import axios from "axios";
import { config } from "dotenv";

config();

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
});

export function testEnv() {
  console.log("ENV GITHUB TOKEN", process.env.GITHUB_TOKEN);
}

export function getPullRequestUrl(owner, repo, number) {
  return `https://github.com/repos/${owner}/${repo}/pulls/${number}`;
}

export async function getPRDiff(owner, repo, number) {
  const res = await githubAPI.get(`/repos/${owner}/${repo}/pulls/${number}`, {
    headers: { Accept: "application/vnd.github.v3.diff" },
  });
  return res.data;
}

export async function commentOnPR(owner, repo, number, body) {
  await githubAPI.post(`/repos/${owner}/${repo}/issues/${number}/comments`, {
    body,
  });
}

export async function getPRDetails(owner, repo, number) {
  const res = await githubAPI.get(`/repos/${owner}/${repo}/pulls/${number}`, {
    headers: { Accept: "application/json" },
  });
  return res.data;
}

export async function postReviewsOnPR(owner, repo, number, body) {
  await githubAPI.post(`/repos/${owner}/${repo}/pulls/${number}/reviews`, {
    ...body,
    body: "Overall AI review summary here",
    event: "COMMENT",
  });
}
