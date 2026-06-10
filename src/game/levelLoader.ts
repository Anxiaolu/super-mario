import type { LevelData, ParsedLevel } from './types';

export function parseLevel(levelData: LevelData): ParsedLevel {
  if (!levelData.goal) {
    throw new Error('关卡缺少终点');
  }

  return {
    ...levelData,
    goal: levelData.goal,
    platforms: [...levelData.platforms],
    coins: [...levelData.coins],
    enemies: [...levelData.enemies],
  };
}
