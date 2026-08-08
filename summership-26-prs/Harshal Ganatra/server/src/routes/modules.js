const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const modules = await store.listModules();
    res.json(modules);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
