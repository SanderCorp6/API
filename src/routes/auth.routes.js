const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { handleAsync } = require("../middleware/error.middleware");

// POST /auth/login
router.post("/login", handleAsync(authController.login));

module.exports = router;
