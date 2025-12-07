const router = require("express").Router();
const vacationController = require("../controllers/vacation.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

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
