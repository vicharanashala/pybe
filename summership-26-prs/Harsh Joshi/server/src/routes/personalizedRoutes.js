const express = require('express');
const router = express.Router();
const personalizedService = require('../services/PersonalizedService');

/**
 * @route GET /api/personalized/categories
 * @desc Retrieves all 50 kid-friendly worlds/categories for the Grid Dashboard.
 * @access Public
 */
router.get('/categories', (_req, res) => {
    try {
        const categories = personalizedService.getCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("[Antigravity Module] Error fetching categories:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

/**
 * @route POST /api/personalized/generate
 * @desc Generates the 4-step learning sequence (Example Story, Side-by-Side Discovery, Practice Story, Adaptive Evaluation).
 * @access Public
 */
router.post('/generate', (req, res) => {
    try {
        const caseStudy = personalizedService.generateCaseStudy(req.body);
        res.status(200).json({ success: true, data: caseStudy });
    } catch (error) {
        console.error("[Antigravity Module] Error generating case study:", error);
        if (error.message.includes('not found') || error.message.includes('resolved')) {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

/**
 * @route POST /api/personalized/evaluate
 * @desc Evaluates user practice answer and updates Adaptive Pedagogical difficulty state.
 * @access Public
 */
router.post('/evaluate', (req, res) => {
    try {
        const { userId = 'guest_user', topic, isCorrect, themeId } = req.body;
        const evaluation = personalizedService.evaluateAnswer(userId, topic, isCorrect, themeId);
        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        console.error("[Antigravity Module] Error evaluating answer:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;
