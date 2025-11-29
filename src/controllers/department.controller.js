const DepartmentService = require("../services/department.service");

const getDepartments = async (req, res) => {
  const departments = await DepartmentService.getAll();
  res.status(200).json({ departments });
};

module.exports = { getDepartments };
