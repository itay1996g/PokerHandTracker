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
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                General Hand Configuration
              </h3>
              <div class="mt-2">
                <div class="flex flex-col space-y-4">
                  <div>
                    <label for="players" class="block text-gray-700">Number of Players</label>
                    <input
                      type="number"
                      id="players"
                      v-model.number="players"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label for="chips" class="block text-gray-700">Amount of Chips</label>
                    <input
                      type="number"
                      id="chips"
                      v-model.number="chips"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label for="small-blind" class="block text-gray-700">Small Blind</label>
                    <input
                      type="number"
                      id="small-blind"
                      v-model.number="blinds.small"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label for="big-blind" class="block text-gray-700">Big Blind</label>
                    <input
                      type="number"
                      id="big-blind"
                      v-model.number="blinds.big"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="proceed"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Continue
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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GeneralHandConfig',
  props: {
    isModalOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const players = ref(0)
    const chips = ref(0)
    const blinds = ref({ small: 0, big: 0 })

    const proceed = () => {
      emit('proceed', { players: players.value, chips: chips.value, blinds: blinds.value })
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      players,
      chips,
      blinds,
      proceed,
      closeModal
    }
  }
})
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
