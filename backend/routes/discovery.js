const express = require('express');
const router = express.Router();
const Concept = require('../models/Concept');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');
const { scoreReasoning } = require('../services/reasoningService');
const { generateResponse, generateDecisionAnalysis } = require('../services/groqService');

const VALID_THEMES = ['sports', 'daily-life', 'philosophy', 'food', 'environmental'];
const DEFAULT_THEME = 'daily-life'; // fallback only for accounts created before theming existed

async function loadChallenge(conceptId) {
  const concept = await Concept.findById(conceptId);
  if (!concept) return { concept: null, challenge: null };
  const challenge = await Challenge.findOne({ conceptSlug: concept.slug });
  return { concept, challenge };
}

function resolveTheme(user) {
  return VALID_THEMES.includes(user?.theme) ? user.theme : DEFAULT_THEME;
}

// Pulls this learner's theme variant (scenarios + decision scenario +
// worked example) out of a Challenge doc. `themes` is a Mongoose Map, so
// `.get()`.
function themeVariant(challenge, theme) {
  return challenge.themes?.get ? challenge.themes.get(theme) : challenge.themes?.[theme];
}

// GET /api/discovery/:conceptId
// Everything the client needs to render the whole lesson: three free-text
// scenario steps, the follow-up decision scenario (correctOption
// stripped), the concept intro, and a worked Python example — all pulled
// from this learner's chosen theme.
router.get('/:conceptId', protect, async (req, res) => {
  try {
    const { concept, challenge } = await loadChallenge(req.params.conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    const theme = resolveTheme(req.user);
    const variant = themeVariant(challenge, theme);
    if (!variant?.scenarios?.length) {
      return res.status(404).json({ message: `No "${theme}" content configured for this concept yet` });
    }

    // Never send correctOption to the client — the learner picks blind,
    // and correctness is checked server-side in POST /discovery/decision.
    const decisionForClient = variant.decisionScenario ? {
      scenario: variant.decisionScenario.scenario,
      question: variant.decisionScenario.question,
      optionA: variant.decisionScenario.optionA,
      optionB: variant.decisionScenario.optionB,
      image: variant.decisionScenario.image
    } : null;

    // If this learner already went through Section 1 before (in this
    // session or any previous one), pull back everything they produced —
    // their three answers, the AI's explanation, their decision pick, and
    // the AI's analysis of it — so the frontend can render a read-only
    // recap instead of an empty form. This is the ONLY place that data is
    // read from; revisiting never re-triggers generateResponse or
    // generateDecisionAnalysis.
    const progress = await Progress.findOne({ userId: req.user._id, conceptId: concept._id });
    const savedDiscovery = progress?.discoverySnapshot?.explanation ? {
      responses: progress.discoverySnapshot.responses || [],
      explanation: progress.discoverySnapshot.explanation,
      decisionChoice: progress.discoverySnapshot.decisionChoice || null,
      decisionCorrect: typeof progress.discoverySnapshot.decisionCorrect === 'boolean'
        ? progress.discoverySnapshot.decisionCorrect : null,
      decisionAnalysis: progress.discoverySnapshot.decisionAnalysis || null
    } : null;

    res.json({
      conceptId: concept._id,
      conceptTitle: concept.title,
      theme,
      challenge: {
        // Shared case-study/background context for the three scenarios
        // below, if this theme has one — shown persistently across all
        // three steps in place of the artwork placeholder.
        background: variant.background || '',
        // Three progressive real-world scenario steps, free-text, all
        // from the learner's chosen theme.
        scenarios: variant.scenarios,
        // The single A/B decision scenario shown right after the AI
        // reflects on the three free-text answers above.
        decisionScenario: decisionForClient
      },
      // Null the first time through; populated on every later visit, so
      // the learner can look back at exactly what happened without
      // spending another AI call or being able to edit it.
      savedDiscovery,
      conceptIntro: challenge.conceptIntro,
      // The worked example, told through this learner's theme — a
      // different example.code/explanation per theme, not one shared
      // example for everyone.
      example: variant.example,
      reinforcement: {
        prompt: challenge.reinforcement.prompt,
        hint: challenge.reinforcement.hint
      },
      // SECTION 3 content — theme-agnostic, shown after the Section 2
      // visualizer.
      blanks: {
        conceptual: { text: challenge.blanks.conceptual.text, options: challenge.blanks.conceptual.options },
        code: { text: challenge.blanks.code.text, options: challenge.blanks.code.options }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/discovery/blanks/:conceptId
// SECTION 3 content on its own — theme-agnostic, so it doesn't depend on
// the learner's theme or on Section 1 having just been loaded this
// session. Used by ConceptPage once Section 1 is complete, since at that
// point PythonDiscoveryComponent may not be mounted/fetching anymore.
router.get('/blanks/:conceptId', protect, async (req, res) => {
  try {
    const { concept, challenge } = await loadChallenge(req.params.conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    res.json({
      conceptual: { text: challenge.blanks.conceptual.text, options: challenge.blanks.conceptual.options },
      code: { text: challenge.blanks.code.text, options: challenge.blanks.code.options }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/discovery/respond
// The three free-text scenario answers (collected client-side via
// Next/Back) are submitted together here — ONE request, ONE AI call that
// returns a single consolidated, plain-paragraph explanation (not a
// separate reaction per scenario) bridging to the actual concept.
//
// There is no pass/fail gate anywhere in this part of the flow. Every
// response is assumed to already show real understanding; the AI is asked
// to validate it and bridge it toward the actual concept, never to mark
// anything "wrong". There are no retries — this is the only call for this
// step.
//
// body: { conceptId, responses: [r1, r2, r3] }
router.post('/respond', protect, async (req, res) => {
  try {
    const { conceptId, responses = [] } = req.body;
    const { concept, challenge } = await loadChallenge(conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    const theme = resolveTheme(req.user);
    const variant = themeVariant(challenge, theme);
    const scenarios = variant?.scenarios || [];

    const explanation = await generateResponse({
      conceptTitle: concept.title,
      background: variant?.background || '',
      scenarios,
      responses,
      conceptHint: challenge.conceptHint
    });

    // Persist this so the learner can come back and review it later
    // without spending another AI call or being able to edit their old
    // answers. Upsert since this may be their first time (no Progress doc
    // yet) or a redo of an already-completed lesson.
    await Progress.findOneAndUpdate(
      { userId: req.user._id, conceptId },
      { $set: { 'discoverySnapshot.responses': responses, 'discoverySnapshot.explanation': explanation } },
      { upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Could not generate an AI explanation right now', error: err.message });
  }
});

// POST /api/discovery/decision
// The FOLLOW-UP decision scenario — shown right after the AI reflects on
// the three free-text answers. The learner picks A or B for this one real-
// life-analogy scenario (deliberately not about code). Correctness is
// computed server-side, then a SECOND, separate AI call gives a short,
// specific analysis of that pick, still framed in the analogy's own terms.
//
// body: { conceptId, choice: 'A'|'B' }
router.post('/decision', protect, async (req, res) => {
  try {
    const { conceptId, choice } = req.body;
    const { concept, challenge } = await loadChallenge(conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    const theme = resolveTheme(req.user);
    const variant = themeVariant(challenge, theme);
    const decisionScenario = variant?.decisionScenario;
    if (!decisionScenario) return res.status(404).json({ message: 'No decision scenario configured for this concept/theme yet' });

    const correct = choice === decisionScenario.correctOption;

    const analysis = await generateDecisionAnalysis({
      conceptTitle: concept.title,
      decisionScenario,
      choice,
      correct,
      conceptHint: challenge.conceptHint
    });

    // Merge into the same snapshot the /respond call already started (or
    // create one, in the unlikely case this is hit out of order).
    await Progress.findOneAndUpdate(
      { userId: req.user._id, conceptId },
      {
        $set: {
          'discoverySnapshot.decisionChoice': choice,
          'discoverySnapshot.decisionCorrect': correct,
          'discoverySnapshot.decisionAnalysis': analysis
        }
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ correct, analysis });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Could not generate an AI analysis right now', error: err.message });
  }
});

// POST /api/discovery/blanks/check
// SECTION 3 check — the learner drags words into both blanks (conceptual +
// code) and submits both at once. Purely local, no AI call. The learner
// can always continue afterward regardless of correctness — for any wrong
// blank, a short hint explaining what belongs there is included so they
// still learn the right answer before moving on.
// body: { conceptId, conceptualAnswer, codeAnswer }
router.post('/blanks/check', protect, async (req, res) => {
  try {
    const { conceptId, conceptualAnswer, codeAnswer } = req.body;
    const { concept, challenge } = await loadChallenge(conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    const conceptualCorrect = (conceptualAnswer || '').trim() === challenge.blanks.conceptual.answer;
    const codeCorrect = (codeAnswer || '').trim() === challenge.blanks.code.answer;

    res.json({
      conceptualCorrect,
      codeCorrect,
      allCorrect: conceptualCorrect && codeCorrect,
      correctAnswers: {
        conceptual: challenge.blanks.conceptual.answer,
        code: challenge.blanks.code.answer
      },
      // Short 1-2 line explanations of what should go there — only
      // meaningful (and only shown by the frontend) when the pick was wrong.
      hints: {
        conceptual: challenge.blanks.conceptual.hint,
        code: challenge.blanks.code.hint
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/discovery/reinforce
// Reinforcement challenge check (local semantic scoring, unlimited
// attempts) — a separate, optional follow-up exercise, unrelated to the
// Section 1 scenario flow above.
// body: { conceptId, answer }
router.post('/reinforce', protect, async (req, res) => {
  try {
    const { conceptId, answer } = req.body;
    const { concept, challenge } = await loadChallenge(conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    if (!challenge) return res.status(404).json({ message: 'No discovery content configured for this concept yet' });

    const { score, passed } = await scoreReasoning(answer, challenge.reinforcement.keyPoints);
    const feedback = passed
      ? 'Great work — you\'ve got it!'
      : "Not quite — think about what you just learned and try again.";

    res.json({ passed, score, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reinforcement check failed', error: err.message });
  }
});

module.exports = router;
