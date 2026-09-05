const express = require('express');
const controller = require('../controllers/reflectionsController');

const router = express.Router();

router.post('/', controller.submitReflection);

module.exports = router;
