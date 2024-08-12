<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts">
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    
  },
};
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<style>
/* Add global styles here */
</style>
