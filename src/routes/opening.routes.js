const express = require("express");
const router = express.Router();
const openingController = require("../controllers/opening.controller");
const authenticateToken = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const { handleAsync } = require("../middleware/error.middleware");

router.use(authenticateToken);
router.use(authorize(["Administrator", "HR"]));

// GET /openings
router.get("/", handleAsync(openingController.getAllOpenings));

// GET /openings/:id
router.get("/:id", handleAsync(openingController.getOpeningById));

// POST /openings
router.post("/", handleAsync(openingController.createOpening));

// Patch /openings/:id
router.patch("/:id", handleAsync(openingController.updateOpening));

module.exports = router;
