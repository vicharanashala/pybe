import mongoose from "mongoose";

/**
 * Tracks one learner's journey through the "Bird Family" inheritance lesson.
 * One document per (learnerId, lessonId) pair.
 */
const progressSchema = new mongoose.Schema(
  {
    learnerId: {
      type: String, // free-text/anon id for now (name, roll no, or auth id later)
      required: true,
      trim: true,
    },
    lessonId: {
      type: String,
      default: "inheritance-bird-family",
      required: true,
    },
    storyUnderstood: {
      type: Boolean,
      default: false,
    },
    reflectAnswer: {
      type: String,
      default: "",
    },
    thinkItThrough: {
      // answers to the "pattern recognition" MCQs
      type: [
        {
          questionId: String,
          selected: String,
          correct: Boolean,
        },
      ],
      default: [],
    },
    buildItAnswers: {
      // answers to the "map story to code" MCQs
      type: [
        {
          questionId: String,
          selected: String,
          correct: Boolean,
        },
      ],
      default: [],
    },
    simulatorSteps: {
      // one boolean per level, e.g. inheritCompleted, extendCompleted,
      // overrideCompleted, superOverrideCompleted — kept flexible so adding
      // or renaming a level never requires a schema migration.
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lessonCompleted: {
      type: Boolean,
      default: false,
    },
    lastStep: {
      // Which step in the frontend's fixed STEPS sequence the learner
      // was last on (e.g. "concept", "simulate-extend"). Purely for
      // resuming progress — informational only, no validation against
      // a fixed enum so it never needs a migration when steps change.
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

progressSchema.index({ learnerId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
