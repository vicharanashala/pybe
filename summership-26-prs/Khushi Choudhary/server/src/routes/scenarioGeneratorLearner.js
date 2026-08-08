// Public routes — no admin token. This is the learner-facing half of the
// Scenario Generator: bring-your-own-key generation, a forced playtest
// before submission, a per-learner daily cap, and everything lands in the
// exact same review queue and Mentor Approves gate as the mentor path in
// routes/scenarioGenerator.js. One gate, two sources.

const express = require('express');
const { AI_PROVIDERS } = require('../services/providers');
const { generateCaseStudy } = require('../services/scenarioPipeline');
const { validateScenarioDraft } = require('../services/scenarioValidator');
const draftStore = require('../services/draftStore');
const { checkSubmissionCap } = require('../services/submissionCap');
const contentStore = require('../services/scenarioContentStore');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Generate ----------------------------------------------------------------
// The learner's own API key lives only in this handler's local variables,
// for the lifetime of this one request. It is passed straight into the
// provider adapter's fetch call and never written to a file, a log line, or
// any store — nothing below this function ever sees it again.

router.post('/generate', async (req, res, next) => {
  try {
    const { concept, hookWord, avoidList, providerName, apiKey, model, baseUrl } = req.body;

    if (!concept || !concept.trim()) {
      return res.status(400).json({ message: 'concept is required' });
    }
    if (!providerName || !AI_PROVIDERS.includes(providerName)) {
      return res.status(400).json({ message: `providerName must be one of: ${AI_PROVIDERS.join(', ')}` });
    }
    if (providerName !== 'custom' && (!apiKey || !apiKey.trim())) {
      return res.status(400).json({ message: 'apiKey is required for this provider' });
    }

    // Runs Part A then Part B as two separate provider calls — see
    // scenarioPipeline.js for why this is split rather than one call.
    const { content, attempts, issues } = await generateCaseStudy({
      providerName, apiKey, model, baseUrl, concept, hookWord, avoidList
    });

    if (!content) {
      return res.status(422).json({
        message: 'Could not produce a case study that passes review.',
        issues
      });
    }

    // Not saved anywhere yet — this only becomes a draft once the learner
    // has played through it and hit submit.
    res.json({ content, attempts });
  } catch (error) {
    next(error);
  }
});

// --- Submit ------------------------------------------------------------------

router.post('/submit', async (req, res, next) => {
  try {
    const { content, completedStages, authorName, authorEmail, hookWord } = req.body;

    if (!authorName || !authorName.trim()) {
      return res.status(400).json({ message: 'Your name is required.' });
    }
    if (!authorEmail || !EMAIL_RE.test(authorEmail)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!content) {
      return res.status(400).json({ message: 'content is required' });
    }

    const stages = Array.isArray(completedStages) ? completedStages : [];
    const playtested = [1, 2, 3, 4, 5].every((stageNum) => stages.includes(stageNum));
    if (!playtested) {
      return res.status(400).json({ message: 'Play through all five stages before submitting.' });
    }

    // Re-validate server-side rather than trusting the client's echoed
    // content — the client could in principle send anything here.
    const result = validateScenarioDraft(JSON.stringify(content));
    if (!result.valid) {
      return res.status(422).json({ message: 'This case study no longer passes review.', issues: result.issues });
    }

    const capCheck = await checkSubmissionCap(authorEmail);
    if (!capCheck.allowed) {
      return res.status(429).json({
        message: `You've reached today's limit of ${capCheck.cap} submissions. Try again tomorrow.`
      });
    }

    const draft = await draftStore.createDraft({
      input: { concept: result.parsed.concept, hookWord: hookWord || undefined },
      content: result.parsed,
      providerUsed: 'learner-supplied',
      attempts: 1,
      status: 'needs_review',
      issues: [],
      author: { name: authorName.trim(), email: authorEmail.trim(), role: 'learner' }
    });

    res.status(201).json(draft);
  } catch (error) {
    next(error);
  }
});

// --- My case studies (learner's own view of what they've submitted) ---------
// No accounts, no login on this whole learner-facing router — email is the
// only thing tying a person back to their own submissions, same as
// submissionCap.js already uses it. This is not real authentication (anyone
// who knows a learner's email can see and edit their drafts), consistent
// with the rest of this BYOK, no-login surface — see the ownership check on
// resubmit below for the one place that matters more than a read.

router.get('/mine', async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    const drafts = await draftStore.listDrafts({ authorEmail: email });
    res.json(drafts);
  } catch (error) {
    next(error);
  }
});

// A rejected draft can be edited and sent back for another look, and so can
// an already-published one (the learner spots something they want to
// improve after the fact) — both land back in "needs_review" through this
// one route rather than creating a fresh draft, so a mentor sees it as an
// update to the same submission, not a new unrelated one. Re-approving a
// draft that was already published updates the live entry in place instead
// of duplicating it — see the approve route in routes/scenarioGenerator.js.
router.put('/drafts/:id/resubmit', async (req, res, next) => {
  try {
    const { authorEmail, content, completedStages } = req.body;

    if (!authorEmail || !EMAIL_RE.test(authorEmail)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }

    const draft = await draftStore.getDraft(req.params.id);
    if (!draft) return res.status(404).json({ message: 'Draft not found' });

    if (draft.author?.role !== 'learner' || draft.author?.email?.toLowerCase() !== authorEmail.trim().toLowerCase()) {
      return res.status(403).json({ message: 'This case study was not submitted with that email.' });
    }

    if (!content) {
      return res.status(400).json({ message: 'content is required' });
    }

    const stages = Array.isArray(completedStages) ? completedStages : [];
    const playtested = [1, 2, 3, 4, 5].every((stageNum) => stages.includes(stageNum));
    if (!playtested) {
      return res.status(400).json({ message: 'Play through all five stages before resubmitting.' });
    }

    const result = validateScenarioDraft(JSON.stringify(content));
    if (!result.valid) {
      return res.status(422).json({ message: 'This case study no longer passes review.', issues: result.issues });
    }

    // draft.published (if this was previously approved) is intentionally
    // left untouched here — the approve route uses it to know whether to
    // update the existing live entry or publish a new one.
    const updated = await draftStore.updateDraft(draft.id, {
      content: result.parsed,
      status: 'needs_review'
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// --- Published content (public, read-only) -----------------------------------
// Same data as the mentor router's /published (routes/scenarioGenerator.js),
// but mounted here — this router has no admin-token gate — so the homepage
// can list published case studies for every visitor, not just a logged-in
// mentor. Read-only: nothing here can create, edit, or approve anything.

router.get('/published', async (_req, res, next) => {
  try {
    const data = await contentStore.readAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
