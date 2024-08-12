const mongoose = require('mongoose');

const HandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  player: {
    type: String,
    required: true,
  },
  cards: {
    type: String,
    required: true,
  },
  bets: {
    type: Number,
    required: true,
  },
  pot: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Hand', HandSchema);
