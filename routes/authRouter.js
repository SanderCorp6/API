const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const authenticateToken = require("../middleware/authMiddleware");
const sendEmail = require("../services/email.service.js");

// login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserService.loginUser(email, password);
        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// sign up
router.post("/signup", async (req, res) => {
    const { name, role, email, password } = req.body;

    try {
        const user = await UserService.registerUser(name, role, email, password);
        await sendEmail(email);
        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// get all users
router.get("/users", authenticateToken, async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
