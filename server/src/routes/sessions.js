const express = require('express');

const store = require('../data/store');
const engine = require('../services/learningEngine');
const mentorContext = require('../services/mentorContext');
const learnerContext = require('../services/learnerContext');
const learnerProfile = require('../services/learnerProfile');
const adaptiveStrategy = require('../services/adaptiveStrategy');
const adaptiveDifficulty = require('../services/adaptiveDifficulty');
const aiMentor = require('../services/aiMentor');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();

    res.json(sessions.slice(0, 30));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // --------------------------------
    // 1. Get scenario
    // --------------------------------

    const scenario =
      await store.getScenario(
        req.body.scenarioId
      );

    if (!scenario) {
      return res
        .status(404)
        .json({
          message: 'Scenario not found'
        });
    }

    // --------------------------------
    // 2. Analyze current learner input
    // --------------------------------

    const abstractionMap =
  engine.mapReasoning(
    req.body.reasoning,
    scenario
  );

    const generatedCode =
      engine.generateCode(
        scenario,
        abstractionMap
      );

    const prompt =
      engine.evaluatePrompt(
        req.body.promptText
      );

    const misconceptions =
      engine.detectMisconceptions(
        req.body.reasoning
      );

    const masterySignals =
      engine.masterySignals(
        abstractionMap,
        prompt.score
      );

    // --------------------------------
    // 3. Retrieve previous sessions
    // --------------------------------

    const previousSessions =
      await store.listSessions();

    const currentConcepts =
      abstractionMap.map(
        (item) =>
          item.pythonConcept
      );

    const relevantHistory =
      learnerContext.buildLearnerHistory(
        previousSessions,
        scenario._id,
        currentConcepts,
        misconceptions
      );

    // --------------------------------
    // 4. Build learner profile
    // --------------------------------

    const profile =
      learnerProfile.buildLearnerProfile(
        previousSessions
      );

    // --------------------------------
    // 5. Choose mentoring strategy
    // --------------------------------

    const strategy =
      adaptiveStrategy.chooseStrategy(
        profile,
        misconceptions
      );

    // --------------------------------
    // 6. Choose adaptive difficulty
    // --------------------------------

    const difficulty =
      adaptiveDifficulty.chooseDifficulty({
        profile,
        promptScore: prompt.score,
        misconceptions,
        strategy
      });

    // --------------------------------
    // 7. Build mentor context
    // --------------------------------

    const context =
      mentorContext.buildMentorContext({
        scenario,
        reasoning:
          req.body.reasoning,
        abstractionMap,
        generatedCode,
        promptScore:
          prompt.score,
        promptFeedback:
          prompt.feedback,
        reflection:
          req.body.reflection,
        misconceptions,
        masterySignals
      });

    context.learnerHistory =
      relevantHistory;

    context.learnerProfile =
      profile;

    context.adaptiveStrategy =
      strategy;

    context.adaptiveDifficulty =
      difficulty;

    // --------------------------------
    // 8. Generate AI mentor response
    // --------------------------------

    const mentorResponse =
      await aiMentor.generateMentorResponse(
        context
      );

    // --------------------------------
    // 9. Save session
    // --------------------------------

    const session =
      await store.addSession({
        learnerName:
          req.body.learnerName ||
          'Guest learner',

        scenario:
          scenario._id,

        reasoning:
          req.body.reasoning,

        promptText:
          req.body.promptText || '',

        abstractionMap,

        generatedCode,

        codeExplanation:
          engine.explainCode(
            abstractionMap
          ),

        promptScore:
          prompt.score,

        promptFeedback:
          prompt.feedback,

        reflection:
          req.body.reflection || '',

        misconceptions,

        masterySignals,

        mentorContext:
          context,

        mentorResponse
      });

    res
      .status(201)
      .json(session);

  } catch (error) {
    console.error(
      'Session processing error:',
      error
    );

    next(error);
  }
});

module.exports = router;