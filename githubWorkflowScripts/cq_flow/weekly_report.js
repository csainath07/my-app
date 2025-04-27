import { getAllReviews } from './reviewsManager.js';
import { sendMail } from './mailer.js';
// csv-writer might export differently in ESM, common pattern is:
import csvWriter from 'csv-writer';
const { createObjectCsvWriter } = csvWriter; // Destructure the required function

// Define file paths (relative to the script location)
const inputFile = 'reviews.json';
const outputFile = 'output.csv';

try {
    // 1. Read the JSON file
    const data = getAllReviews();

    const processedRecords = [];

    // 2. Iterate through each user (key) in the JSON data
    for (const username in data) {
        if (Object.hasOwnProperty.call(data, username)) {
            const reviews = data[username];
            let totalScore = 0;
            const prLinks = [];
            const summaries = [];

            // 4. Process each review for the user
            reviews.forEach(review => {
                totalScore += review.score || 0; // Add score, default to 0 if missing

                const owner = review.owner || 'unknown_owner';
                const repo = review.repo || 'unknown_repo';
                const prNo = review.pull_request_no || 'unknown_pr';

                // Format PR link
                const prLink = `https://github.com/repos/${owner}/${repo}/pulls/${prNo}`;
                prLinks.push(prLink);

                // Add summary
                summaries.push(review.short_summary || 'No summary available.');
            });

            // 3. Calculate average score
            const numReviews = reviews.length;
            const averageScore = numReviews > 0 ? (totalScore / numReviews).toFixed(2) : 0; // Calculate and format

            // 4. Combine PR links and summaries
            const combinedPrLinks = prLinks.join(' , ');
            // const combinedSummaries = summaries.join('\n\n---\n\n');

            // 5. Prepare the record for CSV
            processedRecords.push({
                username: username,
                average_score: averageScore,
                pr_links: combinedPrLinks,
                // short_summary: combinedSummaries
            });
        }
    }

    // 6. Define CSV structure and write the file
    const csvWriterInstance = createObjectCsvWriter({
        path: outputFile,
        header: [
            { id: 'username', title: 'username' },
            { id: 'average_score', title: 'average_score' },
            { id: 'pr_links', title: 'PRs Links' }, // Match requested header
            // { id: 'short_summary', title: 'short_summary' } // Match requested header
        ]
    });

    // Using async/await for cleaner promise handling with ESM
    await csvWriterInstance.writeRecords(processedRecords);
    console.log(`Successfully wrote data to ${outputFile}`);

    // send report via email
    await sendMail();

} catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.code === 'ENOENT' && error.path === inputFile) {
        console.error(`Make sure '${inputFile}' exists in the current directory.`);
    } else if (error.syscall === 'connect' || error.command === 'CONN') {
            console.error('Error connecting to the email server. Check host, port, and credentials.');
    } else if (error.responseCode === 535) {
            console.error('Authentication failed. Check email user/password.');
    }
}