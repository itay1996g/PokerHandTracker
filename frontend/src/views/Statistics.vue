<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-green-900 py-6">
    <div class="bg-green-700 p-6 rounded-lg shadow-md w-full max-w-2xl text-white">
      <h1 class="text-3xl font-semibold mb-6 text-center">Poker Odds Calculator</h1>
      
      <!-- Hand Placeholders -->
      <div class="flex justify-between mb-6">
        <div class="flex">
          <div
            v-for="(card, index) in hand1"
            :key="index"
            :class="['relative flex items-center justify-center w-20 h-28 rounded-lg shadow-inner mr-2', currentFocus === 'hand1' ? 'border-4 border-yellow-400' : 'bg-gray-800 text-white']"
            @click="setFocus('hand1')"
          >
            <span v-if="!card.length" class="text-xl text-gray-400">Hand 1</span>
            <template v-else>
              <span class="text-3xl font-bold">{{ getCardRank(card) }}</span>
              <span class="absolute top-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute bottom-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute top-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute bottom-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
            </template>
          </div>
        </div>
        <div class="flex">
          <div
            v-for="(card, index) in hand2"
            :key="index"
            :class="['relative flex items-center justify-center w-20 h-28 rounded-lg shadow-inner mr-2', currentFocus === 'hand2' ? 'border-4 border-yellow-400' : 'bg-gray-800 text-white']"
            @click="setFocus('hand2')"
          >
            <span v-if="!card.length" class="text-xl text-gray-400">Hand 2</span>
            <template v-else>
              <span class="text-3xl font-bold">{{ getCardRank(card) }}</span>
              <span class="absolute top-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute bottom-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute top-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
              <span class="absolute bottom-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
            </template>
          </div>
        </div>
      </div>

      <!-- Board Placeholders -->
      <div class="flex justify-between mb-6">
        <div
          v-for="(card, index) in board"
          :key="index"
          :class="['relative flex items-center justify-center w-20 h-28 rounded-lg shadow-inner', currentFocus === `board${index}` ? 'border-4 border-yellow-400' : 'bg-gray-800 text-white']"
          @click="setFocus(`board${index}`)"
        >
          <span v-if="!card.length" class="text-xl text-gray-400">Board</span>
          <template v-else>
            <span class="text-3xl font-bold">{{ getCardRank(card) }}</span>
            <span class="absolute top-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
            <span class="absolute bottom-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
            <span class="absolute top-1 right-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
            <span class="absolute bottom-1 left-1 text-lg font-bold" :class="getSuitColor(getCardSuit(card))">{{ getCardSuitSymbol(card) }}</span>
          </template>
        </div>
      </div>

      <!-- Card Selection -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4 text-center">Select a Card</h2>
        <div class="flex justify-center gap-4">
          <div>
            <h3 class="font-bold text-center mb-2">Suit</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="(symbol, suit) in suitSymbols"
                :key="suit"
                @click="selectSuit(suit)"
                :disabled="isSuitDisabled(suit)"
                :class="['w-16 h-16 bg-gray-700 text-white rounded-lg shadow-lg text-2xl focus:outline-none', isSuitDisabled(suit) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600']"
              >
                {{ symbol }}
              </button>
            </div>
          </div>
          <div>
            <h3 class="font-bold text-center mb-2">Rank</h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="rank in ranks"
                :key="rank"
                @click="selectRank(rank)"
                :disabled="isRankDisabled(rank)"
                :class="['w-10 h-10 bg-gray-700 text-white rounded-lg shadow-lg focus:outline-none', isRankDisabled(rank) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600']"
              >
                {{ rank }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between mt-6">
        <button
          @click="calculateOdds"
          class="w-5/12 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Calculate Odds
        </button>
        <button
          @click="clearSelections"
          class="w-5/12 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Clear
        </button>
      </div>

      <!-- Odds Message -->
      <div v-if="oddsMessage" class="mt-6">
        <h2 class="text-xl font-semibold mb-2 text-center">Results</h2>
        <div class="grid grid-cols-1 gap-4 text-center">
          <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="font-semibold text-lg">Hand 1 Win Odds</h3>
            <p class="text-2xl">{{ oddsMessage.hand1WinOdds }}%</p>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="font-semibold text-lg">Hand 2 Win Odds</h3>
            <p class="text-2xl">{{ oddsMessage.hand2WinOdds }}%</p>
          </div>
          <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="font-semibold text-lg">Tie Odds</h3>
            <p class="text-2xl">{{ oddsMessage.tieOdds }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'OddsCalculator',
  setup() {
    const hand1 = ref<string[]>(['', ''])
    const hand2 = ref<string[]>(['', ''])
    const board = ref<string[]>(['', '', '', '', ''])
    const selectedSuit = ref<string | null>(null)
    const selectedRank = ref<string | null>(null)
    const currentFocus = ref<string>('hand1')  // Set initial focus to Hand 1
    const suitSymbols = ref({
      Hearts: '♥',
      Diamonds: '♦',
      Clubs: '♣',
      Spades: '♠',
    })
    const ranks = ref(['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'])
    const selectedCards = ref<Set<string>>(new Set())
    const oddsMessage = ref<{ hand1WinOdds: number; hand2WinOdds: number; tieOdds: number } | null>(null)

    const isSuitDisabled = (suit: string) => {
      if (!selectedRank.value) return false
      return selectedCards.value.has(`${selectedRank.value} of ${suit}`)
    }

    const isRankDisabled = (rank: string) => {
      if (!selectedSuit.value) return false
      return selectedCards.value.has(`${rank} of ${selectedSuit.value}`)
    }

    const setFocus = (focus: string) => {
      currentFocus.value = focus
    }

    const selectSuit = (suit: string) => {
      selectedSuit.value = suit
      checkAndAssignCard()
    }

    const selectRank = (rank: string) => {
      selectedRank.value = rank
      checkAndAssignCard()
    }

    const checkAndAssignCard = () => {
      if (selectedSuit.value && selectedRank.value) {
        const card = `${selectedRank.value} of ${selectedSuit.value}`
        assignCard(card)
        selectedCards.value.add(card)
        selectedSuit.value = null
        selectedRank.value = null
      }
    }

    const assignCard = (card: string) => {
      if (currentFocus.value === 'hand1' && hand1.value.includes('')) {
        hand1.value[hand1.value.indexOf('')] = card
      } else if (currentFocus.value === 'hand2' && hand2.value.includes('')) {
        hand2.value[hand2.value.indexOf('')] = card
      } else if (currentFocus.value.startsWith('board')) {
        const index = parseInt(currentFocus.value.replace('board', ''))
        board.value[index] = card
      }
    }

    const getCardRank = (card: string) => {
      return card.split(' ')[0]
    }

    const getCardSuit = (card: string) => {
      return card.split(' ')[2]
    }

    const getCardSuitSymbol = (card: string) => {
      return suitSymbols.value[getCardSuit(card) as keyof typeof suitSymbols.value]
    }

    const getSuitColor = (suit: string) => {
      return ['Hearts', 'Diamonds'].includes(suit) ? 'text-red-500' : 'text-black'
    }

    const calculateOdds = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/odds', {
          hand1: hand1.value.join(' '),
          hand2: hand2.value.join(' '),
          preflop: board.value[0],
          flop: board.value.slice(1, 4).join(' '),
          turn: board.value[3],
          river: board.value[4],
        })
        oddsMessage.value = {
          hand1WinOdds: response.data.hand1WinOdds,
          hand2WinOdds: response.data.hand2WinOdds,
          tieOdds: response.data.tieOdds,
        }
      } catch (error) {
        oddsMessage.value = null
        console.error('Error calculating odds:', error)
      }
    }

    const clearSelections = () => {
      hand1.value = ['', '']
      hand2.value = ['', '']
      board.value = ['', '', '', '', '']
      selectedCards.value.clear()
      oddsMessage.value = null
      currentFocus.value = 'hand1'  // Reset focus to Hand 1
    }

    return {
      hand1,
      hand2,
      board,
      suitSymbols,
      ranks,
      selectedSuit,
      selectedRank,
      selectedCards,
      currentFocus,
      isSuitDisabled,
      isRankDisabled,
      setFocus,
      selectSuit,
      selectRank,
      calculateOdds,
      clearSelections,
      getCardRank,
      getCardSuit,
      getCardSuitSymbol,
      getSuitColor,
      oddsMessage,
    }
  }
})
</script>
