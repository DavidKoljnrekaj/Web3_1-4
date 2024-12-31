import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Player from './player'; // Import Player model

// Interface for the Game document
export interface IGame extends Document {
    gameId: string;
    players: string[]; // Array of usernames
    scores: Map<string, number>;
    isFinished: boolean;
    lastWinner: mongoose.Types.ObjectId | null; // Reference to a Player
    createdAt: Date;
    isOpen: boolean;
}

// Define the Game schema
const gameSchema = new Schema<IGame>({
    gameId: {
        type: String,
        unique: true,
        default: uuidv4, // Automatically generated UUID
    },
    players: [
        {
            type: String, // Store usernames instead of ObjectId references
            required: true,
            validate: {
                validator: async function (username: string) {
                    const player = await Player.findOne({ username });
                    return !!player; // Returns true if the player exists
                },
                message: (props: { value: string }) =>
                    `Player with username ${props.value} does not exist!`,
            },
        },
    ],
    scores: {
        type: Map,
        of: Number,
        default: {}, // Default is an empty map
    },
    isFinished: {
        type: Boolean,
        default: false,
    },
    lastWinner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        default: null, // No winner by default
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isOpen: {
        type: Boolean,
        default: true, // Games are open by default
    },
});

// Export the Game model
const Game: Model<IGame> = mongoose.model<IGame>('Game', gameSchema);
export default Game;
