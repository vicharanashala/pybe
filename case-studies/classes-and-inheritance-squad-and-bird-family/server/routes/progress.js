import { Router } from "express";
import Progress from "../models/Progress.js";

const router = Router();
const LESSON_ID = "inheritance-bird-family";

// GET /api/progress/:learnerId  -> fetch (or lazily create) progress
router.get("/:learnerId", async (req, res) => {
  try {
    const { learnerId } = req.params;
    let doc = await Progress.findOne({ learnerId, lessonId: LESSON_ID });
    if (!doc) {
      doc = await Progress.create({ learnerId, lessonId: LESSON_ID });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Could not load progress", details: err.message });
  }
});

// PATCH /api/progress/:learnerId -> merge in whatever fields the client sends
router.patch("/:learnerId", async (req, res) => {
  try {
    const { learnerId } = req.params;
    const update = { ...req.body };

    if (update.lessonCompleted === true) {
      update.completedAt = new Date();
    }

    const doc = await Progress.findOneAndUpdate(
      { learnerId, lessonId: LESSON_ID },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Could not save progress", details: err.message });
  }
});

export default router;
