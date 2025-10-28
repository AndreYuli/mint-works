// Game constants for Mint Works

export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  STARTING_MINTS: 2,
  STARTING_STARS: 0,
  VICTORY_POINTS_TO_WIN: 7,
};

export const LOCATIONS = {
  SUPPLIER: {
    id: 'supplier',
    name: 'Proveedor',
    type: 'core',
    cost: 1,
    action: 'gainMints',
    slots: 1,
    bonus: 2, // mints to gain
  },
  PRODUCER: {
    id: 'producer',
    name: 'Productor',
    type: 'core',
    cost: 1,
    action: 'gainStars',
    slots: 2,
    bonus: 1, // stars to gain
  },
  BUILDER: {
    id: 'builder',
    name: 'Constructor',
    type: 'core',
    cost: 2,
    action: 'buildPlan',
    slots: 1,
  },
  LEADERSHIP: {
    id: 'leadership',
    name: 'Liderazgo',
    type: 'core',
    cost: 1,
    action: 'firstPlayer',
    slots: 1,
  },
  LOTTO: {
    id: 'lotto',
    name: 'Lotería',
    type: 'core',
    cost: 1,
    action: 'gainStarsOrMints',
    slots: 1,
  },
};

export const PLAN_CARDS = [
  {
    id: 'deed',
    name: 'Escritura',
    cost: { mints: 3, stars: 0 },
    victoryPoints: 1,
    effect: 'none',
  },
  {
    id: 'deed2',
    name: 'Escritura',
    cost: { mints: 3, stars: 0 },
    victoryPoints: 1,
    effect: 'none',
  },
  {
    id: 'deed3',
    name: 'Escritura',
    cost: { mints: 3, stars: 0 },
    victoryPoints: 1,
    effect: 'none',
  },
  {
    id: 'wholesaler',
    name: 'Mayorista',
    cost: { mints: 2, stars: 0 },
    victoryPoints: 1,
    effect: 'extraMint',
  },
  {
    id: 'wholesaler2',
    name: 'Mayorista',
    cost: { mints: 2, stars: 0 },
    victoryPoints: 1,
    effect: 'extraMint',
  },
  {
    id: 'crosstrade',
    name: 'Comercio Cruzado',
    cost: { mints: 3, stars: 0 },
    victoryPoints: 2,
    effect: 'convertMintToStar',
  },
  {
    id: 'windfall',
    name: 'Fortuna',
    cost: { mints: 4, stars: 0 },
    victoryPoints: 2,
    effect: 'gainExtraStars',
  },
  {
    id: 'producer',
    name: 'Productor',
    cost: { mints: 2, stars: 1 },
    victoryPoints: 2,
    effect: 'extraStar',
  },
  {
    id: 'factory',
    name: 'Fábrica',
    cost: { mints: 3, stars: 1 },
    victoryPoints: 3,
    effect: 'none',
  },
  {
    id: 'brewery',
    name: 'Cervecería',
    cost: { mints: 4, stars: 1 },
    victoryPoints: 3,
    effect: 'none',
  },
];

export const GAME_PHASES = {
  LOBBY: 'lobby',
  UPKEEP: 'upkeep',
  PLANNING: 'planning',
  GAME_OVER: 'gameOver',
};

export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
