import Game, { IGame } from '../models/game';

/**
 * Creates a new game with the given creator.
 * @param creator - The username of the game creator.
 * @returns The created game document.
 */
export async function createGame(creator: string): Promise<IGame> {
    const players = [creator];
    const game = new Game({
        players,
        scores: new Map(players.map(player => [player, 0])),
    });
    return await game.save();
}

/**
 * Closes a game by setting isOpen to false.
 * @param gameId - The unique identifier of the game.
 * @param player - The username of the player attempting to close the game.
 * @returns The updated game document or null if unauthorized.
 */
export async function closeGame(gameId: string, player: string): Promise<IGame | null> {
    const game = await Game.findOne({ gameId });
    if (game) {
        return await Game.findOneAndUpdate({ gameId }, { isOpen: false }, { new: true });
    }
    return null;
}

/**
 * Retrieves all currently open games.
 * @returns An array of open game documents.
 */
export async function getOpenGames(): Promise<IGame[]> {
    return await Game.find({ isOpen: true });
}

/**
 * Deletes a game from the database.
 * @param gameId - The unique identifier of the game.
 * @param player - The username of the player attempting to delete the game.
 * @returns The deleted game document or null if unauthorized.
 */
export async function deleteGame(gameId: string, player: string): Promise<IGame | null> {
    const game = await Game.findOne({ gameId });
    if (game && game.players[0] === player) {
        return await Game.findOneAndDelete({ gameId });
    }
    return null;
}

/**
 * Allows a player to join an existing game.
 * @param gameId - The unique identifier of the game.
 * @param username - The username of the player attempting to join.
 * @returns The updated game document.
 */
export async function joinGame(gameId: string, username: string): Promise<IGame> {
    const game = await Game.findOne({ gameId });
    if (!game) throw new Error('Game not found');

    // Check if the player is already in the game
    if (!game.players.includes(username)) {
        game.players.push(username);
        game.scores.set(username, 0); // Initialize the player's score
        await game.save();
    }

    return game;
}

/**
 * Retrieves a game by its unique identifier.
 * @param gameId - The unique identifier of the game.
 * @returns The game document or null if not found.
 */
export async function getGame(gameId: string): Promise<IGame | null> {
    return await Game.findOne({ gameId });
}
