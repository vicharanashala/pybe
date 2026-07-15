const mongoose = require('mongoose');

/**
 * Question — an admin-authored question attached to a Concept (module).
 * Admins can add any number per concept, in two flavors:
 *
 *  - 'practice'  a real coding question: starter code, Run + Visualize,
 *                checked by exact (trimmed) stdout match against
 *                `expectedOutput` / `acceptableOutputs`.
 *  - 'scenario'  a real-world reasoning question — no code at all. The
 *                learner reads `scenario` + `description` (the prompt) and
 *                writes a free-text answer, which is checked server-side
 *                with the same local semantic-similarity scoring used by
 *                the Section 1 discovery step (see reasoningService.js),
 *                against `keyPoints`. `keyPoints` is the answer key and is
 *                never sent to the client.
 *
 * These are served to learners by GET /api/questions/concept/:conceptId and
 * consumed by PythonPracticeWidget on the frontend, appended after the
 * built-in static question set for that concept's topic — so anything an
 * admin adds here actually shows up in the coding-practice step, it isn't
 * just an admin-side mock-up.
 */
const questionSchema = new mongoose.Schema({
  conceptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concept',
    required: true
  },
  type: {
    type: String,
    enum: ['practice', 'scenario'],
    default: 'practice'
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Real-world framing narrative. Optional flavor text for a 'practice'
  // question; the whole point of a 'scenario' question.
  scenario: {
    type: String,
    default: ''
  },
  // The task/prompt shown to the learner — for 'practice' this is the
  // coding task, for 'scenario' this is the question they reason about.
  description: {
    type: String,
    required: true
  },
  // 'practice' only — ignored for 'scenario' questions.
  starter: {
    type: String,
    default: '# write your code here\n'
  },
  hint: {
    type: String,
    default: ''
  },
  // 'practice' only.
  expectedOutput: {
    type: String,
    default: '',
    required: function () { return this.type === 'practice'; }
  },
  acceptableOutputs: {
    type: [String],
    default: []
  },
  // 'scenario' only — reference points for the semantic similarity check.
  // Answer key: never sent to the client.
  keyPoints: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

questionSchema.index({ conceptId: 1, order: 1 });

module.exports = mongoose.model('Question', questionSchema);
