import { createRouter, createWebHistory } from 'vue-router';
import GameSetupScreen from '../components/GameSetupScreen.vue';
import OneHandScreen from '../components/OneHandScreen.vue';
import GameOverScreen from '../components/GameOverScreen.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import FindGameScreen from '../components/FindGameScreen.vue';
import StartGameScreen from '../components/StartGameScreen.vue';
import OnlineHandScreen from '@/components/OnlineHandScreen.vue';

const routes = [
  { path: '/', component: GameSetupScreen },
  { path: '/play-hand', component: OneHandScreen },
  { path: '/game-over', component: GameOverScreen },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/find-game', component: FindGameScreen },
  { path: '/start-game/:gameId', component: StartGameScreen },
  { path: '/start-game', component: StartGameScreen },
  { path: '/online-hand/:gameId', component: OnlineHandScreen}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
