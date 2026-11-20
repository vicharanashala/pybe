const express = require('express');
const router = express.Router();

const { caseStudies } = require('../../../shared/case-studies.cjs');

router.get('/', (req, res) => {
  res.json(caseStudies);
});

router.get('/:id', (req, res) => {
  const study = caseStudies.find((cs) => cs.id === req.params.id);
  if (!study) return res.status(404).json({ error: 'Case study not found' });
  res.json(study);
});

module.exports = router;
