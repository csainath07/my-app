import { google } from "googleapis";
import { auth } from "google-auth-library";
import { config } from "dotenv";

config();

// Get the JSON string from environment variables
const credentialsJsonString = process.env.GOOGLE_CREDENTIALS_JSON;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID; // Keep this too

// --- Add checks ---
if (!credentialsJsonString) {
  console.error(
    "Error: GOOGLE_CREDENTIALS_JSON environment variable not set or empty.",
  );
  process.exit(1);
}
if (!SPREADSHEET_ID) {
  console.error("Error: GOOGLE_SPREADSHEET_ID environment variable not set.");
  process.exit(1);
}
// --- End checks ---

// Function to authenticate and get the Sheets API client
async function getAuthenticatedClient() {
  let keyData = JSON.parse(credentialsJsonString);
  // Define the scope needed to edit spreadsheets
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
  // Use the properties from the parsed object
  const jwtClient = new google.auth.JWT(
    keyData.client_email, // <--- from parsed object
    null,
    keyData.private_key, // <--- from parsed object
    SCOPES,
  );
  await jwtClient.authorize();
  return jwtClient;
}

// Function to append data to the sheet
async function appendData(authClient, data) {
  const sheets = google.sheets({ version: "v4", auth: authClient });

  // Example: Appending to the first sheet ('Sheet1') starting at the next available row in column A
  const range = "Sheet1!A2"; // Or specify a more precise range like 'Sheet1!A:C'
  const valueInputOption = "USER_ENTERED"; // How the input data should be interpreted (USER_ENTERED tries to parse values like dates/numbers)
  // Use 'RAW' if you want strings treated literally

  const resource = {
    values: data, // The data to append (array of arrays)
  };

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: valueInputOption,
      resource: resource,
      insertDataOption: "INSERT_ROWS", // Inserts new rows for the data
    });
    console.log(
      "Data appended successfully:",
      response.data.updates.updatedRange,
    );
    return response.data;
  } catch (err) {
    console.error("Error appending data:", err.message);
    // Log more details if needed, e.g., err.response?.data?.error
    if (err.response && err.response.data && err.response.data.error) {
      console.error("API Error Details:", err.response.data.error);
    }
    throw err; // Re-throw error for upstream handling if necessary
  }
}

// --- Main Execution ---
export async function saveReviewToGoogleSheet(data = []) {
  try {
    const authClient = await getAuthenticatedClient();
    await appendData(authClient, [data]);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
