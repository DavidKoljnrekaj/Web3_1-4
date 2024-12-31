import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    username: string;
    password: string;
}

const playerSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IPlayer>('Player', playerSchema);
