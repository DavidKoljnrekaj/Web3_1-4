<template>
  <div>
     <!-- Auth Status Section -->
     <div v-if="!isLoggedIn">
      <p>Please login or register to continue.</p>
      <router-link to="/login">
        <button>Login</button>
      </router-link>
      <router-link to="/register">
        <button>Register</button>
      </router-link>
    </div>

    <div v-else>
      <p>Welcome back, {{ username }}!</p>
        <button @click="logout">Logout</button>
    </div>

    <h2>UNO Game Setup</h2>
    <label for="bots">Choose number of bots (1-3):</label>
    <input type="number" id="bots" v-model="state.numberOfBots" min="1" max="3">
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const state = reactive({
  numberOfBots: 1,
});

const router = useRouter();
const isLoggedIn = ref(false);
const username = ref('');

onMounted(() => {
  const token = localStorage.getItem('token');
  const storedUsername = localStorage.getItem('username');

  if (token) {
    isLoggedIn.value = true;
    username.value = storedUsername || 'Player';
  }
});

const startGame = () => {
  if (state.numberOfBots >= 1 && state.numberOfBots <= 3) {
    router.push({ path: '/play-hand', query: { bots: state.numberOfBots } });
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.go(0)
};
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>