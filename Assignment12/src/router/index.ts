import { createRouter, createWebHistory } from 'vue-router';
import GameSetupScreen from '../components/GameSetupScreen.vue';
import OneHandScreen from '../components/OneHandScreen.vue';
import GameOverScreen from '../components/GameOverScreen.vue';

const routes = [
  { path: '/', component: GameSetupScreen },
  { path: '/play-hand', component: OneHandScreen },
  { path: '/game-over', component: GameOverScreen }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
