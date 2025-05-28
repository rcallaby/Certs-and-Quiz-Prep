const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  score: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema)