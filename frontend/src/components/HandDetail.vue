<script setup lang="ts">

</script>

<template>
    <div>
      <h2>Hand Detail</h2>
      <p>Player: {{ hand.player }}</p>
      <p>Cards: {{ hand.cards }}</p>
      <p>Bets: {{ hand.bets }}</p>
      <p>Pot: {{ hand.pot }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HandDetail',
    props: {
      hand: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style>
  /* Add styles for hand detail */
  </style>
  