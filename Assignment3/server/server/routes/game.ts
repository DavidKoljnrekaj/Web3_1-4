// routes/game.ts
import express from 'express';
import { Request, Response } from 'express';
import Game from '../models/game';
import { IGetUserAuthInfoRequest } from "../config/RequestDefs"
import { authenticate } from '../config/AuthMiddleware';
import {
    createGame,
    closeGame,
    getOpenGames,
    deleteGame,
    joinGame,
    getGame,
} from '../service/game';

const router = express.Router();

// Route to create a new game
router.post('/create', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const player = (req as any).user; // User is available from token
        if (!player) {
            return res.status(400).json({ message: 'Player ID is required' });
        }
        const game = await createGame(player);
        return res.status(201).json({ game });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

// Route to close a game
router.post('/close/:gameId', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const player = (req as any).user;
        console.log(player);
        const { gameId } = req.params;
        const updatedGame = await closeGame(gameId, player);
        if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json({ message: 'Game closed', game: updatedGame });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get all open games
router.get('/open', async (req: Request, res: Response) => {
    try {
        const openGames = await getOpenGames();
        res.status(200).json({ games: openGames });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to delete a game
router.delete('/:gameId', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const player = (req as any).user;
        const { gameId } = req.params;
        const deletedGame = await deleteGame(gameId, player);
        if (!deletedGame) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json({ message: 'Game deleted', game: deletedGame });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to join a game
router.post('/join/:gameId', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const { gameId } = req.params;
        const player = (req as any).user;

        if (!player) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const game = await joinGame(gameId, player);
        if (!game) {
            return res.status(404).json({ message: 'Game not found or closed' });
        }
        res.status(200).json({ message: `Player ${player} joined the game`, game });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get a game by gameId
router.get('/:gameId', async (req: Request, res: Response):Promise<any> => {
    try {
        const { gameId } = req.params;

        // Fetch the game from the database
        const game = await Game.findOne({ gameId });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.status(200).json({ game });
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to leave a game
router.post('/leave', authenticate, async (req: Request, res: Response):Promise<any> => {
    try {
        const { gameId } = req.body;
        const username = (req as any).user; // Retrieve the player from the token

        const game = await Game.findOne({ gameId });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Remove the player from the game
        game.players = game.players.filter(player => player !== username);

        // If the game is now empty, delete it
        if (game.players.length === 0) {
            await Game.findOneAndDelete({ gameId });
        } else {
            await game.save();
        }

        res.status(200).json({ message: 'Left the game successfully' });
    } catch (err) {
        console.error('Error leaving game:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});



export default router;
