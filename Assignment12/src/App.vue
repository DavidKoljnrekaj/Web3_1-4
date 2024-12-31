<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router';  // Import Vue Router components

// We use the useRoute function to get information about the current route
const route = useRoute();
</script>

<template>
  <!-- Hide header if we're on the play-hand route -->
  <header v-if="route.path !== '/play-hand'">
    <h1>UNO Game</h1>
    <nav>
      <RouterLink to="/">Game Setup</RouterLink>
      <RouterLink to="/play-hand">Play Game</RouterLink>
      <RouterLink to="/game-over">Game Over</RouterLink>
    </nav>
  </header>

  <!-- This renders the component that matches the current route -->
  <RouterView />
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 20px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

nav a {
  text-decoration: none;
  padding: 10px;
  color: #42b983;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #35495e;
}

</style>

<style>

body {
  background-color: #f0f0f0; /* Light grey background */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

</style>
