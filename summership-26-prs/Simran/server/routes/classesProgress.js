import { Router } from "express";
import ClassesProgress from "../models/ClassesProgress.js";

const router = Router();
const LESSON_ID = "classes-sign-squad";

// GET /api/classes-progress/:learnerId -> fetch (or lazily create) progress
router.get("/:learnerId", async (req, res) => {
  try {
    const { learnerId } = req.params;
    let doc = await ClassesProgress.findOne({ learnerId, lessonId: LESSON_ID });
    if (!doc) {
      doc = await ClassesProgress.create({ learnerId, lessonId: LESSON_ID });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Could not load classes progress", details: err.message });
  }
});

// PATCH /api/classes-progress/:learnerId -> merge in whatever fields the client sends
router.patch("/:learnerId", async (req, res) => {
  try {
    const { learnerId } = req.params;
    const update = { ...req.body };

    if (update.lessonCompleted === true) {
      update.completedAt = new Date();
    }

    const doc = await ClassesProgress.findOneAndUpdate(
      { learnerId, lessonId: LESSON_ID },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Could not save classes progress", details: err.message });
  }
});

export default router;