const router = require("express").Router();
const vacationController = require("../controllers/vacation.controller");
const authenticateToken = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// GET /vacations/me - My vacations
router.get("/me", handleAsync(vacationController.getMyVacations));

// GET /vacations/team - Team requests
router.get("/team", authorize(["Administrator", "HR"]), handleAsync(vacationController.getTeamRequests));

// POST /vacations/request - New request
router.post("/request", handleAsync(vacationController.createRequest));

// POST /vacations/:id/approve
router.post("/:id/approve", authorize(["Administrator", "HR"]), handleAsync(vacationController.approveRequest));

// POST /vacations/:id/reject
router.post("/:id/reject", authorize(["Administrator", "HR"]), handleAsync(vacationController.rejectRequest));

// GET /vacations
router.get("/", handleAsync(vacationController.getAllRequests));

// GET /vacations/employee/:employeeId
router.get("/employee/:employeeId", handleAsync(vacationController.getEmployeeRequests));

// GET /vacations/:id
router.get("/:id", handleAsync(vacationController.getRequestById));

// POST /vacations/:employeeId
router.post("/:employeeId", handleAsync(vacationController.requestVacation));

// PATCH /vacations/:id
router.patch("/:id", handleAsync(vacationController.updateRequestStatus));

module.exports = router;
