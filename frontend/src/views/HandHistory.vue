<template>
  <div class="hand-history">
    <div class="mb-6">
      <button
        @click="openModal"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Quick Hand
      </button>
    </div>
    <AddQuickHand
      :isModalOpen="isModalOpen"
      @close="closeModal"
      :players="players"
      :chips="chips"
      :blinds="blinds"
      :heroPosition="heroPosition"
    />
    <!-- Render hand history here -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddQuickHand from '@/components/AddQuickHand.vue'

const route = useRoute()
const sessionId = route.params.sessionId as string
const isModalOpen = ref(false)
const players = ref(6)
const chips = ref(100)
const blinds = ref({ small: 1, big: 3 })
const heroPosition = ref(2)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveHand = async (handData: any) => {
  // Logic to save hand data goes here
  closeModal()
}
</script>

<style scoped>
.hand-history {
  padding: 20px;
}
</style>
