const VacationRequest = require("../models/vacation.model");
const Employee = require("../models/employee.model");
const AppError = require("../utils/AppError");

class VacationService {
  static async requestVacation(employeeId, startDate, endDate, type, description) {
    if (!employeeId || !startDate || !endDate || !type || !description) {
      throw new AppError("All fields are required (startDate, endDate, type, description)", 400);
    }

    const employee = await Employee.getById(employeeId);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      throw new AppError("End date must be after start date.", 400);
    }

    const diffTime = Math.abs(end - start);
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (isNaN(daysRequested) || daysRequested <= 0) {
      throw new AppError("Invalid date range", 400);
    }

    const availableDays = employee.vacation_days_total - employee.vacation_days_taken;
    if (daysRequested > availableDays) {
      throw new AppError(`Insufficient vacation balance`, 400);
    }

    const hasOverlap = await VacationRequest.checkOverlap(employeeId, startDate, endDate);
    if (hasOverlap) {
      throw new AppError("Dates overlap with an existing request.", 409);
    }

    return await VacationRequest.create({
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      days_requested: daysRequested,
      type,
      description,
    });
  }

  static async getEmployeeRequests(employeeId) {
    return await VacationRequest.getByEmployeeId(employeeId);
  }

  static async getAllRequests() {
    return await VacationRequest.getAll();
  }

  static async updateStatus(requestId, status, userId) {
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      throw new AppError("Invalid status value.", 409);
    }

    return await VacationRequest.updateStatus(requestId, status, userId);
  }
}

module.exports = VacationService;
