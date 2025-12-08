const express = require('express');
const router = express.Router();
const openingController = require('../controllers/opening.controller');

// GET /openings
router.get('/', openingController.getAllOpenings);

// GET /openings/:id
router.get('/:id', openingController.getOpeningById);

// POST /openings
router.post('/', openingController.createOpening);

module.exports = router;