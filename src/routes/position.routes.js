const express = require("express");
const router = express.Router();
const PositionController = require("../controllers/position.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);

// GET /positions
router.get("/", handleAsync(PositionController.getPositions));

module.exports = router;
