const HTTP_STATUS = require("../utils/httpStatus");
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

    const createLocalDate = (dateString) => {
      const cleanDate = dateString.split("T")[0];
      const [year, month, day] = cleanDate.split("-").map(Number);

      return new Date(year, month - 1, day);
    };

    const start = createLocalDate(startDate);
    const end = createLocalDate(endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    if (start < today) {
      throw new AppError("Start date cannot be in the past.", HTTP_STATUS.BAD_REQUEST);
    }
    if (start > maxDate || end > maxDate) {
      throw new AppError("Dates cannot be more than 1 year in the future.", HTTP_STATUS.BAD_REQUEST);
    }
    if (end < start) {
      throw new AppError("End date must be after or equal to start date.", HTTP_STATUS.BAD_REQUEST);
    }

    let daysRequested = 0;

    const loopDate = new Date(start);

    while (loopDate <= end) {
      const dayOfWeek = loopDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysRequested++;
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    if (daysRequested === 0) {
      throw new AppError("Invalid date range. No business days selected", HTTP_STATUS.BAD_REQUEST);
    }

    const availableDays = employee.vacation_days_total;
    if (daysRequested > availableDays) {
      throw new AppError(`Insufficient vacation balance.`, HTTP_STATUS.BAD_REQUEST);
    }

    const hasOverlap = await VacationRequest.checkOverlap(employeeId, startDate, endDate);
    if (hasOverlap) {
      throw new AppError("Dates overlap with an existing request.", HTTP_STATUS.CONFLICT);
    }

    const newRequest = await VacationRequest.create({
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      days_requested: daysRequested,
      type,
      description,
    });

    await Employee.update(employeeId, {
      ...employee,
      vacation_days_total: employee.vacation_days_total - daysRequested,
      vacation_days_taken: employee.vacation_days_taken + daysRequested,
    });

    return newRequest;
  }

  static async getById(id) {
    const request = await VacationRequest.getById(id);
    if (!request) {
      throw new AppError("Vacation request not found", HTTP_STATUS.NOT_FOUND);
    }
    return request;
  }

  static async getEmployeeRequests(employeeId) {
    return await VacationRequest.getByEmployeeId(employeeId);
  }

  static async getAllRequests(filters = {}) {
    return await VacationRequest.getAll(filters.status);
  }

  static async updateStatus(requestId, status, userId) {
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      throw new AppError("Invalid status value.", HTTP_STATUS.CONFLICT);
    }
    const request = await VacationRequest.getById(requestId);
    if (!request) {
      throw new AppError("Vacation request not found", HTTP_STATUS.NOT_FOUND);
    }
    if (request.status === status) {
      throw new AppError("Vacation request is already in this status", HTTP_STATUS.BAD_REQUEST);
    }

    const employee = await Employee.getById(request.employee_id);
    if (!employee) {
      throw new AppError("Employee not found", HTTP_STATUS.NOT_FOUND);
    }

    if (status === "Rejected" && request.status !== "Rejected") {
      await Employee.update(request.employee_id, {
        ...employee,
        vacation_days_total: employee.vacation_days_total + request.days_requested,
        vacation_days_taken: employee.vacation_days_taken - request.days_requested,
      });
    }

    if (request.status === "Rejected" && status !== "Rejected") {
      if (request.days_requested > employee.vacation_days_total) {
        throw new AppError("Insufficient vacation balance to restore this request.", HTTP_STATUS.BAD_REQUEST);
      }

      await Employee.update(request.employee_id, {
        ...employee,
        vacation_days_total: employee.vacation_days_total - request.days_requested,
        vacation_days_taken: employee.vacation_days_taken + request.days_requested,
      });
    }

    return await VacationRequest.updateStatus(requestId, status, userId);
  }
}

module.exports = VacationService;
