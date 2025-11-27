const EmployeeService = require("../services/employee.service");

const getEmployees = async (req, res, next) => {
    const filters = req.query;
    const employees = await EmployeeService.getAll(filters);
    res.status(200).json({ employees });
};

const getEmployeeById = async (req, res, next) => {
    const { id } = req.params;
    const e = await EmployeeService.getById(id);
    res.status(200).json({
        id: e.id, role: e.role, first_name: e.first_name, last_name: e.last_name, email: e.email, 
        phone_number: e.phone_number, address: e.address, birth_date: e.birth_date, image_url: e.image_url,
        hire_date: e.hire_date, termination_date: e.termination_date, contract_type: e.contract_type, position: e.position,
        department_id: e.department_id, supervisor_id: e.supervisor_id, status: e.status, reentry_date: e.reentry_date,
        salary: e.salary, payroll_key: e.payroll_key, periodicity: e.periodicity, cost_center: e.cost_center,
        vacation_days_total: e.vacation_days_total, vacation_days_taken: e.vacation_days_taken,
        department_name: e.department_name, supervisor: `${e.supervisor_first_name} ${e.supervisor_last_name}`
    });
};

const getEmployeeStats = async (req, res, next) => {
    const { totalEmployees, activeEmployees, inactiveEmployees, totalDepartments } = await EmployeeService.getStats();
    res.status(200).json({ totalEmployees, activeEmployees, inactiveEmployees, totalDepartments });
};

const getEmployeeHistory = async (req, res, next) => {
    const { id } = req.params;
    const history = await EmployeeService.getHistory(id);
    res.status(200).json({ history });
};

const createEmployee = async (req, res, next) => {
    const data = req.body;
    const userId = req.user.id;
    const employee = await EmployeeService.create(data, userId);
    res.status(201).json({ message: "Employee created!", employee });
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

const addWarning = async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const warning = await EmployeeService.addWarning(id, reason, userId);
    res.status(201).json({ message: "Warning added!", warning });
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
