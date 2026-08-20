import mongoose from "mongoose";

/**
 * Tracks one learner's journey through the "Sign the Squad" classes lesson.
 * One document per (learnerId, lessonId) pair — mirrors Progress.js's shape
 * so the two lessons stay consistent, but lives in its own collection since
 * the fields (appStage, jargon views, etc.) are specific to this lesson.
 */
const classesProgressSchema = new mongoose.Schema(
  {
    learnerId: {
      type: String, // same id as Progress.js — shared across both lessons
      required: true,
      trim: true,
    },
    lessonId: {
      type: String,
      default: "classes-sign-squad",
      required: true,
    },
    appStage: {
      // "manual" | "scaling" | "explain" | "smart" | "learn" | "test"
      // Mirrors CLASSES_STAGE_STORAGE_KEY on the frontend. Informational/
      // resume-only, no enum validation so new stages never need a
      // migration.
      type: String,
      default: "manual",
    },
    squadPlayersSigned: {
      // count of players signed in the manual/scaling stages
      type: Number,
      default: 0,
    },
    smartStepIndex: {
      // how far through the Stage 4 "build the blueprint" walkthrough
      type: Number,
      default: -1,
    },
    testPassed: {
      type: Boolean,
      default: false,
    },
    jargonViewed: {
      // which jargon-circle terms ("class", "init", "self", ...) the
      // learner has clicked on at least once
      type: [String],
      default: [],
    },
    lessonCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

classesProgressSchema.index({ learnerId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model("ClassesProgress", classesProgressSchema);