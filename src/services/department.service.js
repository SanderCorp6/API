const Department = require("../models/department.model");

class DepartmentService {
  static async getAll() {
    const departments = await Department.getAll();
    return departments;
  }
}

module.exports = DepartmentService;
