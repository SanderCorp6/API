const DepartmentService = require('../services/department.service');

const getDepartments = async (req, res, next) => {
    const departments = await DepartmentService.getAll();
    res.status(200).json({ departments });
}

module.exports = { getDepartments };