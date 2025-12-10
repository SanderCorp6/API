const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authenticateToken = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET /employees/ (filtros: ?status=Active&search=Sam)
router.get("/", handleAsync(employeeController.getEmployees));

// GET /employees/options
router.get("/options", handleAsync(employeeController.getEmployeeOptions));

// GET /employees/stats
router.get("/stats", handleAsync(employeeController.getEmployeeStats));

// GET /employees/history/:id
router.get("/history/:id", authorize(["Administrator", "HR"]), handleAsync(employeeController.getEmployeeHistory));

// GET /employees/:id
router.get("/:id", authorize(["Administrator", "HR"]), handleAsync(employeeController.getEmployeeById));

// POST /employees/
router.post("/", authorize(["Administrator"]), handleAsync(employeeController.createEmployee));

// POST /employees/warnings/:id
router.post("/warnings/:id", authorize(["Administrator", "HR"]), handleAsync(employeeController.addWarning));

// PATCH /employees/:id
router.patch("/:id", authorize(["Administrator", "HR"]), handleAsync(employeeController.updateEmployee));

// DELETE /employees/:id
router.delete("/:id", authorize(["Administrator", "HR"]), handleAsync(employeeController.deleteEmployee));

// PATCH /employees/:id/upload-image
router.post("/:id/upload-image", upload.single("image"), handleAsync(employeeController.uploadProfilePicture));

module.exports = router;
