<template>
    <div class="find-game">
      <h1>Find Game</h1>
      <ul v-if="games.length">
        <li v-for="game in games" :key="game.gameId">
          <span>{{ game.gameId }}</span>
          <button @click="joinGame(game.gameId)">Join</button>
        </li>
      </ul>
      <p v-else>No games available. Create a new game.</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        games: [],
      };
    },
    methods: {
      async fetchGames() {
        try {
          const response = await axios.get("http://localhost:5000/api/game/open");
          this.games = response.data.games;
        } catch (err) {
          console.error("Error fetching games:", err);
        }
      },
      async joinGame(gameId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `http://localhost:5000/api/game/join/${gameId}`,
            { username: localStorage.getItem("username") },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ); 
          console.log("Joined game:", response.data.game);
          this.$router.push(`/start-game/${gameId}`); // Redirect to the game page
        } catch (err) {
          console.error("Error joining game:", err);
        }
      },
    },
    mounted() {
      this.fetchGames();
    },
  };
  </script>
  
  <style scoped>
  .find-game {
    text-align: center;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    padding: 5px 10px;
  }
  </style>
  