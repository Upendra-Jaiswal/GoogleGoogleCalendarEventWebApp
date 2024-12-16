 # 🎯 Project Overview

This project integrates Google Calendar with the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows users to sign in with their Google account, manage events, and sync them with their Google Calendar.

## 🌟Features

Google Sign-In
Securely log in using Google credentials.
Google Calendar Access
Obtain permission to manage and view Google Calendar events.
Create Calendar Events
Users can create calendar events via a popup form.
Event Display
View all created events in a table on the interface.
Calendar Sync
Automatically reflects updates or additions made directly in Google Calendar after a refresh.
CRUD Functionality
Fully functional Create, Read, Update, and Delete operations for calendar events.

## 🛠️ Installation Guide

1. Clone the Repository
git clone <repository_url>
cd <repository_folder>
2. Backend Setup
Navigate to the backend folder:
cd backend
Install dependencies:
npm install
Create a .env file with the following details:
PORT=5000
MONGO_URI=<your_mongo_connection_string>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
REDIRECT_URI=http://localhost:5000/api/auth/google/callback
Start the backend server:
npm start
3. Frontend Setup
Navigate to the frontend folder:
cd frontend
Install dependencies:
npm install
Start the frontend server:
npm start
## 🚀 How It Works

Google Sign-In
Users log in using the Google Sign-In button, granting permission to access their Google Calendar.
Token Storage
The app securely stores the Google access token in MongoDB.
Event Creation
Users can click the “Create Calendar Event” button to open a popup form and input event details (name, date, and time).
Google Calendar API
The app uses the Google Calendar API to create events in the user's Google Calendar.
Event Display
All events are displayed in a table format.
Calendar Sync
Any changes made directly in Google Calendar (via the app or Google itself) are reflected in the event table after a page refresh.
## 🔑 Google Client ID and Secret Key Setup

1. Create a Google Cloud Project
Visit the Google Cloud Console.
Create a new project or use an existing one.
2. Enable Google Calendar API
Go to API & Services > Library.
Search for Google Calendar API and enable it.
3. Create OAuth 2.0 Credentials
Navigate to APIs & Services > Credentials.
Click on Create Credentials > OAuth 2.0 Client IDs.
Set the application type to Web Application.
Add this redirect URI:
http://localhost:5000/api/auth/google/callback
4. Get Client ID and Secret
Copy the Client ID and Client Secret.
Add them to the .env file in the backend folder as shown earlier.

## 🖌️ Styling

Vanilla CSS is used to style the application, ensuring a clean and user-friendly interface.
No external CSS libraries were used.

## 📋 Best Practices Followed

Modular Code
Separated concerns with well-structured backend and frontend folders.
Secure Implementation
Tokens and sensitive data are securely stored and never exposed.
Clean UI
Simple, aesthetic design with a focus on usability and responsiveness.
Vanilla CSS
Minimalistic design without external libraries.
