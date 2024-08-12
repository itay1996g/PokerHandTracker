<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-4">Login</h1>
      <form @submit.prevent="loginUser">
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div v-if="errorMessage" class="mb-4 text-red-500">
          {{ errorMessage }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { useStore } from '../store/index'
import { useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')
    const store = useStore()
    const router = useRouter()
    const errorMessage = ref('')

    const loginUser = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth', {
          email: email.value,
          password: password.value
        })
        store.dispatch('login', response.data.token)
        router.push({ name: 'Dashboard' })
      } catch (error) {
        errorMessage.value = 'Invalid email or password. Please try again.'
        console.error('Error logging in:', error)
      }
    }

    return {
      email,
      password,
      loginUser,
      errorMessage
    }
  }
})
</script>
