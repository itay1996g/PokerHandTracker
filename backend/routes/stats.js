import express from 'express'
import { calculateEquity } from 'poker-odds'

const router = express.Router()

router.post('/odds', (req, res) => {
  const { hand1, hand2, preflop, flop, turn, river } = req.body

  try {
    // Construct the hands array
    const hands = [[...hand1.split(' ')], hand2 ? [...hand2.split(' ')] : []].filter(hand => hand.length > 0)

    // Construct the board array
    const board = []
    if (preflop) board.push(...preflop.split(' '))
    if (flop) board.push(...flop.split(' '))
    if (turn) board.push(...turn.split(' '))
    if (river) board.push(...river.split(' '))

    // Calculate odds using the poker-odds library
    const iterations = 100000
    const exhaustive = false
    const oddsResult = calculateEquity(hands, board, iterations, exhaustive)

    res.status(200).json({ odds: oddsResult })
  } catch (error) {
    console.error('Error calculating odds:', error)
    res.status(500).json({ error: 'Error calculating odds. Please check your input and try again.' })
  }
})

export default router
