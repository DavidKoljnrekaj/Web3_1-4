<template>
  <h1>{{ name }}</h1>
  <div :class="['deck', isVertical ? 'vertical' : '']">
    <!-- Loop through the deck array and render a card for each -->
    <UNOCard 
      v-for="(card, index) in playerHand" 
      :key="index" 
      :card="card" 
      :isVertical= "isVertical"
      :isBotCard= "isBotCard" 
      @click="() => playCard?.(index, undefined)" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import UNOCard from './UnoCard.vue';
import type { ICard } from '../interfaces/IDeck';


export default defineComponent({
  name: 'HandMrs',
  components: {
    UNOCard,
  },
  props: {
    playerHand: {
      type: Array as () => ICard[],
      required: false,
    },
    position: {
      type: Number,
      default: false,
    },
    playCard: {
      type: Function,
      required: false,  // Ensure the playCard method is passed in
    },
    isBotCard: {
        type: Boolean,
        default: false,
    },
    name: {
      type: String,
      default: false
    }
  },
  setup(props) {
    // Determine if the layout should be vertical based on position
    const isVertical = computed(() => props.position === 2 || props.position === 4);
    return {
      isVertical,
    };
  },
});

</script>

<style scoped>
.deck {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vertical {
  flex-direction: column;
  align-items: center;
}

.vertical .UNOCard {
  margin-bottom: -20px;
  transform: rotate(90deg);
  transform-origin: center center;
}
</style>
