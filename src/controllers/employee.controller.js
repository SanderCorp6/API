const EmployeeService = require("../services/employee.service");

const createEmployee = async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id;
    const employee = await EmployeeService.create(data, userId);
    res.status(201).json({ message: "Employee created!", employee });
};

const getEmployees = async (req, res, next) => {
    const filters = req.query;
    const employees = await EmployeeService.getAll(filters);
    res.status(200).json({ employees });
};

const getEmployeeById = async (req, res, next) => {
    const { id } = req.params;
    const employee = await EmployeeService.getById(id);
    res.status(200).json({ employee });
};

const updateEmployee = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;
    const updatedEmployee = await EmployeeService.update(id, data, userId);
    res.status(200).json({ message: "Employee updated!", employee: updatedEmployee });
};

const deleteEmployee = async (req, res, next) => {
    const { id } = req.params;
    await EmployeeService.delete(id);
    res.status(204).send();
};

const getEmployeeStats = async (req, res, next) => {
    const { totalEmployees, activeEmployees, inactiveEmployees, totalDepartments } = await EmployeeService.getStats();
    res.status(200).json({ totalEmployees, activeEmployees, inactiveEmployees, totalDepartments });
};

const addWarning = async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const warning = await EmployeeService.addWarning(id, reason, userId);
    res.status(201).json({ message: "Warning added!", warning });
};

const getEmployeeHistory = async (req, res, next) => {
    const { id } = req.params;
    const history = await EmployeeService.getHistory(id);
    res.status(200).json({ history });
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats,
    addWarning,
    getEmployeeHistory
};
