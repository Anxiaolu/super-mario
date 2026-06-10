import type { CoinData, GameState } from './types';

interface CompletionSummary {
  title: string;
  lines: string[];
}

export function createGameState(currentLevel: number): GameState {
  return {
    currentLevel,
    score: 0,
    lives: 3,
    status: 'playing',
    collectedCoinIds: [],
    timeRemainingSeconds: 75,
    timeBonusAwarded: 0,
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

  const timeBonusAwarded = Math.max(0, Math.floor(state.timeRemainingSeconds) * 5);
  const score = state.score + timeBonusAwarded;

  if (state.currentLevel >= 2) {
    return {
      ...state,
      score,
      timeBonusAwarded,
      status: 'completed',
    };
  }

  return {
    ...state,
    score,
    currentLevel: state.currentLevel + 1,
    timeBonusAwarded,
  };
}

export function tickTimer(state: GameState, deltaSeconds: number): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const timeRemainingSeconds = Math.max(0, state.timeRemainingSeconds - deltaSeconds);

  return {
    ...state,
    timeRemainingSeconds,
    status: timeRemainingSeconds === 0 ? 'game-over' : state.status,
  };
}

export function formatTimeRemaining(timeRemainingSeconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(timeRemainingSeconds));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function buildCompletionSummary(state: GameState): CompletionSummary {
  return {
    title: state.status === 'completed' ? '两关通关' : '旅程结束',
    lines: [
      `剩余时间 ${formatTimeRemaining(state.timeRemainingSeconds)}`,
      `时间奖励 +${state.timeBonusAwarded}`,
      `最终分数 ${state.score}`,
    ],
  };
}
