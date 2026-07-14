const mongoose = require('mongoose');

/**
 * LoginLog — one document per successful login, for the admin "User Login
 * Logs" view. Denormalizes name/email/role at the time of login so the log
 * still reads sensibly even if a user later changes their name.
 */
const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  role: { type: String, default: 'user' },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  loginAt: {
    type: Date,
    default: Date.now
  }
});

loginLogSchema.index({ userId: 1, loginAt: -1 });
loginLogSchema.index({ loginAt: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
