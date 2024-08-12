<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="isModalOpen"
  >
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add Hand</h3>
              <div class="mt-2 flex justify-center">
                <div class="poker-table-container">
                  <div class="poker-table relative">
                    <div
                      v-for="seat in visibleSeats"
                      :key="seat.id"
                      :style="seat.style"
                      class="poker-seat"
                      @click="selectPlayer(seat.id)"
                    >
                      <div
                        :class="[
                          'seat-circle',
                          { 'hero-seat': seat.id === Number(dealerChipPosition) },
                          { 'folded-seat': seat.isFolded }
                        ]"
                      >
                        {{ seat.id }}
                      </div>
                      <div class="chip-count">{{ seat.chips }}</div>
                      <div class="position-title">{{ seat.position }}</div>
                      <div class="cards">
                        <div
                          v-if="seat.card1"
                          class="card-display"
                          :style="{ color: ['♥', '♦'].includes(seat.card1[0]) ? 'red' : 'black' }"
                        >
                          {{ seat.card1 }}
                        </div>
                        <div
                          v-if="seat.card2"
                          class="card-display"
                          :style="{
                            color: ['♥', '♦'].includes(selectedPlayerCard2[0]) ? 'red' : 'black'
                          }"
                        >
                          {{ seat.card2 }}
                        </div>
                      </div>
                      <div
                        v-if="seat.id !== Number(heroPosition) && seat.isPlaying && !seat.isFolded"
                        class="opponent-cards"
                      >
                        <div class="card-back"></div>
                        <div class="card-back"></div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="selectedPlayerCard1 && selectedPlayerCard2"
                    class="player1-cards"
                    :style="{ top: '120%', left: '50%', transform: 'translate(-385%, -60%)' }"
                  >
                    <div
                      class="card-display"
                      :style="{
                        color: ['♥', '♦'].includes(selectedPlayerCard1[0]) ? 'red' : 'black'
                      }"
                    >
                      {{ selectedPlayerCard1 }}
                    </div>
                    <div
                      class="card-display"
                      :style="{
                        color: ['♥', '♦'].includes(selectedPlayerCard2[0]) ? 'red' : 'black'
                      }"
                    >
                      {{ selectedPlayerCard2 }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="menu-container">
                <div class="left-menu">
                  <div class="cards-menu">
                    <div class="flex justify-between items-start">
                      <div class="flex flex-1 items-center">
                        <div
                          @click="selectCard('card1')"
                          class="card-placeholder"
                          :class="{ selected: selectedCard === 'card1' }"
                        >
                          <div
                            v-if="selectedPlayerCard1"
                            class="card-display"
                            :style="{
                              color: ['♥', '♦'].includes(selectedPlayerCard1[0]) ? 'red' : 'black'
                            }"
                          >
                            {{ selectedPlayerCard1 }}
                          </div>
                          <div v-else class="card-title">Card 1</div>
                        </div>
                        <div
                          @click="selectCard('card2')"
                          class="card-placeholder"
                          :class="{ selected: selectedCard === 'card2' }"
                        >
                          <div
                            v-if="selectedPlayerCard2"
                            class="card-display"
                            :style="{
                              color: ['♥', '♦'].includes(selectedPlayerCard2[0]) ? 'red' : 'black'
                            }"
                          >
                            {{ selectedPlayerCard2 }}
                          </div>
                          <div v-else class="card-title">Card 2</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="showCardSelection" class="card-selection mt-4 half-screen">
                      <CardSelection
                        v-model="selectedCardValue"
                        :usedCards="usedCards"
                        :otherCard="otherCard"
                        @update:modelValue="onCardSelected"
                      />
                    </div>
                  </div>
                  <div class="settings-menu">
                    <form @submit.prevent="addHand" class="mt-5 sm:mt-6 w-full">
                      <div>
                        <label for="players" class="block text-gray-700">Players:</label>
                        <select
                          id="players"
                          v-model="players"
                          class="mt-1 block max-w-xs w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option v-for="n in 9" :key="n" :value="n">{{ n }}</option>
                        </select>
                      </div>
                      <div>
                        <label for="dealer" class="block text-gray-700">Dealer:</label>
                        <select
                          id="dealer"
                          v-model.number="dealer"
                          class="mt-1 block max-w-xs w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option
                            v-for="n in Array.from({ length: players }, (_, i) => i + 1)"
                            :key="n"
                            :value="n"
                          >
                            {{ n }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label for="chip-count" class="block text-gray-700">Chip Count</label>
                        <input
                          type="number"
                          id="chip-count"
                          v-model="selectedPlayerChips"
                          class="mt-1 block w-20 border-gray-300 max-w-xs rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div class="vertical-border"></div>
                <div class="actions-menu">
                  <button
                    @click="check"
                    type="button"
                    class="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Check
                  </button>
                  <button
                    @click="raise"
                    type="button"
                    class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    Raise
                  </button>
                  <button
                    @click="fold"
                    type="button"
                    class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Fold
                  </button>
                  <button
                    @click="allIn"
                    type="button"
                    class="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    All In
                  </button>
                </div>
                <div class="log-menu">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Action Log</h3>
                  <ul>
                    <li v-for="(entry, index) in actionLog" :key="index">{{ entry }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="addHand"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save Hand
          </button>
          <button
            @click="startHand"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-orange-500 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Start Hand
          </button>
          <button
            @click="closeModal"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import CardSelection from './CardSelection.vue'
import axios from 'axios'

export default defineComponent({
  name: 'AddHand',
  components: { CardSelection },
  props: {
    isModalOpen: {
      type: Boolean,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const players = ref(9)
    const dealer = ref(1)
    const dealerChipPosition = ref(dealer.value)
    const heroPosition = ref<number | string>(dealer.value)
    const selectedPlayer = ref<number | null>(null)
    const selectedPlayerChips = ref<number>(100)
    const selectedPlayerCard1 = ref<string>('')
    const selectedPlayerCard2 = ref<string>('')
    const card1Selected = ref<boolean>(false)
    const showCardSelection = ref<boolean>(false)
    const selectedCard = ref<'card1' | 'card2' | ''>('')
    const selectedCardValue = ref<string>('')
    const selectedMenu = ref<'settings' | 'chips'>('settings')
    const actionLog = ref<string[]>([])

    const playersPositions = computed(() => {
      const allPositions = ['UTG', 'UTG+1', 'MP1', 'MP2', 'HJ', 'CO']
      const assignedPositions: string[] = new Array(players.value).fill('X')

      // Assign dealer, small blind, and big blind positions
      assignedPositions[(dealer.value - 1 + players.value) % players.value] = 'BTN'
      assignedPositions[dealer.value % players.value] = 'SB'
      assignedPositions[(dealer.value + 1) % players.value] = 'BB'

      // Calculate the number of non-blind positions needed
      const positionsNeeded = players.value - 3

      // Determine the starting index for filling positions from allPositions
      let startIndex = allPositions.length - positionsNeeded

      // Fill the assignedPositions array with values from allPositions
      for (let i = 0; i < positionsNeeded; i++) {
        let positionIndex = (dealer.value + 2 + i) % players.value // Start after BB
        assignedPositions[positionIndex] = allPositions[startIndex + i]
      }

      return assignedPositions
    })

    const visibleSeats = computed(() => {
      const seats = []

      seats.push({
        id: 1,
        style: { top: `${110}%`, left: `${50}%`, transform: 'translate(-50%, -50%)' },
        chips: 100,
        card1: '',
        card2: '',
        position: playersPositions.value[0],
        isPlaying: true,
        isFolded: false
      })

      // Define the positions for other seats around an oval table
      const seatPositions = [
        { top: '5%', left: '50%' }, // Top middle
        { top: '105%', left: '15%' }, // Top right
        { top: '80%', left: '0%' }, // Right middle
        { top: '30%', left: '0%' }, // Bottom right
        { top: '8%', left: '25%' }, // Bottom left
        { top: '8%', left: '75%' }, // Left middle
        { top: '30%', left: '100%' }, // Top left
        { top: '80%', left: '100%' }, // Top right second
        { top: '105%', left: '85%' } // Top left second
      ]

      // Generate coordinates for other players
      for (let i = 1; i < players.value; i++) {
        const posIndex = i < seatPositions.length ? i : seatPositions.length - 1
        const position = seatPositions[posIndex]

        seats.push({
          id: i + 1,
          style: { ...position, transform: 'translate(-50%, -50%)' },
          chips: 100,
          card1: '',
          card2: '',
          position: playersPositions.value[i],
          isPlaying: true,
          isFolded: false
        })
      }

      return seats
    })

    const usedCards = computed(() => {
      return visibleSeats.value.reduce((cards, seat) => {
        if (seat.card1) cards.push(seat.card1)
        if (seat.card2) cards.push(seat.card2)
        return cards
      }, [] as string[])
    })

    const selectPlayer = (playerId: number) => {
      selectedPlayer.value = playerId
      const player = visibleSeats.value.find((seat) => seat.id === playerId)
      if (player) {
        selectedPlayerChips.value = player.chips
        if (playerId === Number(heroPosition.value)) {
          selectedPlayerCard1.value = player.card1
          selectedPlayerCard2.value = player.card2
          card1Selected.value = !!player.card1
          showCardSelection.value = false
          selectedCard.value = ''
        } else {
          selectedPlayerCard1.value = ''
          selectedPlayerCard2.value = ''
          card1Selected.value = false
          showCardSelection.value = false
          selectedCard.value = ''
        }
      }
    }

    const selectCard = (cardType: 'card1' | 'card2') => {
      selectedCard.value = cardType
      selectedCardValue.value = '' // Clear the card value to allow new selection
      showCardSelection.value = true
    }

    const onCardSelected = (card: string) => {
      if (selectedCard.value === 'card1') {
        selectedPlayerCard1.value = card
        card1Selected.value = true
      } else if (selectedCard.value === 'card2') {
        selectedPlayerCard2.value = card
      }
      if (selectedPlayerCard1.value && selectedPlayerCard2.value) {
        showCardSelection.value = false
        selectedCard.value = ''
      }
    }

    const otherCard = computed(() => {
      return selectedCard.value === 'card1' ? selectedPlayerCard2.value : selectedPlayerCard1.value
    })

    const updateChips = () => {
      if (selectedPlayer.value !== null) {
        const player = visibleSeats.value.find((seat) => seat.id === selectedPlayer.value)
        if (player) {
          player.chips = selectedPlayerChips.value
          if (selectedPlayer.value === Number(heroPosition.value)) {
            player.card1 = selectedPlayerCard1.value
            player.card2 = selectedPlayerCard2.value
          }
        }
        selectedPlayer.value = null
        card1Selected.value = false
        showCardSelection.value = false
        selectedCard.value = ''
      }
    }

    const clearSelectedPlayer = () => {
      selectedPlayer.value = null
      selectedPlayerCard1.value = ''
      selectedPlayerCard2.value = ''
      card1Selected.value = false
      showCardSelection.value = false
      selectedCard.value = ''
    }

    const addHand = async () => {
      updateChips()
      const handData = {
        sessionId: props.sessionId,
        players: players.value,
        smallBlind: 1,
        bigBlind: 2,
        dealer: dealer.value,
        hero: heroPosition.value,
        hands: visibleSeats.value.map((seat) => ({
          playerId: seat.id,
          chips: seat.chips,
          card1: seat.card1,
          card2: seat.card2
        }))
      }
      try {
        await axios.post('http://localhost:5000/api/hands', handData, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        })
        closeModal()
      } catch (error) {
        console.error('Error saving hand:', error)
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const showMenu = (menu: 'settings' | 'chips') => {
      selectedMenu.value = menu
    }

    const startHand = () => {
      const nextDealerPosition = (dealerChipPosition.value % players.value) + 1
      dealerChipPosition.value = nextDealerPosition
    }

    const nextPlayer = () => {
      const currentDealerIndex = visibleSeats.value.findIndex(
        (seat) => seat.id === dealerChipPosition.value
      )

      // Find the next player who is still playing
      for (let i = 1; i <= players.value; i++) {
        const nextIndex = (currentDealerIndex + i) % players.value
        if (visibleSeats.value[nextIndex].isPlaying) {
          dealerChipPosition.value = visibleSeats.value[nextIndex].id
          break
        }
      }
    }

    const check = () => {
      const currentPlayer = visibleSeats.value.find((seat) => seat.id === dealer.value)
      if (currentPlayer) {
        actionLog.value.push(`Player ${currentPlayer.id} - check`)
      }
      nextPlayer()
    }

    const fold = () => {
      const currentPlayer = visibleSeats.value.find((seat) => seat.id === dealer.value)
      if (currentPlayer) {
        currentPlayer.isPlaying = false
        currentPlayer.isFolded = true
        actionLog.value.push(`Player ${currentPlayer.id} - fold`)
      }
      nextPlayer()
    }

    const raise = () => {
      // Handle raise logic here
      nextPlayer()
    }

    const allIn = () => {
      // Handle all-in logic here
      nextPlayer()
    }

    return {
      players,
      dealer,
      heroPosition,
      selectedPlayer,
      selectedPlayerChips,
      selectedPlayerCard1,
      selectedPlayerCard2,
      card1Selected,
      showCardSelection,
      selectedCard,
      selectedCardValue,
      addHand,
      closeModal,
      visibleSeats,
      selectPlayer,
      selectCard,
      updateChips,
      clearSelectedPlayer,
      usedCards,
      onCardSelected,
      otherCard,
      selectedMenu,
      showMenu,
      heroPositions: playersPositions,
      startHand,
      check,
      raise,
      allIn,
      fold,
      dealerChipPosition,
      actionLog
    }
  }
})
</script>

<style scoped>
.poker-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px; /* Adjust this value as needed to add space below the table */
}

.poker-table {
  background: #228b22;
  border-radius: 30% / 40%;
  width: 600px;
  height: 350px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 10px solid #333;
}

.poker-seat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.seat-circle {
  background: #2d3748;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.log-menu {
  flex: 1;
  padding: 0px;
}

.hero-seat {
  border: 2px solid yellow;
}

.chip-count,
.position-title {
  background: rgb(122, 177, 232);
  color: black;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 3px;
  margin-top: 2px;
  font-size: 0.8rem;
}

.position-title {
  margin-top: 0;
}

.cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: px;
}

.card-display {
  background: white;
  color: black;
  border: 1px solid black;
  width: 40px;
  height: 60px;
  margin: 2px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 0;
}

.card-placeholder {
  width: 40px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin: 0;
  padding: 0;
}

.flex-1.items-center {
  display: flex;
  gap: 0;
}

.card-title {
  font-size: 1rem;
  color: gray;
}

.selected {
  border-color: blue;
}

.card-selection {
  max-width: 50%;
}

.menu-container {
  display: flex;
  flex-direction: row; /* Ensure the menus are side by side */
  justify-content: space-between;
  margin-top: 20px;
}

.left-menu {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.settings-menu,
.cards-menu {
  flex: 1;
  padding: 0px;
}

.vertical-border {
  border-left: 1px solid lightgray;
  height: auto; /* Adjust this if necessary */
  margin-left: 10px;
  margin-right: 10px;
}

.actions-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 10px;
}

.action-button {
  padding: 5px;
  border-radius: 4px;
  margin: 5px 0;
  font-size: 0.8rem;
  text-align: center;
}

.bg-dark-red {
  background-color: #8b0000; /* Dark red color */
}

.max-w-xs {
  max-width: 5rem;
}

.player1-cards {
  display: flex;
  gap: 0px;
  margin-top: 300px;
}

.folded-seat {
  background: grey;
}

.opponent-cards {
  display: flex;
  flex-direction: row;
  gap: 2px;
}

.card-back {
  width: 40px;
  height: 60px;
  background-position: center;
  border: 1px solid black;
  border-radius: 4px;
  background-image: url('@/assets/card-back.png'); /* Ensure the correct path to the image */
}
</style>
