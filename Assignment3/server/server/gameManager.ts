import Game from './game/Game';

export default class gameManager {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map<string, Game>();
  }

  createGame(gameId: string, firstPlayer: string): Game {
    if (this.games.has(gameId)) throw new Error('Game ID already exists');
    const newGame = new Game(firstPlayer);
    this.games.set(gameId, newGame);
    return newGame;
  }

  getGame(gameId: string): Game | null {
    return this.games.get(gameId) || null;
  }

  deleteGame(gameId: string): boolean {
    return this.games.delete(gameId);
}
}
