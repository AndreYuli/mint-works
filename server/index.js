// Server for Mint Works multiplayer game

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Game from './Game.js';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store active games
const games = new Map();

// Store player connections
const playerConnections = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('createGame', ({ playerName }) => {
    const gameId = Math.random().toString(36).substring(7);
    const game = new Game(gameId);
    
    const result = game.addPlayer(socket.id, playerName);
    if (result.success) {
      games.set(gameId, game);
      playerConnections.set(socket.id, { gameId, playerName });
      
      socket.join(gameId);
      socket.emit('gameCreated', { gameId, gameState: game.getState() });
      
      console.log(`Game ${gameId} created by ${playerName}`);
    }
  });

  socket.on('joinGame', ({ gameId, playerName }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const result = game.addPlayer(socket.id, playerName);
    if (result.success) {
      playerConnections.set(socket.id, { gameId, playerName });
      socket.join(gameId);
      
      // Notify all players in the game
      io.to(gameId).emit('gameState', game.getState());
      io.to(gameId).emit('playerJoined', { player: result.player });
      
      console.log(`${playerName} joined game ${gameId}`);
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('startGame', () => {
    const connection = playerConnections.get(socket.id);
    if (!connection) return;

    const game = games.get(connection.gameId);
    if (!game) return;

    const result = game.startGame();
    if (result.success) {
      io.to(connection.gameId).emit('gameState', game.getState());
      io.to(connection.gameId).emit('gameStarted');
      console.log(`Game ${connection.gameId} started`);
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('placeWorker', ({ locationId }) => {
    const connection = playerConnections.get(socket.id);
    if (!connection) return;

    const game = games.get(connection.gameId);
    if (!game) return;

    const result = game.placeWorker(socket.id, locationId);
    if (result.success) {
      io.to(connection.gameId).emit('gameState', game.getState());
      
      // Auto-advance to next player
      if (game.allPlayersPassedOrNoWorkers()) {
        setTimeout(() => {
          game.executeLocationActions();
          game.upkeep();
          io.to(connection.gameId).emit('gameState', game.getState());
          
          if (game.phase === 'gameOver') {
            io.to(connection.gameId).emit('gameOver', { winner: game.winner });
          }
        }, 1000);
      } else {
        game.nextPlayer();
        io.to(connection.gameId).emit('gameState', game.getState());
      }
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('buyPlan', ({ planId }) => {
    const connection = playerConnections.get(socket.id);
    if (!connection) return;

    const game = games.get(connection.gameId);
    if (!game) return;

    const result = game.buyPlan(socket.id, planId);
    if (result.success) {
      io.to(connection.gameId).emit('gameState', game.getState());
      
      if (game.phase === 'gameOver') {
        io.to(connection.gameId).emit('gameOver', { winner: game.winner });
      }
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  socket.on('pass', () => {
    const connection = playerConnections.get(socket.id);
    if (!connection) return;

    const game = games.get(connection.gameId);
    if (!game) return;

    const result = game.pass(socket.id);
    if (result.success) {
      io.to(connection.gameId).emit('gameState', game.getState());
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    const connection = playerConnections.get(socket.id);
    if (connection) {
      const game = games.get(connection.gameId);
      if (game && game.phase === 'lobby') {
        game.removePlayer(socket.id);
        io.to(connection.gameId).emit('gameState', game.getState());
        io.to(connection.gameId).emit('playerLeft', { playerId: socket.id });
      }
      playerConnections.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Mint Works server running on port ${PORT}`);
});
