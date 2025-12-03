const VacationService = require("../services/vacation.service");

const requestVacation = async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate, type, description } = req.body;

  const vacationRequest = await VacationService.requestVacation(employeeId, startDate, endDate, type, description);
  res.status(201).json({ message: "Vacation request created!", vacationRequest });
};

const getEmployeeRequests = async (req, res) => {
  const { employeeId } = req.params;
  const vacationRequests = await VacationService.getEmployeeRequests(employeeId);
  res.status(200).json({ vacationRequests });
};

const getAllRequests = async (req, res) => {
  const vacationRequests = await VacationService.getAllRequests();
  res.status(200).json({ vacationRequests });
};

const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const updatedRequest = await VacationService.updateStatus(requestId, status, userId);
  res.status(200).json({ message: "Vacation request updated!", updatedRequest });
};

module.exports = {
  requestVacation,
  getEmployeeRequests,
  getAllRequests,
  updateRequestStatus,
};
