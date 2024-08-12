const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['Cash', 'Tournament'],
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  buyIn: {
    type: Number,
    required: true,
  },
  cashOut: {
    type: Number,
    required: true,
  },
  bigBlind: {
    type: Number,
    required: true,
  },
  smallBlind: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('session', SessionSchema);
