// Game logic for Mint Works

import { GAME_CONFIG, LOCATIONS, PLAN_CARDS, GAME_PHASES, PLAYER_COLORS } from './gameConstants.js';

class Game {
  constructor(gameId) {
    this.gameId = gameId;
    this.players = [];
    this.phase = GAME_PHASES.LOBBY;
    this.currentPlayerIndex = 0;
    this.round = 0;
    this.locations = this.initializeLocations();
    this.planDeck = this.shuffleArray([...PLAN_CARDS]);
    this.planMarket = [];
    this.winner = null;
  }

  initializeLocations() {
    const locations = {};
    Object.values(LOCATIONS).forEach(loc => {
      locations[loc.id] = {
        ...loc,
        workers: [],
      };
    });
    return locations;
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  addPlayer(playerId, playerName) {
    if (this.players.length >= GAME_CONFIG.MAX_PLAYERS) {
      return { success: false, message: 'Game is full' };
    }

    if (this.phase !== GAME_PHASES.LOBBY) {
      return { success: false, message: 'Game already started' };
    }

    const player = {
      id: playerId,
      name: playerName,
      mints: GAME_CONFIG.STARTING_MINTS,
      stars: GAME_CONFIG.STARTING_STARS,
      workerTokens: [],
      plans: [],
      isFirstPlayer: false,
      color: PLAYER_COLORS[this.players.length],
    };

    // Each player starts with 2 worker tokens
    player.workerTokens = [
      { id: `${playerId}-w1`, playerId, placed: false },
      { id: `${playerId}-w2`, playerId, placed: false },
    ];

    this.players.push(player);
    return { success: true, player };
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }

  startGame() {
    if (this.players.length < GAME_CONFIG.MIN_PLAYERS) {
      return { success: false, message: 'Not enough players' };
    }

    // Randomly select first player
    this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
    this.players[this.currentPlayerIndex].isFirstPlayer = true;

    // Fill plan market
    this.fillPlanMarket();

    this.phase = GAME_PHASES.PLANNING;
    this.round = 1;

    return { success: true };
  }

  fillPlanMarket() {
    while (this.planMarket.length < 3 && this.planDeck.length > 0) {
      this.planMarket.push(this.planDeck.pop());
    }
  }

  placeWorker(playerId, locationId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    if (this.phase !== GAME_PHASES.PLANNING) {
      return { success: false, message: 'Not in planning phase' };
    }

    if (this.players[this.currentPlayerIndex].id !== playerId) {
      return { success: false, message: 'Not your turn' };
    }

    const location = this.locations[locationId];
    if (!location) {
      return { success: false, message: 'Location not found' };
    }

    // Check if player has enough mints
    if (player.mints < location.cost) {
      return { success: false, message: 'Not enough mints' };
    }

    // Check if location is full
    if (location.workers.length >= location.slots) {
      return { success: false, message: 'Location is full' };
    }

    // Find available worker token
    const worker = player.workerTokens.find(w => !w.placed);
    if (!worker) {
      return { success: false, message: 'No available workers' };
    }

    // Pay cost
    player.mints -= location.cost;

    // Place worker
    worker.placed = true;
    location.workers.push(worker);

    return { success: true };
  }

  pass(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    if (this.players[this.currentPlayerIndex].id !== playerId) {
      return { success: false, message: 'Not your turn' };
    }

    // Move to next player
    this.nextPlayer();

    // Check if all players have passed
    if (this.allPlayersPassedOrNoWorkers()) {
      this.executeLocationActions();
      this.upkeep();
    }

    return { success: true };
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  allPlayersPassedOrNoWorkers() {
    return this.players.every(p => p.workerTokens.every(w => w.placed));
  }

  executeLocationActions() {
    Object.values(this.locations).forEach(location => {
      location.workers.forEach(worker => {
        const player = this.players.find(p => p.id === worker.playerId);
        if (!player) return;

        switch (location.action) {
          case 'gainMints':
            player.mints += location.bonus;
            break;
          case 'gainStars':
            player.stars += location.bonus;
            break;
          case 'buildPlan':
            // Handled separately through buyPlan action
            break;
          case 'firstPlayer':
            // Update first player for next round
            this.players.forEach(p => p.isFirstPlayer = false);
            player.isFirstPlayer = true;
            this.currentPlayerIndex = this.players.findIndex(p => p.id === player.id);
            break;
          case 'gainStarsOrMints':
            // Player choice - simplified to 1 star for now
            player.stars += 1;
            break;
        }
      });
    });
  }

  buyPlan(playerId, planId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    // Check if player has worker at builder
    const builderLocation = this.locations.builder;
    const hasWorkerAtBuilder = builderLocation.workers.some(w => w.playerId === playerId);
    if (!hasWorkerAtBuilder) {
      return { success: false, message: 'No worker at builder location' };
    }

    const planIndex = this.planMarket.findIndex(p => p.id === planId);
    if (planIndex === -1) {
      return { success: false, message: 'Plan not found in market' };
    }

    const plan = this.planMarket[planIndex];

    // Check if player has enough resources
    if (player.mints < plan.cost.mints || player.stars < plan.cost.stars) {
      return { success: false, message: 'Not enough resources' };
    }

    // Pay cost
    player.mints -= plan.cost.mints;
    player.stars -= plan.cost.stars;

    // Add plan to player's tableau
    player.plans.push(plan);

    // Remove from market
    this.planMarket.splice(planIndex, 1);

    // Check for victory
    const totalVP = player.plans.reduce((sum, p) => sum + p.victoryPoints, 0);
    if (totalVP >= GAME_CONFIG.VICTORY_POINTS_TO_WIN) {
      this.phase = GAME_PHASES.GAME_OVER;
      this.winner = player;
    }

    return { success: true };
  }

  upkeep() {
    // Return all workers
    this.players.forEach(player => {
      player.workerTokens.forEach(worker => {
        worker.placed = false;
      });

      // Apply plan effects
      player.plans.forEach(plan => {
        switch (plan.effect) {
          case 'extraMint':
            player.mints += 1;
            break;
          case 'extraStar':
            player.stars += 1;
            break;
        }
      });
    });

    // Clear locations
    Object.values(this.locations).forEach(location => {
      location.workers = [];
    });

    // Refill plan market
    this.fillPlanMarket();

    // Check if game is over
    const hasWinner = this.players.some(p => {
      const vp = p.plans.reduce((sum, plan) => sum + plan.victoryPoints, 0);
      return vp >= GAME_CONFIG.VICTORY_POINTS_TO_WIN;
    });

    if (hasWinner) {
      this.phase = GAME_PHASES.GAME_OVER;
      const winnerPlayer = this.players.reduce((max, p) => {
        const pVP = p.plans.reduce((sum, plan) => sum + plan.victoryPoints, 0);
        const maxVP = max.plans.reduce((sum, plan) => sum + plan.victoryPoints, 0);
        return pVP > maxVP ? p : max;
      });
      this.winner = winnerPlayer;
    } else {
      this.round += 1;
      this.phase = GAME_PHASES.PLANNING;
      // Set current player to first player
      const firstPlayerIndex = this.players.findIndex(p => p.isFirstPlayer);
      if (firstPlayerIndex !== -1) {
        this.currentPlayerIndex = firstPlayerIndex;
      }
    }
  }

  getState() {
    return {
      gameId: this.gameId,
      players: this.players.map(p => ({
        ...p,
        victoryPoints: p.plans.reduce((sum, plan) => sum + plan.victoryPoints, 0),
      })),
      phase: this.phase,
      currentPlayerIndex: this.currentPlayerIndex,
      round: this.round,
      locations: this.locations,
      planMarket: this.planMarket,
      winner: this.winner,
    };
  }
}

export default Game;
