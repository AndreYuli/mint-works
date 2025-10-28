import React, { useState } from 'react';
import './Lobby.css';

function Lobby({ onCreateGame, onJoinGame, error }) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    if (isJoining) {
      if (!gameId.trim()) return;
      onJoinGame(playerName, gameId);
    } else {
      onCreateGame(playerName);
    }
  };

  return (
    <div className="lobby">
      <div className="lobby-container">
        <h1 className="title">🪙 Mint Works</h1>
        <p className="subtitle">Juego multijugador en tiempo real</p>

        <form onSubmit={handleSubmit} className="lobby-form">
          <input
            type="text"
            placeholder="Tu nombre"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
            required
          />

          {isJoining && (
            <input
              type="text"
              placeholder="ID de la partida"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="input"
              required
            />
          )}

          <div className="button-group">
            {!isJoining ? (
              <>
                <button type="submit" className="btn btn-primary">
                  Crear Partida
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoining(true)}
                  className="btn btn-secondary"
                >
                  Unirse a Partida
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="btn btn-primary">
                  Unirse
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoining(false)}
                  className="btn btn-secondary"
                >
                  Volver
                </button>
              </>
            )}
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="info-box">
          <h3>¿Cómo jugar?</h3>
          <ul>
            <li>🎯 Coloca trabajadores en ubicaciones para obtener recursos</li>
            <li>⭐ Consigue fichas de menta y estrellas</li>
            <li>🏗️ Construye cartas de desarrollo</li>
            <li>🏆 ¡El primero en alcanzar 7 puntos de victoria gana!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
