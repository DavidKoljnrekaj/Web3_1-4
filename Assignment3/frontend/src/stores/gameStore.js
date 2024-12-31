export const useGameStore = defineStore('game', {
    state: () => ({
      players: [],  // Array of players and their hands
      scores: [],   // Array of scores for each player
      currentPlayerIndex: 0,
      gameOver: false,
      // ... other state properties
    }),
  
    actions: {
      calculateScore(opponentHands) {
        let score = 0;
        opponentHands.forEach(hand => {
          hand.forEach(card => {
            if (card.type === 'NUMBERED') {
              score += card.number;
            } else {
              score += (card.type === 'WILD' || card.type === 'WILD DRAW') ? 50 : 20;
            }
          });
        });
        return score;
      },
  
      endHand() {
        // Get the hands of opponents (you can modify how you structure your data)
        const opponentHands = this.players.map(p => p.hand).filter((_, index) => index !== this.currentPlayerIndex);
  
        const score = this.calculateScore(opponentHands);
        this.scores[this.currentPlayerIndex] += score;
  
        if (this.scores[this.currentPlayerIndex] >= 500) {
          this.gameOver = true;
          // Navigate to the game-over screen (e.g., via Vue Router)
        } else {
          // Proceed to the next hand
        }
      },
    }
  });
  