const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Session = require('../models/Session');

const router = express.Router();

// @route    POST api/sessions
// @desc     Add a session
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('date', 'Date is required').not().isEmpty(),
      check('buyIn', 'Buy-in amount is required').isNumeric(),
      check('cashOut', 'Cash-out amount is required').isNumeric(),
      check('smallBlind', 'Big Blind amount is required').isNumeric(),
      check('bigBlind', 'Small Blind amount is required').isNumeric(),
      check('gameType', 'Game type is required').not().isEmpty(),
      check('gameType', 'Should be cash or tournament').isIn(['Cash', 'Tournament']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, buyIn, cashOut, bigBlind, smallBlind, gameType } = req.body;

    try {
      const newSession = new Session({
        date,
        buyIn,
        cashOut,
        smallBlind, 
        bigBlind,
        gameType,
        user: req.user.id,
      });

      const session = await newSession.save();

      res.json(session);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    GET api/sessions
// @desc     Get all sessions for the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a session by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    await Session.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Session removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
