import { LevelData } from './types'
import { WORLD_1_LEVEL_1 } from './World1Level1'
import { WORLD_1_LEVEL_2 } from './World1Level2'
import { WORLD_1_LEVEL_3 } from './World1Level3'
import { WORLD_1_LEVEL_4 } from './World1Level4'

export const LEVELS: LevelData[] = [
  WORLD_1_LEVEL_1,
  WORLD_1_LEVEL_2,
  WORLD_1_LEVEL_3,
  WORLD_1_LEVEL_4,
]

export function getLevel(index: number): LevelData {
  const level = LEVELS[index]
  if (!level) {
    throw new Error(`关卡索引 ${index} 越界（有效范围 0-${LEVELS.length - 1}）`)
  }
  return level
}

export function getLevelCount(): number {
  return LEVELS.length
}
