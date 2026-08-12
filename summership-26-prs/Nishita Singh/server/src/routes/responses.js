const express = require('express');
const controller = require('../controllers/responsesController');

const router = express.Router();

router.post('/', controller.submitResponse);
router.get('/:scenarioId', controller.getResponseForScenario);

module.exports = router;
