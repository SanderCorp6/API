const AuthService = require("../services/auth.service");
const HTTP_STATUS = require("../utils/httpStatus");

const login = async (req, res) => {
  const { email, password } = req.body;
  const data = await AuthService.login(email, password);
  res.status(HTTP_STATUS.OK).json({ message: "Login successful!", user: data });
};

module.exports = { login };
