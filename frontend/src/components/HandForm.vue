<template>
  <div>
    <h2>Enter Poker Hand</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="player">Player:</label>
        <input type="text" id="player" v-model="hand.player" required>
      </div>
      <div>
        <label for="cards">Cards:</label>
        <input type="text" id="cards" v-model="hand.cards" required>
      </div>
      <div>
        <label for="bets">Bets:</label>
        <input type="number" id="bets" v-model="hand.bets" required>
      </div>
      <div>
        <label for="pot">Pot Size:</label>
        <input type="number" id="pot" v-model="hand.pot" required>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HandForm',
  data() {
    return {
      hand: {
        player: '',
        cards: '',
        bets: 0,
        pot: 0,
      },
    };
  },
  methods: {
    submitForm() {
      if (this.validateForm()) {
        this.$emit('hand-submitted', this.hand);
        this.hand = { player: '', cards: '', bets: 0, pot: 0 };
      } else {
        alert('Please fill in all fields with valid data.');
      }
    },
    validateForm() {
      return (
        this.hand.player.trim() &&
        this.hand.cards.trim() &&
        this.hand.bets > 0 &&
        this.hand.pot > 0
      );
    },
  },
};
</script>

<style>
/* Add styles for hand form */
</style>
