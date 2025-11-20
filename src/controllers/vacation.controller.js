const VacationService = require("../services/vacation.service");

const requestVacation = async (req, res, next) => {
    const employeeId = req.params;
    const { startDate, endDate, reason } = req.body;

    const vacationRequest = await VacationService.requestVacation(employeeId, startDate, endDate, reason);
    res.status(201).json({ message: "Vacation request created!", vacationRequest });
}

const getEmployeeRequests = async (req, res, next) => {
    const employeeId = req.params;
    const vacationRequests = await VacationService.getEmployeeRequests(employeeId); 
    res.status(200).json({ vacationRequests });
}

module.exports = {
    requestVacation,
    getEmployeeRequests
}