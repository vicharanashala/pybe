const mongoose = require('mongoose');

const treasureSchema = new mongoose.Schema({
  keySymbol: { type: String, required: true, unique: true },
  treasureValue: { type: String, required: true },
  hint: { type: String, required: true }
});

module.exports = mongoose.model('Treasure', treasureSchema);
