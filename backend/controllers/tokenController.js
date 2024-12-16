// controllers/tokenController.js
const Token = require("../models/tokenModel.js");

const { google } = require("googleapis");

const googleAuth = require("../googleAuth.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({});

const allowedOrigins = "http://localhost:3000";

const corsOptions = {
  origin: allowedOrigins,
  methods: ["POST", "GET"],
  credentials: true,
  optionSuccessStatus: 200,
};

const generateAuth = (req, res) => {
  const url = googleAuth.oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: googleAuth.scopes,
    // redirect_uri: "http://localhost:3001/google",
  });

  res.redirect(url);
};

const saveAccessToken = async (req, res) => {
  ////consoreq.query);
  const code = req.query.code;

  const { tokens } = await googleAuth.oauth2Client.getToken(code);
  googleAuth.oauth2Client.setCredentials(tokens);

  try {
    const newToken = new Token({
      // userId: tokens.id_token,
      accessToken: tokens.access_token,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    });

    await newToken.save();

    ////conso"Access Token saved:", tokens.access_token);
  } catch (err) {
    console.error("Error saving access token:", err);
    throw new Error("Failed to save access token");
  }

  res.redirect("http://localhost:3000/dashboard");
};

const getUser = async (req, res) => {
  try {
    const { scope, token_type, access_token } =
      googleAuth.oauth2Client.credentials;

    // Send sanitized user info to the frontend
    res.json({
      //   scope, // Public information about what the token can access
      //   tokenType: token_type, // The type of token (e.g., Bearer)
      accessToken: access_token,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }
};
const logout = async (req, res) => {
  try {
    // Get access_token from query or credentials
    const access_token =
      req.query.access_token ||
      googleAuth.oauth2Client.credentials.access_token;

    if (!access_token) {
      return res.status(400).json({ message: "No access token found" });
    }

    console.log("Access token from request:", access_token);

    // Check if the token exists in the database
    const token = await Token.findOne({ accessToken: access_token });
    console.log(token, "token logout");

    if (token) {
      // Delete the token from the database
      await Token.deleteOne({ accessToken: access_token });
      console.log("Token deleted successfully.");

      // Revoke the token with Google
      await googleAuth.oauth2Client.revokeToken(access_token);

      console.log("Token revoked successfully.");
      await googleAuth.oauth2Client.setCredentials(null);
    } else {
      console.log("Token not found in DB.");
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      message: "An error occurred during logout",
      error: error.message,
    });
  }
};

module.exports = {
  saveAccessToken,
  generateAuth,
  getUser,
  logout,
};
