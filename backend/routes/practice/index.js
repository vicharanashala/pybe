const express = require('express');

const router = express.Router();

router.use('/topics', require('./topics'));
router.use('/problems', require('./problems'));
router.use('/execute', require('./execute'));
router.use('/progress', require('./progress'));

module.exports = router;
