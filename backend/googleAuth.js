// googleAuth.js
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config({});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL // Use the redirect URL from environment variables
);

// Define the scopes for Google Calendar API
const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  //"https://www.googleapis.com/oauth2/v1/userinfo",
];

// Create a calendar client instance
const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client, // Use oauth2Client for authentication
});

// Export the OAuth2 client and calendar client, as well as the scopes
module.exports = {
  oauth2Client,
  scopes,
  calendar,
};
