const mongoose = require('mongoose');

const HandSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'session',
    required: true
  },
  players: {
    type: Number,
    required: true
  },
  smallBlind: {
    type: Number,
    required: true
  },
  bigBlind: {
    type: Number,
    required: true
  },
  dealer: {
    type: Number,
    required: true
  },
  hands: [
    {
      playerId: {
        type: Number,
        required: true
      },
      chips: {
        type: Number,
        required: true
      },
      card1: {
        type: String,
        required: true
      },
      card2: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('hand', HandSchema);
