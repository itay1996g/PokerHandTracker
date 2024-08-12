<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-semibold mb-4">Dashboard</h1>
    <div class="mb-6">
      <button
        @click="openModal"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Session
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add Session
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="addSession">
                    <div class="mb-4">
                      <label for="gameType" class="block text-gray-700">Game Type:</label>
                      <select
                        id="gameType"
                        v-model="gameType"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Cash">Cash</option>
                        <option value="Tournament">Tournament</option>
                      </select>
                    </div>
                    <div class="mb-4">
                      <label for="date" class="block text-gray-700">Date:</label>
                      <input
                        type="date"
                        id="date"
                        v-model="date"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div class="mb-4">
                      <label for="buyIn" class="block text-gray-700">Buy-In:</label>
                      <input
                        type="number"
                        id="buyIn"
                        v-model.number="buyIn"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div class="mb-4">
                      <label for="cashOut" class="block text-gray-700">Cash-Out:</label>
                      <input
                        type="number"
                        id="cashOut"
                        v-model.number="cashOut"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div class="mb-4">
                      <label for="smallBlind" class="block text-gray-700">Small Blind:</label>
                      <input
                        type="number"
                        id="smallBlind"
                        v-model.number="smallBlind"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div class="mb-4">
                      <label for="bigBlind" class="block text-gray-700">Big Blind:</label>
                      <input
                        type="number"
                        id="bigBlind"
                        v-model.number="bigBlind"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div class="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Save Session
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-semibold mb-4">Sessions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="session in sessions" :key="session._id" class="bg-white p-4 rounded-lg shadow-md relative">
          <button @click="deleteSession(session._id)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-xl font-semibold">{{ session.gameType }} - {{ formatDate(session.date) }}</h3>
          <div class="mt-2">
            <p><strong>Buy-In:</strong> {{ session.buyIn }}</p>
            <p><strong>Cash-Out:</strong> {{ session.cashOut }}</p>
            <p><strong>Small Blind:</strong> {{ session.smallBlind }}</p>
            <p><strong>Big Blind:</strong> {{ session.bigBlind }}</p>
          </div>
          <router-link :to="{ name: 'HandHistory', params: { sessionId: session._id } }" class="text-blue-500 hover:underline mt-4 inline-block">
            View Hand History
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useStore } from '../store/index';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      gameType: 'Cash',
      date: '',
      buyIn: '',
      cashOut: '',
      smallBlind: '1',
      bigBlind: '3',
      sessions: [] as Array<{ _id: string, date: string, gameType: string, buyIn: number, cashOut: number, smallBlind: number, bigBlind: number }>,
      isModalOpen: false,
    };
  },
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  mounted() {
    this.fetchSessions();
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async addSession() {
      try {
        const sessionData: any = {
          gameType: this.gameType,
          date: this.date,
          buyIn: this.buyIn,
          cashOut: this.cashOut,
          smallBlind: this.smallBlind,
          bigBlind: this.bigBlind,
        };

        const response = await axios.post('http://localhost:5000/api/sessions', sessionData, {
          headers: {
            'x-auth-token': this.store.state.token,
          },
        });
        this.sessions.unshift(response.data);
        this.gameType = 'Cash';
        this.date = '';
        this.buyIn = '';
        this.cashOut = '';
        this.smallBlind = '';
        this.bigBlind = '';
        this.closeModal();
      } catch (error) {
        console.error('Error adding session:', error);
      }
    },
    async fetchSessions() {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions', {
          headers: {
            'x-auth-token': this.store.state.token,
          },
        });
        this.sessions = response.data;
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    },
    async deleteSession(sessionId: string) {
      try {
        await axios.delete(`http://localhost:5000/api/sessions/${sessionId}`, {
          headers: {
            'x-auth-token': this.store.state.token,
          },
        });
        this.sessions = this.sessions.filter(session => session._id !== sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    },
    formatDate(date: string) {
      return new Date(date).toLocaleDateString();
    },
  },
});
</script>

<style scoped>
/* Add additional scoped styles here if needed */
</style>
