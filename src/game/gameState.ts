import type { CoinData, GameState } from './types';

export function createGameState(currentLevel: number): GameState {
  return {
    currentLevel,
    score: 0,
    lives: 3,
    status: 'playing',
    collectedCoinIds: [],
  };
}

export function collectCoin(state: GameState, coin: CoinData): GameState {
  if (state.collectedCoinIds.includes(coin.id)) {
    return state;
  }

  return {
    ...state,
    score: state.score + coin.value,
    collectedCoinIds: [...state.collectedCoinIds, coin.id],
  };
}

export function damagePlayer(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const lives = Math.max(0, state.lives - 1);

  return {
    ...state,
    lives,
    status: lives === 0 ? 'game-over' : 'playing',
  };
}

export function completeLevel(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  if (state.currentLevel >= 2) {
    return {
      ...state,
      status: 'completed',
    };
  }

  return {
    ...state,
    currentLevel: state.currentLevel + 1,
  };
}
