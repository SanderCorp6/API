const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");

// login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return res.status(401).json({ error: "Wrong Password" });
        }

        res.json({ message: "Successfully Login", user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// sign up
router.post("/signup", async (req, res) => {
    const { name, role, email, password } = req.body;

    const user = await User.create(name, role, email, password);
    if (!user) {
        return res.status(401).json({ error: "User can not be created" });
    }

    res.json({ message: "Successfully Created", user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

router.get("/users", async (req, res) => {
    const users = await User.getAll();
    res.status(200).json({ message: 'Successfully Retrieved', users: users})
});

module.exports = router;
