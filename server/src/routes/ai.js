const express = require('express');
const scenarioController = require('../controllers/aiScenarioController');
const tutorController = require('../controllers/aiTutorController');
const learningController = require('../controllers/aiLearningController');
const insightsController = require('../controllers/aiInsightsController');

// All Phase 3 AI endpoints are mounted here as sub-routes under /api/ai,
// keeping this new surface area separate from the Phase 1/2 REST APIs
// (which are untouched) while still following the same
// express.Router() + controller pattern established in Phase 2.
const router = express.Router();

// Feature 1 & 2: scenario generation
router.post('/scenarios/generate', scenarioController.generateScenario);
router.post('/scenarios/custom', scenarioController.generateCustomScenario);

// Feature 4: tutor chat
router.post('/tutor/chat', tutorController.chat);
router.get('/tutor/history', tutorController.getHistory);

// Feature 7, 8, 9: explanation, hints, code review
router.post('/explain', learningController.explain);
router.post('/hints', learningController.generateHint);
router.post('/code-review', learningController.reviewCode);

// Feature 3, 5, 6, 10: recommendation, adaptive difficulty, learning path, mastery
router.get('/recommendation', insightsController.getRecommendation);
router.get('/adaptive-difficulty', insightsController.getAdaptiveDifficulty);
router.get('/learning-path', insightsController.getLearningPath);
router.get('/mastery', insightsController.getMastery);

module.exports = router;
