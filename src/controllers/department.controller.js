const HTTP_STATUS = require("../utils/httpStatus");
const DepartmentService = require("../services/department.service");

const getDepartments = async (req, res) => {
  const departments = await DepartmentService.getAll();
  res.status(HTTP_STATUS.OK).json({ departments });
};

module.exports = { getDepartments };
