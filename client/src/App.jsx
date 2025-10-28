import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import './App.css';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');
  const [isInGame, setIsInGame] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setPlayerId(socket.id);
    });

    socket.on('gameCreated', ({ gameId: newGameId, gameState: state }) => {
      setGameId(newGameId);
      setGameState(state);
      setIsInGame(true);
    });

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    socket.on('playerJoined', ({ player }) => {
      console.log('Player joined:', player.name);
    });

    socket.on('gameStarted', () => {
      console.log('Game started!');
    });

    socket.on('gameOver', ({ winner }) => {
      alert(`¡${winner.name} ha ganado!`);
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('gameCreated');
      socket.off('gameState');
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('gameOver');
      socket.off('error');
    };
  }, []);

  const handleCreateGame = (name) => {
    setPlayerName(name);
    socket.emit('createGame', { playerName: name });
  };

  const handleJoinGame = (name, id) => {
    setPlayerName(name);
    setGameId(id);
    socket.emit('joinGame', { gameId: id, playerName: name });
    setIsInGame(true);
  };

  const handleStartGame = () => {
    socket.emit('startGame');
  };

  const handlePlaceWorker = (locationId) => {
    socket.emit('placeWorker', { locationId });
  };

  const handleBuyPlan = (planId) => {
    socket.emit('buyPlan', { planId });
  };

  const handlePass = () => {
    socket.emit('pass');
  };

  if (!isInGame) {
    return (
      <Lobby
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        error={error}
      />
    );
  }

  return (
    <div className="app">
      {error && <div className="error-message">{error}</div>}
      {gameState && (
        <GameBoard
          gameState={gameState}
          playerId={playerId}
          playerName={playerName}
          gameId={gameId}
          onStartGame={handleStartGame}
          onPlaceWorker={handlePlaceWorker}
          onBuyPlan={handleBuyPlan}
          onPass={handlePass}
        />
      )}
    </div>
  );
}

export default App;
