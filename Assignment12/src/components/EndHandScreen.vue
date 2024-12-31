<template>
    <div class="end-hand-screen">
      <div class="winner-info">
        <h2>{{ hasEnded ? `${winner} has won the game!!!!` : `${winner} won this hand!` }}</h2>
        <p>Score for this hand: {{ score }}</p>
      </div>
  
      <div class="leaderboard">
        <h3>Leaderboard</h3>
        <ul>
          <li v-for="(playerScore, player) in leaderboard" :key="player">
            {{ player }}: {{ playerScore }} points
          </li>
        </ul>
      </div>
  
      <button v-if="!hasEnded" @click="playNextHand" class="next-hand-button">Play Next Hand</button>
      <button v-if="hasEnded" @click="endGame" class="next-hand-button">End game</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      winner: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      leaderboard: {
        type: Object,
        required: true
      },
      hasEnded: {
        type: Boolean,
        required: true
      },
    },
    methods: {
      playNextHand() {
        this.$emit("play-next-hand");
      },
      endGame(){
        this.$emit("end-game");
      }
    }
  };
  </script>
  
  <style scoped>
  .end-hand-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .winner-info h2 {
    font-size: 24px;
    margin: 0;
  }
  
  .leaderboard {
    margin-top: 20px;
    text-align: center;
  }
  
  .leaderboard h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .leaderboard ul {
    list-style: none;
    padding: 0;
  }
  
  .leaderboard li {
    font-size: 18px;
    margin: 5px 0;
  }
  
  .next-hand-button {
    margin-top: 30px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
    