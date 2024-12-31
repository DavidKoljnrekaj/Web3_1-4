<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <span v-if="playerHand?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="playerHand" :playerHand="playerHand?.getCards()" :name=playerHand.getName() :position="1" :playCard="playCard" />
    </div>

    <!-- Bot Areas -->
    <!-- For 1 Bot: Place on Top -->
    <div v-if="numberOfBots === 1" class="bot-area top centered">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[0]" :playerHand="botHands[0].getCards()" :name=botHands[0].getName() :position="3" :isBotCard="true" />
    </div>

    <!-- For 2 Bots: Place First Bot on Left, Second Bot on Top -->
    <div v-if="numberOfBots === 2" class="bot-area left">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[0]" :playerHand="botHands[0].getCards()" :name=botHands[0].getName() :position="2" :isBotCard="true" />
    </div>
    <div v-if="numberOfBots === 2" class="bot-area top centered">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[1]" :playerHand="botHands[1].getCards()" :name=botHands[1].getName() :position="3" :isBotCard="true" />
    </div>

    <!-- For 3 Bots: Place First Bot on Left, Second Bot on Top, Third Bot on Right -->
    <div v-if="numberOfBots === 3" class="bot-area left">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[0]" :playerHand="botHands[0].getCards()" :name=botHands[0].getName() :position="2":isBotCard="false" />
    </div>
    <div v-if="numberOfBots === 3" class="bot-area top centered">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[1]" :playerHand="botHands[1].getCards()" :name=botHands[1].getName() :position="3" :isBotCard="false" />
    </div>
    <div v-if="numberOfBots === 3" class="bot-area right">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent v-if="botHands[2]" :playerHand="botHands[2].getCards()" :name=botHands[2].getName() :position="4" :isBotCard="false" />
    </div>

    <!-- Discard Pile (Center) -->
    <div class="discard-pile">
      <UNOCard v-if="discardPile.length > 0" :card="discardPile[discardPile.length - 1]" />
    </div>

    <!-- Draw Card Button (Center) -->
    <div class="draw-card-button">
      <button v-if="!hasPlayed" @click="drawCard" class="action-button" :disabled="gameOver">Draw Card</button>
      <button @click="calloutUno" class="action-button" :disabled="gameOver">Callout</button>
      <button @click="endTurn" class="action-button" :disabled="gameOver">End Turn</button>
      <button @click="sayUno" class="action-button" :disabled="gameOver">Say UNO</button>
    </div>

    <div v-if="showColorPicker" class="color-picker-overlay">
      <h3>Select a color for your Wild card</h3>
      <button @click="chooseColor('RED')">Red</button>
      <button @click="chooseColor('BLUE')">Blue</button>
      <button @click="chooseColor('GREEN')">Green</button>
      <button @click="chooseColor('YELLOW')">Yellow</button>
    </div>
    <EndHandScreen
      v-if="showEndHandScreen"
      :winner="winner"
      :score="handScore"
      :leaderboard="leaderboard"
      :hasEnded="game.hasEnded"
      @play-next-hand="startNewHand"
      @end-game = "endGame"
    />
  </div>

</template>


<script setup lang="ts">

import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Game } from '../Classes/Game';
import { Hand } from '../Classes/Hand';
import { PlayerHand } from '../Classes/PlayerHand';
import UNOCard from './UnoCard.vue';
import HandComponent from './Hand.vue'; // Renaming to avoid conflict with `Hand` class
import { SimpleBot } from '../Classes/SimpleBot';
import type { ICard } from '@/interfaces/IDeck';
import EndHandScreen from './EndHandScreen.vue';


// Props
const router = useRouter();
const route = useRoute();
const bots = route.query.bots
  ? Array.isArray(route.query.bots)
    ? parseInt(route.query.bots[0] ?? "0", 10)
    : parseInt(route.query.bots ?? "0", 10) 
  : 0;


const numberOfBots = parseInt(route.query.bots as string);
const playerName = ref('Player');
const botNames = ref(['Bot 1', 'Bot 2', 'Bot 3']); 
const discardPile = ref<ICard[]>([]);
const playerHand = ref<PlayerHand | null>(null);
const gameOver = ref(false);
const currentHand = ref<Hand | null>(null);
const game = ref(new Game(playerName.value, bots));
const botHands = ref<SimpleBot[]>([]);
const showColorPicker = ref(false);
const showEndHandScreen = ref(false);
const winner = ref('');
const handScore = ref(0);
const leaderboard = ref<{ [player: string]: number }>({});

let hasPlayed: boolean = false;
let chosenCard: number;
let saidUno: boolean;

// Computed properties for top card and bot areas based on the number of bots
const topCard = computed(() => discardPile.value[discardPile.value.length - 1]);

// Functions

function startNewHand() {
  //console.log("function startNewHand() oneHandScreen");
  showEndHandScreen.value = false; 
  const hand = game.value.startNewHand();
  currentHand.value = hand as Hand;
  playerHand.value = hand.player;
  discardPile.value = [hand.getTopCard()];
  botNames.value = game.value.getBotNames();
  console.log(currentHand.value?.currentPlayer)
}


 function playCard(cardIndex: number) {
  if(hasPlayed)
  {
    return;
  }
  if (currentHand.value?.currentPlayer !== "Player" ) 
  {return;}
  const selectedCard = currentHand.value?.player.getCards()[cardIndex];
  if (selectedCard && selectedCard.color === 'BLACK' && 
      (selectedCard.type === 'WILD' || selectedCard.type === 'DRAW4')) {
    showColorPicker.value = true;
    chosenCard = cardIndex;
  } else {
    processCardPlay(cardIndex);
  }
}

// Function to play a card
function processCardPlay(cardIndex: number, chosenColor?: string) {
  //console.log("function playCard() oneHandScreen");
  console.log("i played a " + currentHand.value?.player.getCards()[cardIndex].color + " " + currentHand.value?.player.getCards()[cardIndex].type)
  if (currentHand.value) {
    if (currentHand.value.play(currentHand.value.player.getCards()[cardIndex], chosenColor)) {
      hasPlayed = true;
    } else {
      console.warn("Invalid card play");
    }
  }
  
  chosenCard = 0;
}

function chooseColor(color: string) {
  showColorPicker.value = false;

  if (chosenCard >= 0) {
    processCardPlay(chosenCard, color);
  }
}

function calloutUno(){
  if(currentHand)
{currentHand.value?.calloutUno();}
}


// Function to draw a card
function drawCard() {
  if(hasPlayed)
  {
    return;
  }
  else 
  {
    hasPlayed = true;
  }
  //console.log("function drawCard() oneHandScreen");
  if (currentHand.value) {
    currentHand.value.drawCard();
  }
}

function endTurn() {
  if(!hasPlayed)
    {return;}
  if (currentHand.value) {
    currentHand.value.endTurn(saidUno);
    console.log("Turn ended.");
  }
}

// Function to declare UNO
function sayUno() {
  if (currentHand.value && currentHand.value.player.getCards().length === 1) {
    console.log("Player says UNO!");
    saidUno = true;
  } else {
    console.warn("Cannot say UNO unless you have only one card left!");
  }
}

function endHand() {
  if(currentHand.value?.winner){
  winner.value = currentHand.value?.winner;
  handScore.value = currentHand.value?.getWinnerScore();}
  leaderboard.value = Object.fromEntries(game.value.getScores());
  showEndHandScreen.value = true;
}

function endGame() {
  router.push({ path: '/'});
}

watch(currentHand, (newHand) => {
  if (newHand) {
    playerHand.value = newHand.player;
    if (newHand.getTopCard) {
      discardPile.value = [newHand.getTopCard()];
    }
    botHands.value = Array.from(newHand.getBots().values());
    if (currentHand.value?.hasEnded) {
      endHand()
    }
  }
}, { deep: true, immediate: true });

watch(() => currentHand.value?.currentPlayer, (newPlayer, oldPlayer) => {
  if (oldPlayer !== "Player" && newPlayer === "Player") {
    saidUno = false;
    hasPlayed = false;
  }
});


// Initialize the game on mount
onMounted(() => {
  startNewHand();
});

</script>

<style scoped>
/* Centered draw card button but moved slightly to the right */
.draw-card-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* Add spacing between the buttons */
  position: absolute;
  top: 50%;
  left: 60%; /* Adjust this value to move it left or right */
  transform: translate(-50%, -50%);
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}



.game-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}
  
.player-area, .bot-area.top.centered {
  width: 60%;
  margin: 0 auto;
  text-align: center;
}

/* Player Area (Bottom) */
.player-area {
  position: absolute;
  bottom: 20px;
}

/* Bot 1 (Top) */
.bot-area.top.centered {
  position: absolute;
  top: 20px;
}

/* Bot 2 (Left, Vertical) */
.bot-area.left {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

/* Bot 3 (Right, Vertical) */
.bot-area.right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

/* Discard Pile (Center) */
.discard-pile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.color-picker-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 2px solid black;
  z-index: 1000;
  text-align: center;
}
.color-picker-overlay button {
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
}
.uno-indicator {
  font-size: 1.5rem;
  font-weight: bold;
  color: red;
  margin-left: 10px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}


</style>
