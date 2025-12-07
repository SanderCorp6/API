const HTTP_STATUS = require("../utils/httpStatus");
const Employee = require("../models/employee.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(email, password) {
    const employee = await Employee.getByEmail(email);

    if (!employee) {
      throw new AppError("Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }
    if (employee.status !== "Active") {
      throw new AppError("Employee is not active.", HTTP_STATUS.UNAUTHORIZED);
    }

    if (employee.is_first_login) {
      throw new AppError("Activate your account with the link sent to your email.", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!employee.password) {
      throw new AppError("Account does not have a configured password..", HTTP_STATUS.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }

    return this.generateToken(employee);
  }

  static generateToken(employee) {
    return {
      id: employee.id,
      name: employee.full_name,
      email: employee.email,
      role: employee.role,
      token: jwt.sign(
        {
          id: employee.id,
          email: employee.email,
          role: employee.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      ),
    };
  }

  static async activateAccount(token, newPassword) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "Activation") {
      throw new AppError("Invalid activation token.", HTTP_STATUS.UNAUTHORIZED);
    }

    const employee = await Employee.getById(decoded.id);

    if (!employee) {
      throw new AppError("Employee not found.", HTTP_STATUS.NOT_FOUND);
    }
    if (employee.is_first_login !== null && employee.is_first_login === false) {
      throw new AppError("Employee is already activated.", HTTP_STATUS.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Employee.setPassword(employee.id, hashedPassword);

    return this.generateToken(employee);
  }
}

module.exports = AuthService;
