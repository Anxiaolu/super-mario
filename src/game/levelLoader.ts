import type { LevelData, ParsedLevel } from './types';
import { createRuntimePlatform } from './platforms';

export function parseLevel(levelData: LevelData): ParsedLevel {
  if (!levelData.goal) {
    throw new Error('关卡缺少终点');
  }

  return {
    ...levelData,
    goal: levelData.goal,
    platforms: levelData.platforms.map(createRuntimePlatform),
    coins: [...levelData.coins],
    enemies: [...levelData.enemies],
  };
}
