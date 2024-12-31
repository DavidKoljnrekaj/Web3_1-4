// index.ts
import express, { Application } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import initSocket from './socket'; // Import socket initializer

dotenv.config(); // Load environment variables

const app: Application = express();

// Enable CORS for all requests
app.use(cors({
    origin: '*', // Replace '*' with the frontend's URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow Authorization header
  }));

// Create HTTP server
const server = http.createServer(app);

// Connect to the database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Initialize Socket.io
const io = initSocket(server); // Pass the server instance

const PORT: number = parseInt(process.env.PORT || '5000', 10);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, server, io }; // Export for testing or further usage
