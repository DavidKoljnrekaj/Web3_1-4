// socket.ts
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import GameManager from './gameManager';
import type { ICard } from './game/Deck';
const gameManager = new GameManager(); 

const initSocket = (server: HttpServer): SocketIOServer => {
    const io = new SocketIOServer(server, { cors: { origin: '*' } });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        socket.on('createGame', ({ gameId, username }: { gameId: string; username: string }) => {
            try {
                if (gameManager.getGame(gameId)) {
                    socket.emit('error', { message: 'Game with this ID already exists' });
                    return;
                }

                const game = gameManager.createGame(gameId, username);

                socket.join(gameId);
                io.to(gameId).emit('gameCreated', {
                    gameId,
                    players: game.getPlayers(),
                });

                console.log(`Game created: ${gameId} by ${username}`);
            } catch (err) {
                console.error('Error creating game:', (err as Error).message);
                socket.emit('error', { message: (err as Error).message });
            }
        });

        socket.on('joinGame', ({ gameId, username }: { gameId: string; username: string }) => {
            try {
                let game = gameManager.getGame(gameId);

                if (!game) {
                    game = gameManager.createGame(gameId, username);
                }
                else {
                game.addPlayer(username);
                socket.join(gameId);

                if (game.getHand() !==null)
                {

                    const hand = game.getHand();
                if (!hand) {
                    throw new Error('Failed to retrieve hand');
                }
        
                const firstCard = hand.getTopCard();
                if (!firstCard) {
                    throw new Error('Failed to retrieve the first card');
                }
                    // Collect player hands for all players
                const playersHands = hand.getPlayersHands()
        

                io.to(gameId).emit('gameStarted', {
                    firstCard,
                    playersHands,
                    currentTurn: hand.getCurrentPlayer(), 
                });
                    return;
                }

                io.to(gameId).emit('playerJoined', { username });
                console.log(`${username} joined game ${gameId}`);
            }
            } catch (err) {
                console.error(err);
                socket.emit('error', { message: (err as Error).message });
            }
        });

        socket.on('playCard', ({ gameId, username, card, chosenColor }: { gameId: string; username: string; card: ICard; chosenColor?: string }) => {
            try {
                const game = gameManager.getGame(gameId);
                if (!game) {
                    socket.emit('error', { message: 'Game not found' });
                    return;
                }
        
                const hand = game.getHand();
                if (!hand) {
                    socket.emit('error', { message: 'Hand not found' });
                    return;
                }
        
                // Validate if it's the player's turn
                if (hand.getCurrentPlayer() !== username) {
                    socket.emit('error', { message: 'Not your turn' });
                    return;
                }
        
                // Attempt to play the card
                const playSuccess = hand.play(card, username, chosenColor);
                if (!playSuccess) {
                    socket.emit('error', { message: 'Invalid card play' });
                    return;
                }
        
                // Broadcast the updated game state to all players
                const playersHands = hand.getPlayersHands()
                console.log(playersHands);
                io.to(gameId).emit('updateGameState', {
                    discardPile: hand.getTopCard(),
                    playersHands: playersHands,
                    currentTurn: hand.getCurrentPlayer(),
                });
        
                console.log(`Player ${username} played a card:`, card);
            } catch (error) {
                console.error('Error in playCard:', error);
                socket.emit('error', { message: 'An error occurred' });
            }
        });
        

        socket.on('leaveGame', ({ gameId, username }: { gameId: string; username: string }) => {
            console.log(`${username} left game ${gameId}`);
            socket.leave(gameId);

            // Notify other players in the room
            io.to(gameId).emit('playerLeft', { username });
        });

        socket.on('startGame', ({ gameId }: { gameId: string }) => {
            try {
                const game = gameManager.getGame(gameId);
        
                if (!game) {
                    socket.emit('error', { message: 'Game not found' });
                    return;
                }
        
                console.log('Starting new hand for game:', gameId);
        
                const hand = game.startNewHand();
                if (!hand) {
                    throw new Error('Failed to start new hand');
                }
        
                const firstCard = hand.getTopCard();
                if (!firstCard) {
                    throw new Error('Failed to retrieve the first card');
                }
        
                // Collect player hands for all players
                const playersHands = hand.getPlayersHands();
        
                io.to(gameId).emit('gameStarted', {
                    firstCard,
                    playersHands,
                    currentTurn: hand.getCurrentPlayer(), 
                });
        
                console.log(`Game started: ${gameId}`);
            } catch (err) {
                console.error('Error starting game:', err);
                socket.emit('error', { message: (err as Error).message });
            }
        });        

        socket.on('drawCard', ({ gameId, username }: { gameId: string; username: string }) => {
            try {
              const game = gameManager.getGame(gameId);
              if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
              }
          
              const hand = game.getHand();
              if (!hand) {
                socket.emit('error', { message: 'Hand not found' });
                return;
              }
          
              // Attempt to draw a card
              hand.drawCard(username);
             
          
              // Broadcast the updated game state
              const playersHands = hand.getPlayersHands();
          
              io.to(gameId).emit('updateGameState', {
                discardPile: hand.getTopCard(),
                playersHands: playersHands,
                currentTurn: hand.getCurrentPlayer(),
              });
          
              console.log(`Player ${username} drew a card`);
            } catch (error) {
              console.error('Error in drawCard:', error);
              socket.emit('error', { message: 'An error occurred' });
            }
          });

          socket.on('endTurn', ({ gameId, username, hasSaidUno }: { gameId: string; username: string; hasSaidUno?: boolean }) => {
            try {
              const game = gameManager.getGame(gameId);
              if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
              }
          
              const hand = game.getHand();
              if (!hand) {
                socket.emit('error', { message: 'Hand not found' });
                return;
              }
          
              // Validate if it's the player's turn
              if (hand.getCurrentPlayer() !== username) {
                socket.emit('error', { message: 'Not your turn' });
                return;
              }
          
              // End the turn
              hand.endTurn(username, hasSaidUno);
              
          
              // Broadcast the updated game state
              const playersHands = hand.getPlayersHands();
              io.to(gameId).emit('updateGameState', {
                discardPile: hand.getTopCard(),
                playersHands: playersHands,
                currentTurn: hand.getCurrentPlayer(),
              });
          
              console.log(`Player ${username} ended their turn. Next player: ${hand.getCurrentPlayer()}`);
            } catch (error) {
              console.error('Error in endTurn:', error);
              socket.emit('error', { message: 'An error occurred' });
            }
          });
          
          socket.on('calloutUno', ({ gameId, username }) => {
            const game = gameManager.getGame(gameId);
        
            if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
            }

            const hand = game.getHand();
        
            if (!hand) {
                socket.emit('error', { message: 'Game not found' });
                return;
            }
        
            const penalizedPlayer = game.getHand()?.calloutUno(username); // Call backend method
        
            if (penalizedPlayer) {
                console.log(`${username} called out ${penalizedPlayer} successfully.`);
            } else {
                console.log(`${username} made an unsuccessful callout. No one penalized.`);
            }
        
            // Broadcast the updated game state to all players
            const playersHands = hand.getPlayersHands()
            console.log(playersHands);
            io.to(gameId).emit('updateGameState', {
                discardPile: hand.getTopCard(),
                playersHands: playersHands,
                currentTurn: hand.getCurrentPlayer(),
            });
        });
        
          
    });

    

    return io;
};

export default initSocket;
