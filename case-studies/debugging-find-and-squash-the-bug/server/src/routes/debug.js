const express = require('express');
const store = require('../data/store');
const debugEngine = require('../services/debugEngine');

const router = express.Router();

// GET /api/debug - List all debug challenges
router.get('/', async (req, res, next) => {
  try {
    const { difficulty, concept } = req.query;
    const challenges = await store.listDebugChallenges({ difficulty, concept });
    res.json(challenges);
  } catch (error) {
    next(error);
  }
});

// GET /api/debug/:id - Get specific challenge details
router.get('/:id', async (req, res, next) => {
  try {
    const challenge = await store.getDebugChallenge(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Debug challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    next(error);
  }
});

// POST /api/debug/:id/run - Run user code and evaluate it against test cases
router.post('/:id/run', async (req, res, next) => {
  try {
    const challenge = await store.getDebugChallenge(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Debug challenge not found' });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    const userTranslation = await debugEngine.translateCodeToEnglish(code);
    const testCases = challenge.testCases || [];
    let allPassed = true;
    let failedCase = null;
    let runResult = null;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      
      let codeToRun = code;
      if (challenge.stripVariables) {
        for (const val of challenge.stripVariables) {
          const regex = new RegExp(`^${val}\\s*=.*$`, 'gm');
          codeToRun = codeToRun.replace(regex, '');
        }
      }

      // Run the code with the setup code for this test case
      const run = await debugEngine.runPythonCode(codeToRun, tc.setupCode);
      
      if (!run.success) {
        allPassed = false;
        runResult = run;
        failedCase = {
          index: i + 1,
          type: 'crash',
          error: debugEngine.explainError(run.rawError),
          rawError: run.rawError
        };
        break;
      }

      // Check if output matches expected value
      const actual = run.stdout.trim();
      const expected = tc.expectedOutput.trim();

      if (actual !== expected) {
        allPassed = false;
        runResult = run;
        failedCase = {
          index: i + 1,
          type: 'logical',
          expected,
          actual
        };
        break;
      }
    }
    if (allPassed) {
      const abstractionMap = (challenge.concepts || []).map((concept) => ({
        pythonConcept: concept,
        pattern: concept,
        explanation: `Debugged challenge covering ${concept}.`
      }));
      
      const allSessions = await store.listSessions();
      const alreadySolved = allSessions.some(
        s => s.debugChallenge && s.debugChallenge._id === challenge._id && s.learnerName === 'Guest learner'
      );
      
      if (!alreadySolved) {
        await store.addSession({
          learnerName: 'Guest learner',
          debugChallenge: challenge._id,
          scenario: null,
          reasoning: `Solved debug challenge: ${challenge.title}`,
          promptText: '',
          abstractionMap,
          generatedCode: code,
          codeExplanation: challenge.bugExplanation,
          promptScore: 100,
          promptFeedback: ['Excellent job debugging the code!'],
          reflection: '',
          misconceptions: [],
          masterySignals: ['Debugging Success', ...challenge.concepts]
        });
      }
    }

    res.json({
      success: allPassed,
      userTranslation,
      expectedTranslation: challenge.expectedLogic,
      failedCase
    });
  } catch (error) {
    next(error);
  }
});
// POST /api/debug/:id/chat - Chat with AI about the code
router.post('/:id/chat', async (req, res, next) => {
  try {
    const challenge = await store.getDebugChallenge(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const { message, code, history, mode = 'intermediate' } = req.body;
    
    // Process message through our real LLM via Groq
    const { message: aiResponse, solved } = await debugEngine.chatWithAI(challenge, code, message, history, mode);
    
    if (solved) {
      const allSessions = await store.listSessions();
      const alreadySolved = allSessions.some(
        s => s.debugChallenge && s.debugChallenge._id === challenge._id && s.learnerName === 'Guest learner'
      );
      
      if (!alreadySolved) {
        await store.addSession({
          learnerName: 'Guest learner',
          debugChallenge: challenge._id,
          scenario: null,
          reasoning: `Solved conceptually via AI Code Review: ${challenge.title}`,
          promptText: '',
          abstractionMap: [],
          generatedCode: challenge.solutionCode,
          codeExplanation: challenge.bugExplanation,
          promptScore: 100,
          promptFeedback: ['Excellent job explaining the logic to the junior dev!'],
          reflection: '',
          misconceptions: [],
          masterySignals: ['Debugging Mentorship', ...challenge.concepts]
        });
      }
    }
    
    res.json({ message: aiResponse, solved });
  } catch (error) {
    next(error);
  }
});

// POST /api/debug/translate - Translate code to English pseudocode
router.post('/translate', async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }
    const englishText = await debugEngine.translateCodeToEnglish(code);
    res.json({ english: englishText });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
