const express = require('express');
const roadmap = require('../data/roadmap');

const router = express.Router();

router.get('/', (_req, res) => res.json(roadmap));

module.exports = router;
