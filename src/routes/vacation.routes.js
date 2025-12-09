const router = require("express").Router();
const vacationController = require("../controllers/vacation.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// GET /vacations/me - My vacations
router.get("/me", handleAsync(vacationController.getMyVacations));

// GET /vacations/team - Team requests
router.get("/team", handleAsync(vacationController.getTeamRequests));

// POST /vacations/request - New request
router.post("/request", handleAsync(vacationController.createRequest));

// POST /vacations/:id/approve
router.post("/:id/approve", handleAsync(vacationController.approveRequest));

// POST /vacations/:id/reject
router.post("/:id/reject", handleAsync(vacationController.rejectRequest));

// GET /vacations
router.get("/", handleAsync(vacationController.getAllRequests));

// GET /vacations/employee/:employeeId
router.get("/employee/:employeeId", handleAsync(vacationController.getEmployeeRequests));

// GET /vacations/:id
router.get("/:id", handleAsync(vacationController.getRequestById));

module.exports = router;
