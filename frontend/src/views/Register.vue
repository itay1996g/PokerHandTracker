<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Create a New Account</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="name" class="block text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div v-if="errors.name" class="text-red-500 text-sm mt-2">{{ errors.name }}</div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email }}</div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div v-if="errors.password" class="text-red-500 text-sm mt-2">{{ errors.password }}</div>
        </div>
        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Register
        </button>
      </form>
      <p class="text-gray-600 text-center mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useStore } from '../store/index';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      errors: {} as Record<string, string>,
    };
  },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.store.dispatch('login', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.data.errors) {
          error.response.data.errors.forEach((err: { param: string; msg: string }) => {
            this.errors[err.param] = err.msg;
          });
        } else {
          console.error('Error registering:', error);
          alert('Registration failed. Please check your inputs and try again.');
        }
      }
    },
  },
});
</script>

<style scoped>
/* Add additional scoped styles here if needed */
</style>
