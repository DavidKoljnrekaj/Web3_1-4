import express from 'express';
import { Express, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Player, { IPlayer } from '../models/player';

const router = express.Router();

const SECRET_KEY = '8ae9bc42a4e47ce1ae9fc65745c1063cee0e0fe3f61f10436ecf649cff79928030f3300ed24f4362f1bdaf2219498e6fbb53385046f010694025ae126bc125faa280d95b5a64cf3909f0bd84ed35c717cc587c8d0b8366042b70187e359d70a091c647776c8ff54f6c27dc7dd216ce55e0d4dcc08b403819a5559013acc834a2ec1ec26f9b150145f2611471506ee9c8863c11142e911240495164d3d2ff1724cfd61c8f114360d355e77eb3319d481a5e78f6fe6283b96a46f4b6f8a3f9f9f176906aad05c8a3bae0ef2862dc17885ba24afcc910ee3c25034c6ba5da6cd62a8fd21b029a63d3242e1edbde8bcc418a71d837adc1864206bd5bc6ba90882dc5'; // Use environment variables for production


// Register a user
router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const player = new Player({ username, password: hashedPassword });
        await player.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login a user
router.post('/login', async (req: Request, res: Response):Promise<any> => {
    const { username, password } = req.body;
    try {
        const player = await Player.findOne({ username });
        if (!player) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, player.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: player._id, username: player.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;