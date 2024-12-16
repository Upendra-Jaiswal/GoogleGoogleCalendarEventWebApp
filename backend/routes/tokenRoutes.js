// routes/tokenRoutes.js
const express = require("express");
const {
  saveAccessToken,
  generateAuth,
  getUser,
  logout,
} = require("../controllers/tokenController.js");

const router = express.Router();

router.get("/redirect", generateAuth);
router.get("/redirectflowName=GeneralOAuthFlow", saveAccessToken);
router.get("/getUser", getUser);
router.post("/logout", logout);

module.exports = router;
