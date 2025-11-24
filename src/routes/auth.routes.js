const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

// POST /auth/login
router.post("/login", handleAsync(authController.login));

// POST /auth/signup
router.post("/signup", handleAsync(authController.signup));

// GET /auth/users
router.get("/users", handleAsync(authController.getAllUsers));

module.exports = router;
