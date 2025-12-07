const HTTP_STATUS = require("./src/utils/httpStatus");
const VacationRequest = require("../models/vacation.model");
const Employee = require("../models/employee.model");
const AppError = require("../utils/AppError");

class VacationService {
  static async requestVacation(employeeId, startDate, endDate, type, description) {
    if (!employeeId || !startDate || !endDate || !type || !description) {
      throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.getById(employeeId);
    if (!employee) {
      throw new AppError("Employee not found", HTTP_STATUS.NOT_FOUND);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      throw new AppError("End date must be after start date.", HTTP_STATUS.BAD_REQUEST);
    }

    const diffTime = Math.abs(end - start);
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (isNaN(daysRequested) || daysRequested <= 0) {
      throw new AppError("Invalid date range", HTTP_STATUS.BAD_REQUEST);
    }

    const availableDays = employee.vacation_days_total - employee.vacation_days_taken;
    if (daysRequested > availableDays) {
      throw new AppError(`Insufficient vacation balance`, HTTP_STATUS.BAD_REQUEST);
    }

    const hasOverlap = await VacationRequest.checkOverlap(employeeId, startDate, endDate);
    if (hasOverlap) {
      throw new AppError("Dates overlap with an existing request.", HTTP_STATUS.CONFLICT);
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
      throw new AppError("Invalid status value.", HTTP_STATUS.CONFLICT);
    }

    return await VacationRequest.updateStatus(requestId, status, userId);
  }
}

module.exports = VacationService;
