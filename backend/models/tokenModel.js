const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },

  scope: { type: String },
  tokenType: { type: String },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
