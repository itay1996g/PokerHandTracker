const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const Hand = require('../models/Hand');

// @route    POST api/hands
// @desc     Create a new hand
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('sessionId', 'Session ID is required').not().isEmpty(),
      check('players', 'Number of players is required').isNumeric(),
      check('smallBlind', 'Small blind is required').isNumeric(),
      check('bigBlind', 'Big blind is required').isNumeric(),
      check('dealer', 'Dealer is required').isNumeric(),
      check('hands', 'Hands are required').isArray(),
      check('hands.*.playerId', 'Player ID is required').isNumeric(),
      check('hands.*.chips', 'Chips are required').isNumeric(),
      check('hands.*.card1', 'Card 1 is required').not().isEmpty(),
      check('hands.*.card2', 'Card 2 is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, players, smallBlind, bigBlind, dealer, hands } = req.body;

    try {
      const newHand = new Hand({
        sessionId,
        players,
        smallBlind,
        bigBlind,
        dealer,
        hands
      });

      const hand = await newHand.save();
      res.json(hand);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
