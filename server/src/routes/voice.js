const express = require('express');
const router = express.Router();
const voiceEngine = require('../services/voiceEngine');

// 1. Voice Question Assistant
router.post('/ask', (req, res) => {
  try {
    const { question, language, history, scenarioId } = req.body;
    const result = voiceEngine.answerVoiceQuestion({ question, language, history, scenarioId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Logic Explanation Assessment
router.post('/assess-logic', (req, res) => {
  try {
    const { code, userExplanation, language, scenarioId } = req.body;
    const result = voiceEngine.assessLogic({ code, userExplanation, language, scenarioId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Voice Debugger
router.post('/debug', (req, res) => {
  try {
    const { code, spokenError, language } = req.body;
    const result = voiceEngine.voiceDebugger({ code, spokenError, language });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Read Code Aloud
router.post('/read-code', (req, res) => {
  try {
    const { code, language } = req.body;
    const result = voiceEngine.readCodeAloud({ code, language });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Interactive Voice Quiz - Next Question
router.post('/quiz/next', (req, res) => {
  try {
    const { index = 0 } = req.body;
    const result = voiceEngine.getNextQuizQuestion({ index });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Interactive Voice Quiz - Evaluate Answer
router.post('/quiz/evaluate', (req, res) => {
  try {
    const { questionId, question, spokenAnswer } = req.body;
    const result = voiceEngine.evaluateQuizAnswer({ questionId, question, spokenAnswer });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Voice Interview Practice - Next Question
router.post('/interview/next', (req, res) => {
  try {
    const { index = 0 } = req.body;
    const result = voiceEngine.getInterviewQuestion({ index });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Voice Interview Practice - Evaluate Response
router.post('/interview/evaluate', (req, res) => {
  try {
    const { question, spokenAnswer } = req.body;
    const result = voiceEngine.evaluateInterviewResponse({ question, spokenAnswer });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. Simulated TTS Audio Route
router.post('/tts', (req, res) => {
  try {
    const { text, language = 'en-US' } = req.body;
    res.json({
      text,
      language,
      status: 'audio_synthesized',
      message: 'Client Web Speech Synthesis API active. Server fallback audio available.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
