const mongoose = require('mongoose');

// Tracks a learner's progress on practice problems, keyed by their real
// PYBE user id (passed through as `userId` from the authenticated frontend)
// and the problem's slug. One document per user+problem.
const PracticeProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    problemSlug: { type: String, required: true, index: true },
    status: { type: String, enum: ['attempted', 'solved'], default: 'attempted' },
    lastCode: { type: String, default: '' },
  },
  { timestamps: true }
);

PracticeProgressSchema.index({ userId: 1, problemSlug: 1 }, { unique: true });

module.exports = mongoose.model('PracticeProgress', PracticeProgressSchema);
