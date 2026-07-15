const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium'],
    required: true
  },
  // Name of a lucide-react icon component (e.g. "Package"), looked up via
  // frontend/src/utils/conceptIcons.jsx — not an emoji.
  icon: {
    type: String,
    default: 'Sparkles'
  },
  description: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Concept', conceptSchema);
