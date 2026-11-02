const express = require('express');
const router = express.Router();
const storyOrchestrator = require('../services/StoryOrchestratorService');
const commandHandlers = require('../services/CommandHandlers');
const { SubmitPracticeAnswer } = require('../domain/commands');

/**
 * @route POST /api/journey/start
 * @desc Generates the 4-step adaptive learning sequence for a chosen theme.
 */
router.post('/start', async (req, res) => {
    try {
        const { userId, themeId } = req.body;
        
        if (!userId || !themeId) {
            return res.status(400).json({ error: "Missing userId or themeId." });
        }

        // Delegate entirely to the Service Layer
        const journeyPayload = await storyOrchestrator.generateAdaptiveJourney(userId, themeId);

        res.status(200).json({ success: true, data: journeyPayload });
    } catch (error) {
        console.error("[PyBe Error] Journey Generation Failed:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route POST /api/journey/evaluate
 * @desc Evaluates the user's practice answer and adjusts difficulty via SubmitPracticeAnswer Command.
 */
router.post('/evaluate', async (req, res) => {
    try {
        const { userId, topic, isCorrect } = req.body;
        
        // Delegate evaluation to the Command Handler
        const evaluationResult = await commandHandlers.handleSubmitPracticeAnswer(
            new SubmitPracticeAnswer(userId, topic, isCorrect)
        );
        
        res.status(200).json({ success: true, data: evaluationResult });
    } catch (error) {
        res.status(500).json({ success: false, error: "Evaluation failed." });
    }
});

module.exports = router;
