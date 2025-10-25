const UserService = require("../services/user.service");
const sendWelcomeEmail = require("../services/email.service");

// Controller for auth services
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", user });
};

const signup = async (req, res, next) => {
    const { name, role, email, password } = req.body;
    const user = await UserService.registerUser(name, role, email, password);

    sendWelcomeEmail(email);

    res.status(201).json({ message: "Signup successfull", user });
};

const getAllUsers = async (req, res, next) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ users });
};

module.exports = {
    login,
    signup,
    getAllUsers,
};
