const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.post("/login", handleAsync(authController.login));
router.post("/signup", handleAsync(authController.signup));
router.get("/users", handleAsync(authController.getAllUsers));

module.exports = router;
