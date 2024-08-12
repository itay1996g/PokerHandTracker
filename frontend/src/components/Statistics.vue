<template>
  <div>
    <h2>Statistics</h2>
    <p>Average Pot Size: {{ averagePot }}</p>
    <p>Total Hands: {{ totalHands }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Hand } from '@/types/hand';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Statistics',
  props: {
    hands: {
      type: Array as () => Hand[],
      required: true,
    },
  },
  setup(props) {
    const totalHands = computed(() => props.hands.length);

    const averagePot = computed(() => {
      if (props.hands.length === 0) return 0;
      const totalPot = props.hands.reduce((sum, hand) => sum + hand.pot, 0);
      return totalPot / props.hands.length;
    });

    return {
      totalHands,
      averagePot,
    };
  },
});
</script>

<style scoped>
/* Add styles for statistics */
</style>
