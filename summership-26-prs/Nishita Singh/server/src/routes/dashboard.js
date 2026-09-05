const express = require('express');
const controller = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', controller.getDashboard);

module.exports = router;
