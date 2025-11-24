const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { use } = require("../config/email.config");

// Class for actions into users table
class UserService {
    // create new user + token
    static async registerUser(name, role, email, password) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new AppError("There is already a user registered with that email.", 409);   
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(name, role, email, hashedPassword);

        const token = this.generateToken(newUser)

        return { 
            id: newUser.id, 
            name: newUser.name, 
            role: newUser.role, 
            email: newUser.email, 
            token 
        };
    }
    
    // login user + token
    static async loginUser(email, password) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid email or password.", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid email or password.", 401);
        }

        const token = this.generateToken(user)

        return { 
            id: user.id, 
            name: user.name, 
            role: user.role, 
            email: user.email, 
            token 
        };
    }

    // get all users
    static async getAllUsers() {
        const users = await User.getAll();
        return users;
    }

    // generate a jwt token for users
    static generateToken(user) {

        console.log("Generating token for user:", user);
        return jwt.sign(
            { 
                id: user.id, 
                name: user.name,
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );
    }
}

module.exports = UserService;
