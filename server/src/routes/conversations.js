const express = require('express');
const store = require('../data/store');
const conversationEngine = require('../services/conversationEngine');
const conversationAnalysis = require('../services/conversationAnalysis');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const conversations = await store.listConversations();
    res.json(conversations.slice(0, 30));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const conversation = await store.getConversation(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

// Start a new guided conversation for a scenario. Returns the conversation
// with its first system turn (the scenario's opening prompt) already attached.
router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.body.scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const initialState = conversationEngine.startConversation(scenario);
    const conversation = await store.addConversation({
      scenarioId: scenario._id,
      learnerName: req.body.learnerName || 'Guest learner',
      ...initialState
    });
    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
});

// Submit a learner's answer to the current turn. Runs the dialogue state
// machine and, if the conversation just completed, also builds a session
// via conversationAnalysis so it shows up in the normal dashboard alongside
// free-form sessions.
router.post('/:id/turns', async (req, res, next) => {
  try {
    const conversation = await store.getConversation(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    if (conversation.status === 'completed') {
      return res.status(409).json({ message: 'Conversation already completed' });
    }

    const answerText = (req.body.text || '').trim();
    if (!answerText) return res.status(400).json({ message: 'Answer text is required' });

    const scenario = conversation.scenario;
    if (!scenario) return res.status(404).json({ message: 'Scenario not found for conversation' });

    const nextState = conversationEngine.advanceConversation(conversation, scenario, answerText);
    const updated = await store.updateConversation(conversation._id, {
      status: nextState.status,
      objectiveIndex: nextState.objectiveIndex,
      attemptsOnObjective: nextState.attemptsOnObjective,
      turns: nextState.turns
    });

    let session = null;
    if (updated.status === 'completed') {
      const reasoning = conversationEngine.buildTranscript(updated, scenario);
      const abstractionMap = conversationAnalysis.mapReasoning(reasoning, scenario);
      const generatedCode = conversationAnalysis.generateCode(scenario, abstractionMap);
      const reasoningScore = conversationAnalysis.evaluateReasoning(reasoning, abstractionMap);
      session = await store.addSession({
        learnerName: updated.learnerName,
        scenario: scenario._id,
        reasoning,
        promptText: '',
        abstractionMap,
        generatedCode,
        codeExplanation: conversationAnalysis.explainCode(abstractionMap),
        promptScore: reasoningScore.score,
        promptFeedback: reasoningScore.feedback,
        reflection: '',
        misconceptions: conversationAnalysis.detectMisconceptions(reasoning),
        masterySignals: conversationAnalysis.masterySignals(abstractionMap, reasoningScore.score),
        conversationId: updated._id
      });
    }

    res.json({ conversation: updated, session });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
