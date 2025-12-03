const sendWelcomeEmail = require("../services/email.service");
const Employee = require("../models/employee.model");
const Position = require("../models/position.model");
const Department = require("../models/department.model");
const EmployeeHistory = require("../models/history.model");
const AppError = require("../utils/AppError");

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

class EmployeeService {
  static async getAll(filters) {
    const employees = await Employee.getAll(filters);
    return employees;
  }

  static async getSimpleAll() {
    const employees = await Employee.getSimpleAll();
    return employees;
  }

  static async getById(id) {
    const employee = await Employee.getById(id);
    if (!employee) {
      throw new AppError("Employee Not Found.", 404);
    }
    return employee;
  }

  static async getStats() {
    const stats = await Employee.getStats();
    return stats;
  }

  static async getHistory(id) {
    const employee = await Employee.getById(id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    return await EmployeeHistory.getByEmployeeId(id);
  }

  static async create(e) {
    if (
      !e.role ||
      !e.first_name ||
      !e.last_name ||
      !e.email ||
      !e.phone_number ||
      !e.address ||
      !e.birth_date ||
      !e.contract_type ||
      !e.position_id ||
      !e.department_id ||
      !e.supervisor_id ||
      !e.salary ||
      !e.periodicity ||
      !e.cost_center ||
      !e.vacation_days_total
    ) {
      throw new AppError("Incomplete fields for user creation", 409);
    }

    const existingEmployee = await Employee.getByEmail(e.email);
    if (existingEmployee) {
      throw new AppError("There is already an employee registered with that email.", 409);
    }

    const department = await Department.getById(e.department_id);
    if (!department) {
      throw new AppError("Invalid Department ID provided.", 404);
    }

    const deptPrefix = department.name.substring(0, 3).toUpperCase();
    const randomNumbers = Math.floor(100 + Math.random() * 900);

    e.payroll_key = `${deptPrefix}-0${randomNumbers}`;
    e.status = "Active";

    const newEmployee = await Employee.create(e);
    sendWelcomeEmail(e.email);
    return newEmployee;
  }

  static async update(id, dataToUpdate, userId) {
    const existingEmployee = await Employee.getById(id);
    if (!existingEmployee) {
      throw new AppError("Employee not found.", 404);
    }

    if (dataToUpdate.email && dataToUpdate.email !== existingEmployee.email) {
      const emailExists = await Employee.getByEmail(dataToUpdate.email);
      if (emailExists) {
        throw new AppError("Email is already in use by another employee.", 409);
      }
    }

    if (dataToUpdate.status) {
      const currentDate = new Date();
      if (dataToUpdate.status === "Active") {
        dataToUpdate.reentry_date = currentDate;
      } else {
        dataToUpdate.termination_date = currentDate;
        dataToUpdate.reentry_date = null;
      }
    }

    if (dataToUpdate.position_id && dataToUpdate.position_id !== existingEmployee.position_id) {
      const newPosition = await Position.getById(dataToUpdate.position_id);
      const newPositionName = newPosition ? newPosition.name : "Unknown";
      const oldPositionName = existingEmployee.position_name || "Unknown";

      await EmployeeHistory.create({
        employee_id: id,
        change_type: "POSITION",
        description: `Promoted to ${newPositionName}`,
        previous_value: oldPositionName,
        new_value: newPositionName,
        created_by: userId,
      });
    }

    if (dataToUpdate.salary && parseFloat(dataToUpdate.salary) !== parseFloat(existingEmployee.salary)) {
      const oldSalaryFormatted = formatCurrency(existingEmployee.salary);
      const newSalaryFormatted = formatCurrency(dataToUpdate.salary);

      await EmployeeHistory.create({
        employee_id: id,
        change_type: "SALARY",
        description: `Salary ${parseFloat(dataToUpdate.salary) > parseFloat(existingEmployee.salary) ? "increase" : "decrease"}`,
        previous_value: oldSalaryFormatted,
        new_value: newSalaryFormatted,
        created_by: userId,
      });
    }

    if (dataToUpdate.department_id && dataToUpdate.department_id !== existingEmployee.department_id) {
      const newDepartment = await Department.getById(dataToUpdate.department_id);
      const newDepartmentName = newDepartment ? newDepartment.name : "Unknown";
      const oldDepartmentName = existingEmployee.department_name || "Unknown";

      await EmployeeHistory.create({
        employee_id: id,
        change_type: "DEPARTMENT",
        description: `Transferred to ${newDepartmentName} team`,
        previous_value: oldDepartmentName,
        new_value: newDepartmentName.toString(),
        created_by: userId,
      });
    }

    const employeeData = {
      ...existingEmployee,
      ...dataToUpdate,
      updated_by: userId,
    };

    const updatedEmployee = await Employee.update(id, employeeData);
    return updatedEmployee;
  }

  static async delete(id) {
    const deleted = await Employee.delete(id);
    if (!deleted) {
      throw new AppError("Employee not found.", 404);
    }
  }

  static async addWarning(id, reason, userId) {
    const employee = await Employee.getById(id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    return await EmployeeHistory.create({
      employee_id: id,
      change_type: "WARNING",
      description: reason,
      previous_value: null,
      new_value: "Recorded",
      created_by: userId,
    });
  }
}

module.exports = EmployeeService;
