import React from 'react';
import './GameBoard.css';

function GameBoard({
  gameState,
  playerId,
  playerName,
  gameId,
  onStartGame,
  onPlaceWorker,
  onBuyPlan,
  onPass,
}) {
  if (!gameState) return null;

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === playerId;
  const isLobby = gameState.phase === 'lobby';
  const isGameOver = gameState.phase === 'gameOver';

  const getLocationSlots = (location) => {
    const slots = [];
    for (let i = 0; i < location.slots; i++) {
      const worker = location.workers[i];
      if (worker) {
        const player = gameState.players.find(p => p.id === worker.playerId);
        slots.push(
          <div
            key={i}
            className="worker-token"
            style={{ background: player?.color }}
            title={player?.name}
          >
            👷
          </div>
        );
      } else {
        slots.push(
          <div key={i} className="worker-slot empty">
            {isCurrentTurn && currentPlayer && !isLobby && !isGameOver ? (
              <button
                onClick={() => onPlaceWorker(location.id)}
                className="place-worker-btn"
                disabled={currentPlayer.mints < location.cost}
              >
                +
              </button>
            ) : (
              <span>○</span>
            )}
          </div>
        );
      }
    }
    return slots;
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <div className="game-info">
          <h2>🪙 Mint Works</h2>
          <div className="game-id">ID: {gameId}</div>
        </div>
        <div className="round-info">
          {!isLobby && !isGameOver && <div>Ronda: {gameState.round}</div>}
          {isGameOver && <div className="game-over">¡Juego Terminado!</div>}
        </div>
      </div>

      {isLobby && (
        <div className="lobby-waiting">
          <h3>Sala de Espera</h3>
          <p>Jugadores: {gameState.players.length}/4</p>
          <div className="players-list">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card">
                <div
                  className="player-color"
                  style={{ background: player.color }}
                />
                <span>{player.name}</span>
              </div>
            ))}
          </div>
          {gameState.players.length >= 2 && (
            <button onClick={onStartGame} className="start-game-btn">
              Iniciar Partida
            </button>
          )}
          <p className="lobby-hint">
            Mínimo 2 jugadores para empezar
          </p>
        </div>
      )}

      {!isLobby && (
        <>
          <div className="players-info">
            {gameState.players.map(player => (
              <div
                key={player.id}
                className={`player-info ${
                  gameState.players[gameState.currentPlayerIndex]?.id === player.id
                    ? 'active'
                    : ''
                } ${player.id === playerId ? 'current-player' : ''}`}
                style={{ borderColor: player.color }}
              >
                <div className="player-header">
                  <div
                    className="player-indicator"
                    style={{ background: player.color }}
                  />
                  <strong>{player.name}</strong>
                  {player.isFirstPlayer && <span className="first-player">👑</span>}
                  {player.id === playerId && <span className="you-tag">(Tú)</span>}
                </div>
                <div className="player-resources">
                  <span>🪙 {player.mints}</span>
                  <span>⭐ {player.stars}</span>
                  <span>🏆 {player.victoryPoints} PV</span>
                </div>
                <div className="player-workers">
                  Trabajadores disponibles: {player.workerTokens.filter(w => !w.placed).length}
                </div>
                {player.plans.length > 0 && (
                  <div className="player-plans">
                    <small>Cartas: {player.plans.map(p => p.name).join(', ')}</small>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="locations-grid">
            {Object.values(gameState.locations).map(location => (
              <div key={location.id} className="location-card">
                <div className="location-header">
                  <h4>{location.name}</h4>
                  <span className="location-cost">Costo: {location.cost} 🪙</span>
                </div>
                <div className="location-action">
                  {location.action === 'gainMints' && `Gana ${location.bonus} 🪙`}
                  {location.action === 'gainStars' && `Gana ${location.bonus} ⭐`}
                  {location.action === 'buildPlan' && 'Construir carta'}
                  {location.action === 'firstPlayer' && 'Ser primer jugador'}
                  {location.action === 'gainStarsOrMints' && '1 ⭐ o 2 🪙'}
                </div>
                <div className="location-workers">{getLocationSlots(location)}</div>
              </div>
            ))}
          </div>

          <div className="plan-market">
            <h3>Mercado de Cartas de Desarrollo</h3>
            <div className="plans-grid">
              {gameState.planMarket.map(plan => (
                <div key={plan.id} className="plan-card">
                  <h4>{plan.name}</h4>
                  <div className="plan-cost">
                    Costo: {plan.cost.mints} 🪙
                    {plan.cost.stars > 0 && ` + ${plan.cost.stars} ⭐`}
                  </div>
                  <div className="plan-vp">🏆 {plan.victoryPoints} PV</div>
                  {plan.effect !== 'none' && (
                    <div className="plan-effect">{plan.effect}</div>
                  )}
                  {isCurrentTurn && currentPlayer && (
                    <button
                      onClick={() => onBuyPlan(plan.id)}
                      className="buy-plan-btn"
                      disabled={
                        currentPlayer.mints < plan.cost.mints ||
                        currentPlayer.stars < plan.cost.stars ||
                        !gameState.locations.builder.workers.some(
                          w => w.playerId === playerId
                        )
                      }
                    >
                      Comprar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isCurrentTurn && !isGameOver && (
            <div className="turn-actions">
              <div className="turn-indicator">
                <strong>🎯 Es tu turno</strong>
              </div>
              <button onClick={onPass} className="pass-btn">
                Pasar Turno
              </button>
            </div>
          )}

          {!isCurrentTurn && !isGameOver && (
            <div className="waiting-turn">
              Turno de: {gameState.players[gameState.currentPlayerIndex]?.name}
            </div>
          )}

          {isGameOver && gameState.winner && (
            <div className="winner-announcement">
              <h2>🎉 ¡{gameState.winner.name} ha ganado! 🎉</h2>
              <p>Puntos de Victoria: {gameState.winner.victoryPoints}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GameBoard;
