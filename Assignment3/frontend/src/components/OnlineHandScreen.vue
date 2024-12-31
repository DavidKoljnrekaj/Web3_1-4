<template>
  <div class="game-container">
    <!-- Player Area (Bottom) -->
    <div class="player-area">
      <span v-if="playerHand?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="playerHand"
        :playerHand="playerHand.cards"
        :name="playerHand.username"
        :position="1"
        :playCard="playCard"
      />
    </div>

    <!-- Bot Areas -->
    <!-- For 1 Bot: Place on Top -->
    <div v-if="botHands.length === 1" class="bot-area top centered">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[0]"
        :playerHand="botHands[0].cards"
        :name="botHands[0].username"
        :position="3"
        :isBotCard="true"
      />
    </div>

    <!-- For 2 Bots: Place First Bot on Left, Second Bot on Top -->
    <div v-if="botHands.length === 2" class="bot-area left">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[0]"
        :playerHand="botHands[0].cards"
        :name="botHands[0].username"
        :position="2"
        :isBotCard="true"
      />
    </div>
    <div v-if="botHands.length === 2" class="bot-area top centered">
      <span v-if="botHands[1]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[1]"
        :playerHand="botHands[1].cards"
        :name="botHands[1].username"
        :position="3"
        :isBotCard="true"
      />
    </div>

    <!-- For 3 Bots: Place First Bot on Left, Second Bot on Top, Third Bot on Right -->
    <div v-if="botHands.length === 3" class="bot-area left">
      <span v-if="botHands[0]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[0]"
        :playerHand="botHands[0].cards"
        :name="botHands[0].username"
        :position="2"
        :isBotCard="true"
      />
    </div>
    <div v-if="botHands.length === 3" class="bot-area top centered">
      <span v-if="botHands[1]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[1]"
        :playerHand="botHands[1].cards"
        :name="botHands[1].username"
        :position="3"
        :isBotCard="true"
      />
    </div>
    <div v-if="botHands.length === 3" class="bot-area right">
      <span v-if="botHands[2]?.hasSaidUno" class="uno-indicator">UNO!</span>
      <HandComponent
        v-if="botHands[2]"
        :playerHand="botHands[2].cards"
        :name="botHands[2].username"
        :position="4"
        :isBotCard="true"
      />
    </div>

    <!-- Discard Pile (Center) -->
    <div class="discard-pile">
      <UNOCard v-if="topCard" :card="topCard" />
    </div>

    <!-- Draw Card Button (Center) -->
    <div class="draw-card-button">
      <button @click="drawCard" class="action-button" :disabled="!isYourTurn || hasPlayed">Draw Card</button>
      <button @click="endTurn" class="action-button" :disabled="!isYourTurn || !hasPlayed">End Turn</button>
      <button @click="sayUno" class="action-button" :disabled="!isYourTurn || !hasPlayed || hasSaidUno">Say UNO!</button>
      <button @click="calloutUno" class="action-button" :disabled="!isYourTurn">Callout UNO</button>
    </div>
    <!-- Color Picker Overlay -->
    <div v-if="showColorPicker" class="color-picker-overlay">
      <h3>Select a color for your Wild card</h3>
      <button @click="chooseColor('RED')">Red</button>
      <button @click="chooseColor('BLUE')">Blue</button>
      <button @click="chooseColor('GREEN')">Green</button>
      <button @click="chooseColor('YELLOW')">Yellow</button>
    </div>
  </div>
</template>


  
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import HandComponent from './Hand.vue';
import UNOCard from './UnoCard.vue';
import type { ICard } from '@/interfaces/IDeck';

const route = useRoute();
const router = useRouter();

// Socket connection and Game Data
const socket = ref<any>(null);
const gameId = computed(() => route.params.gameId);

const players = ref<{ username: string; cardCount: number }[]>([]);
const playerHand = ref<{ username: string; cards: ICard[]; hasSaidUno: boolean } | null>(null);
const botHands = ref<{ username: string; cards: ICard[]; hasSaidUno: boolean }[]>([]);
const topCard = ref<ICard | null>(null);
const isYourTurn = ref(false);
const showColorPicker = ref(false); // Controls the visibility of the color picker
const selectedCard = ref<ICard | null>(null); // The card being played
let hasSaidUno = false;

let hasPlayed: boolean = false;

// Utility function to reset the game state
function resetGameState() {
  playerHand.value = null;
  botHands.value = [];
  topCard.value = null;
  isYourTurn.value = false;
}

function sayUno() {
  if (!isYourTurn.value || !hasPlayed || hasSaidUno || playerHand?.value?.cards.length !==1) {
    return;
  }

  hasSaidUno = true; // Set the local flag
  if (playerHand.value) {
    playerHand.value.hasSaidUno = true; // Update the player's UNO status locally
  }

  console.log('Player said UNO!');
}


// Connect to the game room and setup the game
function connectSocket() {
  socket.value = io('http://localhost:5000');

  // Join the game room
  socket.value.emit('joinGame', { gameId: gameId.value, username: localStorage.getItem('username') });

  // Handle game started
  socket.value.on('gameStarted', ({ firstCard, playersHands, currentTurn }: any) => {
    resetGameState(); // Clear previous game state

    // Set the top card
    topCard.value = {
      type: firstCard.type as 'NUMBERED' | 'BLOCK' | 'REVERSE' | 'DRAW2' | 'WILD' | 'DRAW4',
      color: firstCard.color as 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK',
      number: firstCard.number ?? undefined,
    };
    console.log(playersHands)
    // Separate player hand and bot hands
    const username = localStorage.getItem('username');
    playersHands.forEach((hand: any) => {
      const processedHand = {
        username: hand.username,
        cards: hand.cards.map((card: any) => ({
          type: card.type as 'NUMBERED' | 'BLOCK' | 'REVERSE' | 'DRAW2' | 'WILD' | 'DRAW4',
          color: card.color as 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK',
          number: card.number ?? undefined,
        })),
        hasSaidUno: hand.hasSaidUno,
      };

      if (hand.username === username) {
        playerHand.value = processedHand;
      } else {
        botHands.value.push(processedHand);
      }
    });

    // Set the current turn
    isYourTurn.value = currentTurn === username;

    console.log('Game started:', { firstCard, playersHands, currentTurn });
  });

  // Handle disconnection
  socket.value.on('disconnect', () => {
    console.log('Disconnected from the server.');
    router.push('/');
  });

  // Listen for game state updates
  socket.value.on('updateGameState', ({ discardPile, playersHands, currentTurn }: any) => {
  // Update the top card (discard pile)
  topCard.value = discardPile;

  // Process playersHands to update playerHand and botHands
  playersHands.forEach((hand: any) => {
    const processedHand = {
      username: hand.username,
      cards: hand.cards.map((card: any) => ({
        type: card.type as 'NUMBERED' | 'BLOCK' | 'REVERSE' | 'DRAW2' | 'WILD' | 'DRAW4',
        color: card.color as 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK',
        number: card.number ?? undefined,
      })),
      hasSaidUno: hand.hasSaidUno, // Set initial UNO state, adjust as needed
    };
    console.log(processedHand.hasSaidUno)
    // Update playerHand if it's the current user
    if (hand.username === playerHand.value?.username) {
      playerHand.value = processedHand;
    } else {
      // Check if bot already exists in botHands
      const existingBotIndex = botHands.value.findIndex((bot) => bot.username === hand.username);
      if (existingBotIndex !== -1) {
        // Update existing bot hand
        botHands.value[existingBotIndex] = processedHand;
      } else {
        // Add new bot hand
        botHands.value.push(processedHand);
      }
    }
  });

  // Update current turn indicator
  isYourTurn.value = currentTurn === localStorage.getItem('username');
});

}

// Player Actions
function drawCard() {
  if (!isYourTurn.value || hasPlayed) {
    alert("It's not your turn!");
    return;
  }

  socket.value.emit(
    'drawCard',
    { gameId: gameId.value, username: localStorage.getItem('username') },
    (response: any) => {
      if (response.error) {
        alert(response.error);
        return;
      }

      console.log('Card drawn successfully');
    }
  );
  hasPlayed = true;
}


function endTurn() {
  socket.value.emit(
    'endTurn',
    { gameId: gameId.value, username: localStorage.getItem('username'), hasSaidUno },
    (response: any) => {
      if (response.error) {
        alert(response.error);
        return;
      }

      console.log('Turn ended successfully');
    }
  );
  hasPlayed = false;
  hasSaidUno = false;
}

function calloutUno() {
    socket.value.emit('calloutUno', {
        gameId: gameId.value,
        username: localStorage.getItem('username'),
    });
}

function playCard(index: number) {
  if (hasPlayed) {
    console.log("already played");
    return;
  }

  const card = playerHand.value?.cards[index];
  if (!card) return;

  console.log('Attempting to play card:', card);

  if (!isYourTurn.value) {
    alert("It's not your turn!");
    return;
  }

  // If the card is a Wild or Draw4, prompt for color
  if (card.type === 'WILD' || card.type === 'DRAW4') {
    selectedCard.value = card;
    showColorPicker.value = true;
    return;
  }

  // Play the card if no color picker is needed
  emitPlayCard(card);
}

function chooseColor(color: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW') {
  if (!selectedCard.value) return;

  console.log(`Color chosen: ${color}`);
  emitPlayCard(selectedCard.value, color);

  // Reset the picker state
  selectedCard.value = null;
  showColorPicker.value = false;
}

function emitPlayCard(card: ICard, chosenColor?: string) {
  socket.value.emit(
    'playCard',
    {
      gameId: gameId.value,
      username: localStorage.getItem('username'),
      card,
      chosenColor,
    },
    (response: any) => {
      if (response.error) {
        alert(response.error);
        return;
      }
      
      console.log('Card played successfully:', card);
    }
  );
  hasPlayed = true;

}




// Clean up on unmount
onMounted(() => {
  connectSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
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
