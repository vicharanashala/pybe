const express = require('express');
const requireAdminToken = require('../middleware/requireAdminToken');
const aiConfigStore = require('../services/aiConfigStore');
const { generateCaseStudy } = require('../services/scenarioPipeline');
const draftStore = require('../services/draftStore');
const contentStore = require('../services/scenarioContentStore');
const { validateScenarioDraft } = require('../services/scenarioValidator');
const generationFeedback = require('../services/generationFeedback');

const router = express.Router();

router.use(requireAdminToken);

// --- AI config -------------------------------------------------------------

router.get('/config', async (_req, res, next) => {
  try {
    // readMaskedConfig() already includes availableProviders — every config
    // response (GET and both PUTs below) shares that one source of truth now.
    const config = await aiConfigStore.readMaskedConfig();
    res.json(config);
  } catch (error) {
    next(error);
  }
});

router.put('/config/active-provider', async (req, res, next) => {
  try {
    const { provider } = req.body;
    const config = await aiConfigStore.setActiveProvider(provider);
    res.json(config);
  } catch (error) {
    next(error);
  }
});

router.put('/config/providers/:name', async (req, res, next) => {
  try {
    const config = await aiConfigStore.updateProvider(req.params.name, req.body || {});
    res.json(config);
  } catch (error) {
    next(error);
  }
});

// --- Generate ----------------------------------------------------------------

router.post('/generate', async (req, res, next) => {
  try {
    const { concept, hookWord, avoidList, previousBeat } = req.body;
    if (!concept || !concept.trim()) {
      return res.status(400).json({ message: 'concept is required' });
    }

    const { providerName, apiKey, model, baseUrl } = await aiConfigStore.getActiveProviderCredentials();

    // Runs Part A then Part B as two separate provider calls — see
    // scenarioPipeline.js for why this is split rather than one call.
    const { content, attempts, issues } = await generateCaseStudy({
      providerName, apiKey, model, baseUrl, concept, hookWord, avoidList, previousBeat
    });

    const draft = await draftStore.createDraft({
      input: { concept, hookWord, avoidList, previousBeat },
      content,
      providerUsed: providerName,
      attempts,
      status: content ? 'needs_review' : 'failed',
      issues: content ? [] : issues,
      author: { name: 'Mentor', email: '', role: 'mentor' }
    });

    res.status(content ? 201 : 422).json(draft);
  } catch (error) {
    next(error);
  }
});

// --- Drafts / review ---------------------------------------------------------

router.get('/drafts', async (req, res, next) => {
  try {
    const drafts = await draftStore.listDrafts({ status: req.query.status });
    res.json(drafts);
  } catch (error) {
    next(error);
  }
});

router.get('/drafts/:id', async (req, res, next) => {
  try {
    const draft = await draftStore.getDraft(req.params.id);
    if (!draft) return res.status(404).json({ message: 'Draft not found' });
    res.json(draft);
  } catch (error) {
    next(error);
  }
});

router.put('/drafts/:id', async (req, res, next) => {
  try {
    const draft = await draftStore.updateDraft(req.params.id, { content: req.body.content });
    if (!draft) return res.status(404).json({ message: 'Draft not found' });
    res.json(draft);
  } catch (error) {
    next(error);
  }
});

router.post('/drafts/:id/approve', async (req, res, next) => {
  try {
    const draft = await draftStore.getDraft(req.params.id);
    if (!draft) return res.status(404).json({ message: 'Draft not found' });
    if (!draft.content) return res.status(400).json({ message: 'Draft has no content to publish' });

    // Re-validate against the CURRENT schema before publishing, even though
    // this content was already validated once at generation time. A draft
    // can sit in the review queue for a long time — long enough for the
    // schema itself to change underneath it (this is exactly what happened
    // when the arc went from 3 stages to 5: an old draft with the old
    // stage2 shape sat untouched in scenarioDrafts.json, got approved
    // without anyone noticing it predated the new rules, and crashed
    // PlaytestEngine for every learner who tried to play it). This is the
    // one gate a stale or hand-edited draft can't slip through.
    const result = validateScenarioDraft(JSON.stringify(draft.content));
    if (!result.valid) {
      return res.status(422).json({
        message: 'This draft no longer passes review and cannot be published as-is — it may predate a schema change, or an edit introduced an issue.',
        issues: result.issues
      });
    }

    // A draft can now be approved more than once — a learner can edit an
    // already-published case study and resubmit it (see the /mine +
    // /drafts/:id/resubmit routes in routes/scenarioGeneratorLearner.js),
    // landing it back in this same review queue. If draft.published is
    // already set, this approval is an update to that existing live entry,
    // not a brand new case study — update it in place via
    // contentStore.updateCaseStudy rather than publishCaseStudy, which
    // would otherwise append a second, duplicate entry next to the one
    // actually being revised. Falls back to publishing fresh if the
    // original entry no longer exists (e.g. a mentor deleted it from the
    // Published tab in the meantime) so approval still succeeds either way.
    let published;
    const existingEntry = draft.published
      && await contentStore.updateCaseStudy(draft.published.topicId, draft.published.levelId, draft.published.caseStudyId, draft.content);
    if (existingEntry) {
      published = draft.published; // same entry, updated in place — the pointer itself doesn't change
    } else {
      published = await contentStore.publishCaseStudy(draft.content, { domain: draft.input?.hookWord });
    }
    const updated = await draftStore.updateDraft(req.params.id, { status: 'published', published });

    // Feeds this outcome back into the next generation for this same
    // concept — see generationFeedback.js. draft.originalContent is the
    // untouched snapshot from creation; draft.content is whatever actually
    // got published, which differs from it exactly when a mentor edited the
    // draft before approving. Best-effort: a failure here should never take
    // down a successful publish, so it's logged rather than propagated.
    generationFeedback
      .recordApproval({
        concept: draft.content.concept,
        originalContent: draft.originalContent,
        finalContent: draft.content,
        topicId: published.topicId,
        levelId: published.levelId,
        caseStudyId: published.caseStudyId,
        levelTitle: draft.content.levelTitle
      })
      .catch((error) => console.error('generationFeedback.recordApproval failed:', error));

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.post('/drafts/:id/reject', async (req, res, next) => {
  try {
    const draft = await draftStore.updateDraft(req.params.id, {
      status: 'rejected',
      reviewNote: req.body?.note || ''
    });
    if (!draft) return res.status(404).json({ message: 'Draft not found' });

    // Same best-effort pattern as recordApproval above — a rejection note is
    // the clearest possible "don't repeat this" signal for the next
    // generation of this concept, but capturing it should never block the
    // reject action itself.
    generationFeedback
      .recordRejection({
        concept: draft.content?.concept,
        note: draft.reviewNote,
        levelTitle: draft.content?.levelTitle
      })
      .catch((error) => console.error('generationFeedback.recordRejection failed:', error));

    res.json(draft);
  } catch (error) {
    next(error);
  }
});

// --- Published content (read-only browse) -----------------------------------
// Approving a draft writes into generatedContent.json (see
// scenarioContentStore.js), which is a separate file from the base app's
// real data source (data/db.json) by design — a maintainer merges it in by
// hand later. This route is just so a mentor can actually see/play what
// they've published, via MentorApp's "Published" tab, without opening the
// file directly.

router.get('/published', async (_req, res, next) => {
  try {
    const data = await contentStore.readAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// --- Published content (edit / unpublish) -----------------------------------
// These write straight to generatedContent.json with no second review step —
// the mentor's Published tab is the only place this content is visible and
// playable at all, so an edit here has to clear the same bar approve does,
// and a delete has nowhere further to "undo" to. Both act on generatedContent
// only; they never touch scenarioDrafts.json's own record of the underlying
// draft except for the best-effort status sync in the delete route below.

router.put('/published/:topicId/:levelId/:caseStudyId', async (req, res, next) => {
  try {
    const { topicId, levelId, caseStudyId } = req.params;
    const editedContent = req.body?.content;
    if (!editedContent) return res.status(400).json({ message: 'content is required' });

    const data = await contentStore.readAll();
    const topic = data.topics.find((t) => t.topicId === topicId);
    const level = topic?.levels.find((l) => l.levelId === Number(levelId));
    const existing = level?.caseStudies.find((cs) => cs.id === caseStudyId);
    if (!topic || !level || !existing) {
      return res.status(404).json({ message: 'Published case study not found' });
    }

    // Same re-validation gate approve runs before publishing (see the
    // approve route above) — an edit here goes straight back to the live
    // homepage export with no review step after it, so it can't skip the
    // check that catches a broken template or a stripped required field.
    // Validated against the full arc, not just the edited fields, since a
    // template/token mismatch introduced by an edit can only be caught in
    // context of the whole case study.
    const draftShaped = {
      concept: level.concept,
      theory: level.theory,
      levelTitle: level.title,
      designNote: level.designNote,
      ...existing,
      ...editedContent
    };
    const result = validateScenarioDraft(JSON.stringify(draftShaped));

    // The mentor's edit form here only ever touches scenario / stage4.
    // conceptReveal / scaleReflection (same three fields ReviewPanel's
    // pre-publish edit offers) — it never sends flowSteps/predictOutput/
    // edgeCase/applyCheck at all. Every currently published case study
    // predates those rule-17 fields, so validating the full arc would fail
    // an edit on "stage4.flowSteps is missing" even when the edit itself is
    // fine — punishing a gap this form can't fix. Issues about those four
    // specific fields are dropped here for that reason alone; every other
    // issue (a genuinely broken template, a stripped required field, a
    // banned phrase) still blocks the save exactly as before.
    const blockingIssues = result.issues.filter(
      (issue) => !/^stage4\.flowSteps|^stage4\.predictOutput|^stage4\.edgeCase|^stage5\.applyCheck/.test(issue)
    );
    if (blockingIssues.length) {
      return res.status(422).json({
        message: 'This edit does not pass review and was not saved.',
        issues: blockingIssues
      });
    }

    const updated = await contentStore.updateCaseStudy(topicId, levelId, caseStudyId, editedContent);
    if (!updated) return res.status(404).json({ message: 'Published case study not found' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/published/:topicId/:levelId/:caseStudyId', async (req, res, next) => {
  try {
    const { topicId, levelId, caseStudyId } = req.params;
    const removed = await contentStore.deleteCaseStudy(topicId, levelId, caseStudyId);
    if (!removed) return res.status(404).json({ message: 'Published case study not found' });

    // Best-effort: flip the originating draft's status away from
    // "published" so Review Queue's status filter doesn't keep listing it
    // as still live once its actual published content is gone. Never blocks
    // the delete itself — the case study is already removed from
    // generatedContent.json by this point regardless of what happens here.
    draftStore
      .findDraftByPublishedCaseStudy(caseStudyId)
      .then((draft) => {
        if (!draft) return null;
        return draftStore.updateDraft(draft.id, {
          status: 'rejected',
          reviewNote: 'Unpublished by mentor from the Published tab.',
          published: null
        });
      })
      .catch((error) => console.error('draftStore status sync on delete failed:', error));

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
