const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conceptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concept',
    required: true
  },
  discoveryCompleted: {
    type: Boolean,
    default: false
  },
  // Everything the learner produced (and the AI generated) during Section
  // 1, saved so the whole thing can be reviewed later WITHOUT re-running
  // any AI call and WITHOUT letting the learner edit their old answers —
  // this is a read-only "here's what happened" snapshot, not live state.
  discoverySnapshot: {
    // The learner's three free-text answers, in order.
    responses: { type: [String], default: undefined },
    // The single consolidated AI explanation shown after those three.
    explanation: { type: String, default: undefined },
    // Which option the learner picked on the follow-up decision scenario
    // ('A' or 'B'), if they got that far.
    decisionChoice: { type: String, default: undefined },
    // Whether that pick was the correct one.
    decisionCorrect: { type: Boolean, default: undefined },
    // The AI's analysis of that specific pick.
    decisionAnalysis: { type: String, default: undefined }
  },
  codingCompleted: {
    type: Boolean,
    default: false
  },
  // Section 3 — the two drag-and-drop fill-in-the-blank questions shown
  // right after the Section 2 visualizer, before the learner can move on.
  blanksCompleted: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicates
progressSchema.index({ userId: 1, conceptId: 1 }, { unique: true });

// Auto-set completed when all three sub-tasks are done
progressSchema.pre('save', function (next) {
  if (this.discoveryCompleted && this.codingCompleted && this.blanksCompleted) {
    this.completed = true;
    if (!this.completedAt) this.completedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);
