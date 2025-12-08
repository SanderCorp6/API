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
}

module.exports = OpeningService;
