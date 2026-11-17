const { Router } = require('express');
const roadmapController = require('../controllers/roadmap.controller');

const router = Router();

router.get('/', roadmapController.getAll);

module.exports = router;
