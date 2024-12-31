import { startGame } from './game/StartGame';
import { gameLoop } from './game/GameLoop';

async function main() {
  // Define player IDs
  const playerIds = ['Player1', 'Player2', 'Player3', 'Player4'];

  // Initialize the game
  const game = startGame(playerIds);

  console.log('UNO Game Initialized!');
  console.log(`Players: ${playerIds.join(', ')}`);

  // Start the game loop
  await gameLoop(game);

  console.log('Thanks for playing UNO!');
}

main().catch((error) => {
  console.error('An error occurred:', error);
});
