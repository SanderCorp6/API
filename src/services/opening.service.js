const HTTP_STATUS = require("../utils/httpStatus");
const Opening = require("../models/opening.model");
const AppError = require("../utils/AppError");

class OpeningService {
  static async createOpening(data) {
    const { title, description, salary_min, salary_max, location, schedule } = data;

    if (!title || !description || !location || !schedule) {
      throw new AppError("All required fields must be completed", HTTP_STATUS.BAD_REQUEST);
    }

    if (parseFloat(salary_min) > parseFloat(salary_max)) {
      throw new AppError("Minimum salary cannot be greater than maximum salary", HTTP_STATUS.BAD_REQUEST);
    }

    return await Opening.create(data);
  }

  static async getAllOpenings(filters = {}) {
    return await Opening.getAll(filters.status);
  }

  static async getOpeningById(id) {
    const opening = await Opening.getById(id);
    if (!opening) {
      throw new AppError("Opening not found", HTTP_STATUS.NOT_FOUND);
    }
    return opening;
  }

  static async updateOpening(id, updates) {
    const existingOpening = await Opening.getById(id);
    if (!existingOpening) {
      throw new AppError("Opening not found", HTTP_STATUS.NOT_FOUND);
    }

    if (updates.status === 'Closed') {
      if (!updates.closing_reason || updates.closing_reason.trim() === '') {
        throw new AppError("A closing reason is required when closing a vacancy", HTTP_STATUS.BAD_REQUEST);
      }
      updates.closed_at = new Date();
    }

    if ((updates.status === 'Open' || updates.status === 'Paused') && existingOpening.status === 'Closed') {
      updates.closing_reason = null;
      updates.closed_at = null;
    }

    const updatedOpening = await Opening.update(id, updates);
    return updatedOpening;
  }
}

module.exports = OpeningService;
