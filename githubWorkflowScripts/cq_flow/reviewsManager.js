import fs from "fs";
import chalk from "chalk";
const filePath = "./data/reviews.json";

export function saveReview(dev, review) {
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  if (!data[dev]) data[dev] = [];

  data[dev].unshift(review);

  // Keep only the last 10 reviews
  if (data[dev].length > 10) {
    data[dev].pop();
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getReviews(dev) {
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data[dev] || [];
}

export function getAllReviews() {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getCodeQualityScoreFromFeedback(feedback) {
  const match = feedback.match(/Overall Code Quality Score:\s*(\d{1,2})\/10/i);
  return match ? Math.min(10, Math.max(1, parseInt(match[1], 10))) : 5; // fallback to 5 if not found
}

export function testCodeQualityScore() {
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);
  const feedback = data["csainath07"][0].feedback;
  console.log(
    chalk.blue(`score: ${getCodeQualityScoreFromFeedback(feedback)}`),
  );
}
