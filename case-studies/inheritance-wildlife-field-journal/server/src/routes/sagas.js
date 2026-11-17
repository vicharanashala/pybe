const express = require('express');
const store = require('../data/store');
const llmService = require('../services/llmService');

const router = express.Router();

// GET /api/sagas — list available case studies (light metadata)
router.get('/', async (_req, res, next) => {
  try {
    const sagas = await store.listSagas();
    res.json(sagas);
  } catch (err) {
    next(err);
  }
});

// GET /api/sagas/:sagaId — full saga definition
router.get('/:sagaId', async (req, res, next) => {
  try {
    const saga = await store.getSaga(req.params.sagaId);
    if (!saga) return res.status(404).json({ message: 'Saga not found' });
    res.json(saga);
  } catch (err) {
    next(err);
  }
});

// GET /api/sagas/:sagaId/acts — flattened list of all acts
router.get('/:sagaId/acts', async (req, res, next) => {
  try {
    const saga = await store.getSaga(req.params.sagaId);
    if (!saga) return res.status(404).json({ message: 'Saga not found' });
    const acts = await store.getAllActs(req.params.sagaId);
    res.json(acts);
  } catch (err) {
    next(err);
  }
});

// POST /api/sagas/:sagaId/evaluate — evaluate a user's act answer
router.post('/:sagaId/evaluate', async (req, res, next) => {
  try {
    const { actNumber, userAnswer } = req.body;
    if (!actNumber || !userAnswer) {
      return res.status(400).json({ message: 'actNumber and userAnswer are required' });
    }

    const saga = await store.getSaga(req.params.sagaId);
    if (!saga) return res.status(404).json({ message: 'Saga not found' });

    const act = await store.getAct(req.params.sagaId, actNumber);
    if (!act) return res.status(404).json({ message: 'Act not found' });

    const evaluation = await llmService.evaluate({
      sagaId: saga.id,
      actNumber: act.act,
      actName: act.name,
      arcName: act.arcName,
      concept: act.concept,
      storyBeat: act.narrative.map((n) => n.text).join(' '),
      questions: act.questions,
      expectedInsight: act.expectedInsight,
      userAnswer
    });

    res.json(evaluation);
  } catch (err) {
    next(err);
  }
});

// POST /api/sagas/:sagaId/session — save a completed session
router.post('/:sagaId/session', async (req, res, next) => {
  try {
    const session = await store.saveSession(req.params.sagaId, req.body);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// GET /api/sagas/:sagaId/notes — all summary notes saved for this saga
router.get('/:sagaId/notes', async (req, res, next) => {
  try {
    const notes = await store.listNotes(req.params.sagaId);
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// POST /api/sagas/:sagaId/notes — save one act summary note
router.post('/:sagaId/notes', async (req, res, next) => {
  try {
    const { act, actName, text } = req.body;
    if (!act || !text) {
      return res.status(400).json({ message: 'act and text are required' });
    }
    const note = await store.addNote(req.params.sagaId, { act, actName, text });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

module.exports = router;