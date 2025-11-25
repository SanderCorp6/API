const AuthService = require("../services/auth.service");

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.status(200).json({ message: "Login successful!", user: data });
};

module.exports = { login };
