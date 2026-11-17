const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/theme/:themeName', async (req, res, next) => {
  try {
    const { themeName } = req.params;
    const scenarios = await store.listScenarios({ theme: themeName });
    res.json(scenarios);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
