const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Which real-world genre the learner is most interested in. Every
  // discovery-learning scenario shown to this user is pulled from the
  // matching theme in Challenge.themes.
  theme: {
    type: String,
    enum: ['sports', 'daily-life', 'philosophy', 'food', 'environmental'],
    default: null
  },
  // Free-text answer to "why do you want to learn Python?" — shown back to
  // the learner on their dashboard and available for future personalization.
  learningGoal: {
    type: String,
    default: ''
  },
  pythonLevel: {
    type: String,
    enum: ['beginner', 'intermediate'],
    default: null
  },
  learningMode: {
    type: String,
    enum: ['guided', 'explore'],
    default: null
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
