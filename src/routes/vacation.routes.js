const router = require("express").Router();
const vacationController = require("../controllers/vacation.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// POST /vacations/:employeeId
router.post("/:employeeId", handleAsync(vacationController.requestVacation));

// GET /vacations/:employeeId
router.get("/:employeeId", handleAsync(vacationController.getEmployeeRequests));

// PATCH /vacations/:requestId
router.patch("/:requestId", handleAsync(vacationController.updateRequestStatus));

module.exports = router;
