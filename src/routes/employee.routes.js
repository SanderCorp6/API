const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// GET /employees/ (filtros: ?status=Active&search=Sam)
router.get("/", handleAsync(employeeController.getEmployees));

// POST /employees/
router.post("/", handleAsync(employeeController.createEmployee));

// GET /employees/stats
router.get("/stats", handleAsync(employeeController.getEmployeeStats));

// GET /employees/:id
router.get("/:id", handleAsync(employeeController.getEmployeeById));

// PATCH /employees/:id
router.patch("/:id", handleAsync(employeeController.updateEmployee));

// DELETE /employees/:id
router.delete("/:id", handleAsync(employeeController.deleteEmployee));


module.exports = router;
