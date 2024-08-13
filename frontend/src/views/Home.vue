<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gray-800 text-white p-4">
      <h1 class="text-3xl font-bold text-center">Poker Hand Tracker</h1>
    </header>
    <main class="flex-grow flex items-center justify-center bg-gray-100 p-6">
      <div class="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Welcome to Poker Hand Tracker</h2>
        <p class="text-gray-600 mb-6">
          Track and analyze your poker hands efficiently with our easy-to-use tool. Sign up or log
          in to start tracking your hands today.
        </p>
        <div class="flex space-x-4">
          <router-link
            to="/login"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >Login</router-link
          >
          <router-link
            to="/register"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >Register</router-link
          >
          <router-link
            to="/statistics"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >Stats Calculator</router-link
          >
        </div>
      </div>
    </main>
    <footer class="bg-gray-800 text-white text-center p-4">
      &copy; 2024 Poker Hand Tracker. All rights reserved.
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home'
})
</script>

<style scoped>
/* Add additional scoped styles here if needed */
</style>
