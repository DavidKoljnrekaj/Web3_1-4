import { IGame } from '../models/IGame';
import { drawCard } from '../hand/DrawCard';
import { playCard } from '../hand/playCard';
import { calculateScores } from '../utils/scoring';
import { IHand } from '../models/IHand';
import { ICard } from '../models/ICard';
import * as readline from 'readline';

// Initialize user input handling
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to get user input
function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

// Game loop
export async function gameLoop(game: IGame): Promise<void> {
  let currentHand = game.currentHand;

  while (true) {
    const currentPlayer = currentHand.players[currentHand.currentPlayerIndex];

    console.log(`\n${currentPlayer.id}'s turn`);
    console.log(`Your hand:`, currentPlayer.hand);
    console.log(`Top card:`, currentHand.deck.discardPile[currentHand.deck.discardPile.length - 1]);

    const action = await askQuestion(
      'Enter the index of the card to play, or type "draw" to draw a card (e.g., "1 UNO"): '
    );

    try {
      if (action.toLowerCase() === 'draw') {
        currentHand = drawCard(currentHand);
        console.log('You drew a card. Turn is over.');
        continue;
      }

      // Handle "index UNO" input
      const [cardIndexStr, maybeUno] = action.split(' ');
      const cardIndex = parseInt(cardIndexStr, 10);
      const saidUno = maybeUno?.toUpperCase() === 'UNO';

      if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
        console.log('Invalid card index. Please try again.');
        continue;
      }

      const cardToPlay: ICard = currentPlayer.hand[cardIndex];

      if (cardToPlay.type === 'WILD' || cardToPlay.type === 'DRAW4') {
        const chosenColor = await askQuestion('Choose a color (RED, BLUE, GREEN, YELLOW): ').then(input => {
          const color = input.toUpperCase();
          if (!['RED', 'BLUE', 'GREEN', 'YELLOW'].includes(color)) {
            throw new Error('Invalid color choice. Choose one of: RED, BLUE, GREEN, YELLOW.');
          }
          return color as ICard['color'];
        });

        currentHand = playCard(currentHand, currentPlayer.id, cardToPlay, chosenColor, saidUno);
      } else {
        currentHand = playCard(currentHand, currentPlayer.id, cardToPlay, undefined, saidUno);
      }

      // Check if the player has one card left and has not said UNO
      if (currentHand.players[currentHand.currentPlayerIndex].hand.length === 1 && !currentHand.saidUno) {
        console.log(`${currentPlayer.id} failed to say UNO! Drawing 4 cards as penalty.`);
        const penaltyCards = currentHand.deck.drawPile.splice(0, 4);
        currentHand.players[currentHand.currentPlayerIndex].hand.push(...penaltyCards);
      }

      console.log(`${currentPlayer.id} played:`, cardToPlay);

      if (currentHand.players[currentHand.currentPlayerIndex].hand.length === 0) {
        console.log(`\n🎉 ${currentPlayer.id} has no cards left! Hand over.`);
        break;
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'An unknown error occurred.');
      continue;
    }
  }

  // Calculate scores for the hand
  const handScores = calculateScores(currentHand.players);
  console.log('Hand scores:', handScores);

  // Update game scores immutably
  const updatedScores = { ...game.scores };
  for (const playerId in handScores) {
    updatedScores[playerId] += handScores[playerId];
  }

  // Check for a game winner
  const winner = Object.keys(updatedScores).find(playerId => updatedScores[playerId] >= game.targetScore);
  if (winner) {
    console.log(`\n🎉 ${winner} wins the game with ${updatedScores[winner]} points!`);
    rl.close();
    return;
  }

  // Start a new hand immutably
  const nextHand: IHand = {
    ...currentHand,
    players: currentHand.players.map(player => ({
      ...player,
      hand: [], // Empty the hands for the next round
    })),
  };

  await gameLoop({
    ...game,
    scores: updatedScores,
    currentHand: nextHand,
  });
}
