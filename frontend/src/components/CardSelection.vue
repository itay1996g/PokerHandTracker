<template>
  <div class="card-selection">
    <div class="suits">
      <span 
        v-for="suit in suits" 
        :key="suit" 
        :class="['suit', { selected: selectedSuit === suit }]" 
        :style="{ color: ['♥', '♦'].includes(suit) ? 'red' : 'black' }" 
        @click="selectSuit(suit)"
      >
        {{ suit }}
      </span>
    </div>
    <div class="ranks">
      <span 
        v-for="rank in ranks" 
        :key="rank" 
        :class="['rank', { selected: selectedRank === rank }]" 
        @click="selectRank(rank)"
      >
        {{ rank }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'CardSelection',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    usedCards: {
      type: Array,
      required: true,
    },
    otherCard: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    const selectedSuit = ref('');
    const selectedRank = ref('');

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        const [suit, rank] = newValue.split('');
        selectedSuit.value = suit;
        selectedRank.value = rank;
      } else {
        selectedSuit.value = '';
        selectedRank.value = '';
      }
    });

    const selectSuit = (suit: string) => {
      selectedSuit.value = suit;
      updateModelValue();
    };

    const selectRank = (rank: string) => {
      selectedRank.value = rank;
      updateModelValue();
    };

    const updateModelValue = () => {
      if (selectedSuit.value && selectedRank.value) {
        emit('update:modelValue', selectedSuit.value + selectedRank.value);
      }
    };

    return {
      suits,
      ranks,
      selectedSuit,
      selectedRank,
      selectSuit,
      selectRank,
    };
  },
});
</script>

<style scoped>
.suits, .ranks {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.suit, .rank {
  cursor: pointer;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.suit.selected, .rank.selected {
  border-color: blue;
}
</style>
