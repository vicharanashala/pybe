const express = require('express');
const controller = require('../controllers/progressController');

const router = express.Router();

router.get('/', controller.getProgress);
router.put('/', controller.updateProgress);

module.exports = router;
