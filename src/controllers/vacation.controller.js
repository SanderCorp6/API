const HTTP_STATUS = require("../utils/httpStatus");
const VacationService = require("../services/vacation.service");

const requestVacation = async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate, type, description } = req.body;

  const vacationRequest = await VacationService.requestVacation(employeeId, startDate, endDate, type, description);
  res.status(HTTP_STATUS.CREATED).json({ message: "Vacation request created!", vacationRequest });
};

const createRequest = async (req, res) => {
  const employeeId = req.user.id;
  const { startDate, endDate, type, description } = req.body;

  const vacationRequest = await VacationService.requestVacation(employeeId, startDate, endDate, type, description);
  res.status(HTTP_STATUS.CREATED).json({ message: "Vacation request submitted!", vacationRequest });
};

const getEmployeeRequests = async (req, res) => {
  const { employeeId } = req.params;
  const vacationRequests = await VacationService.getEmployeeRequests(employeeId);
  res.status(HTTP_STATUS.OK).json({ vacationRequests });
};

const getMyVacations = async (req, res) => {
  const employeeId = req.user.id;
  const vacationRequests = await VacationService.getEmployeeRequests(employeeId);
  res.status(HTTP_STATUS.OK).json(vacationRequests);
};

const getTeamRequests = async (req, res) => {
  const vacationRequests = await VacationService.getTeamRequests();
  res.status(HTTP_STATUS.OK).json(vacationRequests);
};

const approveRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updatedRequest = await VacationService.updateStatus(id, "Approved", userId);
  res.status(HTTP_STATUS.OK).json({ message: "Request approved", updatedRequest });
};

const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updatedRequest = await VacationService.updateStatus(id, "Rejected", userId);
  res.status(HTTP_STATUS.OK).json({ message: "Request rejected", updatedRequest });
};

const getRequestById = async (req, res) => {
  const { id } = req.params;
  const vacationRequest = await VacationService.getById(id);
  res.status(HTTP_STATUS.OK).json({ vacationRequest });
};

const getAllRequests = async (req, res) => {
  const { status } = req.query;
  const vacationRequests = await VacationService.getAllRequests({ status });
  res.status(HTTP_STATUS.OK).json({ vacationRequests });
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const updatedRequest = await VacationService.updateStatus(id, status, userId);
  res.status(HTTP_STATUS.OK).json({ message: "Vacation request updated!", updatedRequest });
};

module.exports = {
  requestVacation,
  createRequest,
  getEmployeeRequests,
  getMyVacations,
  getTeamRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  approveRequest,
  rejectRequest,
};
