const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/department.controller');
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// GET /departments
router.get("/", handleAsync(DepartmentController.getDepartments));

module.exports = router;