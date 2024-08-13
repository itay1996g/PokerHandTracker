<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'

type Street = 'preflop' | 'flop' | 'turn' | 'river'

interface Card {
  suit: string
  value: string
}

const props = defineProps<{
  isModalOpen: boolean
  players: number
  blinds: { small: number; big: number }
  heroPosition: number
}>()

const emit = defineEmits(['close'])
const chips = ref(100)
const activeTab = ref('settings')
const localPlayers = ref(props.players)
const activePlayers = ref(Array.from({ length: props.players }, (_, i) => i + 1))
const betAmounts = ref<{ [key: number]: number }>({})
const actionLog = ref<{ [key: number]: { [key in Street]?: string } }>({})
const playersToActAgain = ref<number[]>([])
const heroCards = ref<{ card1: Card; card2: Card }>({
  card1: { suit: '', value: '' },
  card2: { suit: '', value: '' }
})
const cardSuits = ref<string[]>(['♠', '♥', '♦', '♣'])
const cardValues = ref<string[]>(['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'])
const heroPosition = ref(props.heroPosition)
const playersError = ref<string | null>(null)
const currentPlayer = ref<number | null>(null)
const currentStreet = ref<Street>('preflop')
const lastRaisePlayer = ref<number | null>(null)
const currentSelectedAction = ref<string | null>(null)
const isBetting = ref(false)
const betInputRef = ref<HTMLInputElement | null>(null)
const selectedSuit = ref()
const suits = ref([
  { name: '♣', code: 'club' },
  { name: '♥', code: 'heart' },
  { name: '♠', code: 'spade' },
  { name: '♦', code: 'diamond' }
])

const potSize = computed(() => {
  return Object.values(betAmounts.value).reduce((acc, bet) => acc + (bet || 0), 0)
})

const seatPositions = computed(() => {
  const allPositions = ['UTG', 'UTG+1', 'MP1', 'MP2', 'HJ', 'CO']
  const assignedPositions: string[] = new Array(localPlayers.value).fill('X')

  assignedPositions[0] = 'BTN'
  assignedPositions[1] = 'SB'
  assignedPositions[2] = 'BB'

  const positionsNeeded = localPlayers.value - 3
  let startIndex = allPositions.length - positionsNeeded

  for (let i = 0; i < positionsNeeded; i++) {
    let positionIndex = 3 + i
    assignedPositions[positionIndex] = allPositions[startIndex + i]
  }

  return assignedPositions
})

const updatePlayers = () => {
  if (localPlayers.value < 2 || localPlayers.value > 9) {
    playersError.value = 'Number of players must be between 2 and 9'
    return
  } else {
    playersError.value = null
  }

  const newActivePlayers = Array.from({ length: localPlayers.value }, (_, i) => i + 1)
  newActivePlayers.forEach((playerId) => {
    if (!actionLog.value[playerId]) {
      actionLog.value[playerId] = {
        preflop: '',
        flop: '',
        turn: '',
        river: ''
      }
    }
  })
  activePlayers.value = newActivePlayers

  if (localPlayers.value >= 2) {
    betAmounts.value[2] = props.blinds.small
    betAmounts.value[3] = props.blinds.big
  }

  if (heroPosition.value && heroPosition.value > newActivePlayers.length) {
    heroPosition.value = 1
  }
  currentPlayer.value = newActivePlayers[3 % newActivePlayers.length]
}

watch(
  () => localPlayers.value,
  (newPlayers) => {
    updatePlayers()
  },
  { immediate: true }
)

const selectAction = (action: string) => {
  if (currentPlayer.value !== null) {
    currentSelectedAction.value = action
    recordAction(currentPlayer.value, action) // Record the action immediately
    onActionChange(currentPlayer.value, getCurrentStreet()) // Trigger the action change
  }
}

const recordAction = (playerId: number, action: string) => {
  if (!actionLog.value[playerId]) {
    actionLog.value[playerId] = {}
  }
  const street = getCurrentStreet()
  actionLog.value[playerId][street] = action

  if (action === 'raise') {
    lastRaisePlayer.value = playerId
    playersToActAgain.value = activePlayers.value.filter(
      (id) => id !== playerId && !isPlayerFolded(id)
    )
  }

  if (action === 'call') {
    // Determine the amount to call based on the last raise or the BB
    let lastBetAmount = 0
    if (lastRaisePlayer.value !== null) {
      lastBetAmount = betAmounts.value[lastRaisePlayer.value] || 0
    } else {
      // After BB has acted
      lastBetAmount = props.blinds.big
    }
    betAmounts.value[playerId] = lastBetAmount
  }

  // Only remove a player from playersToActAgain if they've folded
  if (action === 'fold') {
    playersToActAgain.value = playersToActAgain.value.filter((id) => id !== playerId)
  }

  // If no one else needs to act again, clear the list
  if (playersToActAgain.value.length === 0) {
    lastRaisePlayer.value = null
    playersToActAgain.value = []
  }
}

const showBetAmount = (playerId: number, action: string) => {
  return action === 'raise'
}

const getCurrentStreet = (): Street => {
  return currentStreet.value
}

const nextPlayer = () => {
  const activePlayersInGame = activePlayers.value.filter((playerId) => !isPlayerFolded(playerId))

  if (activePlayersInGame.length <= 1) {
    console.log('End of game')
    return
  }

  console.log('currentPlayer:', currentPlayer.value)
  console.log('playersToActAgain:', playersToActAgain.value)

  if (playersToActAgain.value.length > 0) {
    // Find the current player's index in the activePlayersInGame array
    const currentPlayerIndex = activePlayersInGame.indexOf(currentPlayer.value!)

    // Find the next player to act in the playersToActAgain array, wrapping around if necessary
    let nextPlayerToAct: number = 0
    for (let i = 1; i < activePlayersInGame.length; i++) {
      const nextIndex = (currentPlayerIndex + i) % activePlayersInGame.length
      const candidatePlayer = activePlayersInGame[nextIndex]
      if (playersToActAgain.value.includes(candidatePlayer)) {
        nextPlayerToAct = candidatePlayer
        break
      }
    }

    if (nextPlayerToAct !== undefined) {
      console.log('Next player to act:', nextPlayerToAct)
      currentPlayer.value = nextPlayerToAct
      playersToActAgain.value = playersToActAgain.value.filter((id) => id !== nextPlayerToAct)
      console.log('Current Player:', currentPlayer.value)
      return
    } else {
      moveToNextStreet()
      return
    }
  }

  const currentIndex = activePlayersInGame.indexOf(currentPlayer.value!)

  if (currentIndex === -1) {
    const previousIndex = activePlayers.value.indexOf(currentPlayer.value!)
    const nextIndex = (previousIndex + 1) % activePlayers.value.length

    currentPlayer.value = activePlayers.value[nextIndex]
    while (isPlayerFolded(currentPlayer.value)) {
      currentPlayer.value = activePlayers.value[(nextIndex + 1) % activePlayers.value.length]
    }
  } else {
    let nextIndex = (currentIndex + 1) % activePlayersInGame.length
    currentPlayer.value = activePlayersInGame[nextIndex]
  }

  console.log('Next Player Set To:', currentPlayer.value)
  if (currentPlayer.value === lastRaisePlayer.value) {
    moveToNextStreet()
  }
}

const moveToNextStreet = () => {
  switch (currentStreet.value) {
    case 'preflop':
      currentStreet.value = 'flop'
      break
    case 'flop':
      currentStreet.value = 'turn'
      break
    case 'turn':
      currentStreet.value = 'river'
      break
    case 'river':
      return
  }

  const activePlayersInGame = activePlayers.value.filter((playerId) => !isPlayerFolded(playerId))

  if (activePlayersInGame.length <= 1) {
    return
  }

  switch (currentStreet.value) {
    case 'flop':
    case 'turn':
    case 'river':
      const btnIndex = activePlayersInGame.indexOf(1) // Assuming player 1 is BTN
      if (btnIndex === -1) {
        currentPlayer.value = activePlayersInGame[0] // Fallback to first active player
      } else {
        currentPlayer.value = activePlayersInGame[(btnIndex + 1) % activePlayersInGame.length]
      }
      break
  }
}

const isPlayerFolded = (playerId: number) => {
  return (
    actionLog.value[playerId]?.preflop === 'fold' ||
    actionLog.value[playerId]?.flop === 'fold' ||
    actionLog.value[playerId]?.turn === 'fold' ||
    actionLog.value[playerId]?.river === 'fold'
  )
}

const onActionChange = (playerId: number, street: Street) => {
  const action = actionLog.value[playerId][street] as string

  recordAction(playerId, action)

  if (action === 'raise') {
    isBetting.value = true

    currentPlayer.value = playerId
    return
  } else {
    isBetting.value = false
  }

  const activePlayersInGame = activePlayers.value.filter((playerId) => !isPlayerFolded(playerId))
  const allActionsCompleted = activePlayersInGame.every((playerId) => {
    const action = actionLog.value[playerId][street]
    return action === 'call' || action === 'fold' || action === 'check'
  })

  if (allActionsCompleted) {
    moveToNextStreet()
  } else {
    nextPlayer()
  }
  currentSelectedAction.value = null
}

const onBetAmountChange = (playerId: number) => {
  const amount = betAmounts.value[playerId]

  console.log(`Player ${playerId} entered a bet amount: ${amount}`)
  if (amount > 0) {
    isBetting.value = false
    recordAction(playerId, 'raise')

    nextPlayer()
  }
}

const saveHand = () => {
  closeModal()
}

const closeModal = () => {
  emit('close')
}

const getActionLog = (playerId: number) => {
  if (!actionLog.value[playerId]) {
    actionLog.value[playerId] = {
      preflop: '',
      flop: '',
      turn: '',
      river: ''
    }
  }
  return actionLog.value[playerId]
}

const availableStreets = computed(() => {
  const streets: Street[] = ['preflop']
  if (currentStreet.value !== 'preflop') {
    streets.push('flop')
  }
  if (currentStreet.value === 'turn' || currentStreet.value === 'river') {
    streets.push('turn')
  }
  if (currentStreet.value === 'river') {
    streets.push('river')
  }
  return streets
})
</script>

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
      <div class="modal-container">
        <div class="modal-layout">
          <div class="header-buttons">
            <div
              :class="['nav-item', { 'nav-item-active': activeTab === 'settings' }]"
              @click="activeTab = 'settings'"
            >
              Settings
            </div>
            <div
              :class="['nav-item', { 'nav-item-active': activeTab === 'hand' }]"
              @click="activeTab = 'hand'"
            >
              Hand
            </div>
          </div>
          <div>
            <div v-if="activeTab === 'settings'" class="fieldset">
              <!-- Existing settings inputs -->
              <div class="mb-4">
                <label for="players" class="block text-gray-700 font-semibold mb-2"
                  >Number of Players:</label
                >
                <input
                  type="number"
                  id="players"
                  v-model.number="localPlayers"
                  @change="updatePlayers"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2"
                  max="9"
                />
                <span v-if="playersError" class="text-red-500 text-sm">{{ playersError }}</span>
              </div>
              <div class="mb-4">
                <label for="chips" class="block text-gray-700 font-semibold mb-2"
                  >Amount of Chips:</label
                >
                <input
                  type="number"
                  id="chips"
                  v-model.number="chips"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label for="small-blind" class="block text-gray-700 font-semibold mb-2"
                  >Small Blind:</label
                >
                <input
                  type="number"
                  id="small-blind"
                  v-model.number="blinds.small"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label for="big-blind" class="block text-gray-700 font-semibold mb-2"
                  >Big Blind:</label
                >
                <input
                  type="number"
                  id="big-blind"
                  v-model.number="blinds.big"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label for="heroPosition" class="block text-gray-700 font-semibold mb-2"
                  >Hero Position:</label
                >
                <select
                  id="heroPosition"
                  v-model="heroPosition"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option
                    v-for="(position, index) in seatPositions"
                    :key="index"
                    :value="index + 1"
                  >
                    {{ position }}
                  </option>
                </select>
              </div>
              <!-- Card selection inputs for hero -->
              <div v-if="heroPosition" class="mb-4">
                <label for="hero-card1-suit" class="block text-gray-700 font-semibold mb-2"
                  >Hero Card 1:</label
                >
                <div class="flex gap-2">
                  <select
                    id="hero-card1-suit"
                    v-model="heroCards.card1.suit"
                    class="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 card-suit"
                  >
                    <option
                      v-for="suit in cardSuits"
                      :key="suit"
                      :value="suit"
                      :class="{ 'red-suit': suit === '♥' || suit === '♦' }"
                    >
                      {{ suit }}
                    </option>
                  </select>
                  <select
                    id="hero-card1-value"
                    v-model="heroCards.card1.value"
                    class="w-2/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option v-for="value in cardValues" :key="value" :value="value">
                      {{ value }}
                    </option>
                  </select>
                </div>
                <label for="hero-card2-suit" class="block text-gray-700 font-semibold mb-2"
                  >Hero Card 2:</label
                >
                <div class="flex gap-2">
                  <select
                    id="hero-card2-suit"
                    v-model="heroCards.card2.suit"
                    class="w-1/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 card-suit"
                  >
                    <option
                      v-for="suit in cardSuits"
                      :key="suit"
                      :value="suit"
                      :class="{ 'red-suit': suit === '♥' || suit === '♦' }"
                    >
                      {{ suit }}
                    </option>
                  </select>
                  <select
                    id="hero-card2-value"
                    v-model="heroCards.card2.value"
                    class="w-2/3 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option v-for="value in cardValues" :key="value" :value="value">
                      {{ value }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'hand'" class="fieldset">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3"></th>
                    <th
                      v-for="street in availableStreets"
                      :key="street"
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      :class="{ 'bg-yellow-200': currentStreet === street }"
                    >
                      {{ street }}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bet-size-column"
                    >
                      Bet Size
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(playerId, index) in activePlayers"
                    :key="playerId"
                    :class="[
                      'player-row',
                      {
                        'bg-green-100': playerId === currentPlayer
                      }
                    ]"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ playerId }} <span v-if="playerId === heroPosition">(Hero)</span> -
                      {{ seatPositions[index] }}
                    </td>
                    <td
                      v-for="street in availableStreets"
                      :key="street"
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ getActionLog(playerId)[street] }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bet-size-column">
                      <input
                        type="number"
                        v-model="betAmounts[playerId]"
                        class="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref="betInputRef"
                        @change="onBetAmountChange(playerId)"
                        @keydown.enter="onBetAmountChange(playerId)"
                        :disabled="
                          !showBetAmount(playerId, getActionLog(playerId)[getCurrentStreet()] || '')
                        "
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Action Buttons -->
              <div class="action-buttons mb-4">
                <Button
                  :class="[
                    'action-button fold-button',
                    { selected: currentSelectedAction === 'fold' }
                  ]"
                  @click="selectAction('fold')"
                  :disabled="isBetting"
                >
                  Fold
                </Button>
                <Button
                  :class="['action-button', { selected: currentSelectedAction === 'check' }]"
                  @click="selectAction('check')"
                  :disabled="isBetting"
                >
                  Check
                </Button>
                <Button
                  :class="['action-button', { selected: currentSelectedAction === 'call' }]"
                  @click="selectAction('call')"
                  :disabled="isBetting"
                >
                  Call
                </Button>
                <Button
                  :class="['action-button', { selected: currentSelectedAction === 'raise' }]"
                  @click="selectAction('raise')"
                  :disabled="isBetting"
                >
                  Raise
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="pot-size-display mt-4 text-right font-semibold">
            Current Pot: {{ potSize }}
          </div>
          <Button @click="saveHand" severity="info" rounded> Save Hand </Button>
          <Button @click="closeModal" severity="danger" rounded> Cancel </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  background-color: #ccc;
  color: #666;
  border: 1px solid #999; /* Border color similar to background */
  cursor: not-allowed; /* Not allowed cursor */
  opacity: 0.6; /* Slightly transparent */
}

button:disabled:hover {
  background-color: #ccc;
  color: #666;
  border: 1px solid #999;
}

.pot-size-display {
  padding: 1rem;
  color: #333;
}

.red-suit {
  color: red;
}

.card-suit {
  width: 60px;
}

.bg-yellow-100 {
  background-color: #fefcbf;
}

.bet-size-column {
  width: 120px;
}

.flex {
  display: flex;
}

.w-1\/4 {
  width: 25%;
}

.w-3\/4 {
  width: 75%;
}

.border-r {
  border-right: 1px solid #ddd;
}

.p-2 {
  padding: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-gray-200:hover {
  background-color: #e2e8f0;
}

.transition {
  transition: background-color 0.3s;
}

.bg-gray-200 {
  background-color: #e2e8f0;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.text-white {
  color: #fff;
}

.text-gray-700 {
  color: #4a5568;
}

.inline-block {
  display: inline-block;
}

.w-full {
  width: 100%;
}

.text-center {
  text-align: center;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.nav-item {
  padding: 1rem;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.nav-item-active {
  background-color: #4299e1;
  color: #fff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.bg-yellow-200 {
  background-color: #fef08a;
}

.bg-green-100 {
  background-color: #d1fae5;
}

.text-red-500 {
  color: #f56565;
}

.text-sm {
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  padding: 1rem;
  gap: 10px;
  border-top: 1px solid #ddd;
}

.action-button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.action-button.selected {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.action-button:hover {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
}

.modal-layout {
  display: flex;
  flex-direction: column;
}

.header-buttons {
  display: flex;
  width: 100%;
}

.modal-container {
  display: inline-block;
  vertical-align: bottom;
  background-color: white;
  border-radius: 0.5rem; /* rounded-lg */
  text-align: left;
  overflow: hidden;
  box-shadow:
    0px 10px 15px rgba(0, 0, 0, 0.1),
    0px 4px 6px rgba(0, 0, 0, 0.05); /* shadow-xl */
  transform: translateY(0); /* To mimic transform behavior */
  transition: all 0.3s ease-in-out; /* transition-all */
  margin-top: 2rem; /* sm:my-8 */
  margin-bottom: 2rem; /* sm:my-8 */
  width: 100%; /* sm:w-full */
  max-width: 100%; /* sm:max-w-4xl if used, adapt accordingly */
}

.fieldset {
  margin: 20px;
}
</style>
