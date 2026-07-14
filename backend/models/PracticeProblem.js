const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema(
  {
    mode: { type: String, enum: ['args', 'custom'], required: true },
    args: { type: mongoose.Schema.Types.Mixed }, // used when mode === 'args'
    call: { type: String }, // used when mode === 'custom' (raw python expr)
    displayInput: { type: String, default: '' },
    expected: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const PracticeProblemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    topic: { type: String, required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 }, // position within topic (1-10)
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    description: { type: String, required: true },
    hint: { type: String, default: '' },
    functionName: { type: String, required: true },
    paramNames: { type: [String], default: [] },
    starterCode: { type: String, required: true },
    tests: { type: [TestSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PracticeProblem', PracticeProblemSchema);
