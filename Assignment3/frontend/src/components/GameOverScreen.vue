<template>
  <div>
    <h2>UNO Game Setup</h2>
    <label for="bots">Choose number of bots (1-3):</label>
    <input type="number" id="bots" v-model="state.numberOfBots" min="1" max="3">
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const state = reactive({
  numberOfBots: 1,
});

const router = useRouter();

const startGame = () => {
  if (state.numberOfBots >= 1 && state.numberOfBots <= 3) {
    router.push({ path: '/play-hand', query: { bots: state.numberOfBots } });
  }
};
</script>
