const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { handleAsync } = require("../middleware/error.middleware");

// POST /auth/login
router.post("/login", handleAsync(authController.login));

// POST /auth/activate
router.post("/activate", handleAsync(authController.activate));

module.exports = router;
