const HTTP_STATUS = require("../utils/httpStatus");
const EmployeeService = require("../services/employee.service");
const { uploadFileToS3 } = require("../services/upload.service");
const AppError = require("../utils/AppError");

const getEmployees = async (req, res) => {
  const filters = req.query;
  const employees = await EmployeeService.getAll(filters);
  res.status(HTTP_STATUS.OK).json({ employees });
};

const getEmployeeOptions = async (req, res) => {
  const employees = await EmployeeService.getSimpleAll();
  res.status(HTTP_STATUS.OK).json({ employees });
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  const e = await EmployeeService.getById(id);

  // prettier-ignore
  res.status(HTTP_STATUS.OK).json({
    id: e.id, role: e.role, 
    first_name: e.first_name, last_name: e.last_name, full_name: e.full_name, email: e.email, phone_number: e.phone_number,
    address: e.address, birth_date: e.birth_date, image_url: e.image_url, hire_date: e.hire_date, termination_date: e.termination_date, contract_type: e.contract_type,
    position_id: e.position_id, department_id: e.department_id, supervisor_id: e.supervisor_id, status: e.status, reentry_date: e.reentry_date,
    salary: e.salary, payroll_key: e.payroll_key, periodicity: e.periodicity, cost_center: e.cost_center,
    vacation_days_total: e.vacation_days_total, vacation_days_taken: e.vacation_days_taken,
    department_name: e.department_name, position_name: e.position_name, supervisor: e.supervisor_full_name,
  });
};

const getEmployeeStats = async (req, res) => {
  const { totalEmployees, activeEmployees, inactiveEmployees, totalDepartments } = await EmployeeService.getStats();
  res.status(HTTP_STATUS.OK).json({ totalEmployees, activeEmployees, inactiveEmployees, totalDepartments });
};

const getEmployeeHistory = async (req, res) => {
  const { id } = req.params;
  const history = await EmployeeService.getHistory(id);
  res.status(HTTP_STATUS.OK).json({ history });
};

const createEmployee = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  const employee = await EmployeeService.create(data, userId);
  res.status(HTTP_STATUS.CREATED).json({ message: "Employee created!", employee });
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user.id;
  const updatedEmployee = await EmployeeService.update(id, data, userId);
  res.status(HTTP_STATUS.OK).json({ message: "Employee updated!", employee: updatedEmployee });
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await EmployeeService.delete(id);
  res.status(204).send();
};

const addWarning = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;
  const warning = await EmployeeService.addWarning(id, reason, userId);
  res.status(HTTP_STATUS.CREATED).json({ message: "Warning added!", warning });
};

const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  const imageUrl = await uploadFileToS3(file.buffer, file.mimetype);
  const updatedEmployee = await EmployeeService.update(id, { image_url: imageUrl }, req.user.id);

  res.status(200).json({
    message: "Profile picture updated",
    image_url: imageUrl,
    employee: updatedEmployee,
  });
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeOptions,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  addWarning,
  getEmployeeHistory,
  uploadProfilePicture,
};
