const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

class UserService {
    static async registerUser(name, role, email, password) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(name, role, email, hashedPassword);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return { id: newUser.id, name: newUser.name, role: newUser.role, email: newUser.email, token };
    }
    

    static async loginUser(email, password) {
        const user = await User.findByEmail(email);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return { id: user.id, name: user.name, role: user.role, email: user.email, token };
    }

    static async getAllUsers() {
        return await User.getAll();
    }
}

module.exports = UserService;
