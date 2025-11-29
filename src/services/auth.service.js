const Employee = require("../models/employee.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(email, password) {
    const employee = await Employee.getByEmail(email);

    if (!employee) {
      throw new AppError("Invalid email or password.", 401);
    }
    if (employee.status !== "Active") {
      throw new AppError("Employee is not active.", 403);
    }

    if (employee.is_first_login) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Employee.setPassword(employee.id, hashedPassword);

      return this.generateToken(employee);
    }

    if (!employee.password) {
      throw new AppError("Account does not have a configured password..", 400);
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password.", 401);
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
}

module.exports = AuthService;
