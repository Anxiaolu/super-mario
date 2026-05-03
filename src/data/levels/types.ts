// 关卡类型定义

export interface EnemySpawn {
  type: 'goomba' | 'koopa' | 'piranha' | 'buzzy' | 'bowser' | 'hammer'
  x: number
  y: number
}

/** 管道位置信息（预留：未来用于管道入口传送功能） */
export interface PipeInfo {
  x: number
  height: number
}

/** 浮动金币位置（预留：未来用于空中金币摆放） */
export interface CoinInfo {
  x: number
  y: number
}

export interface LevelMetadata {
  enemies: EnemySpawn[]
  coins: CoinInfo[]
  pipes: PipeInfo[]
  flagpoleX: number
  castleStartX: number
  timeLimit: number
  playerStartX: number
  playerStartY: number
  /** 背景色，不设置则使用默认天蓝色 */
  backgroundColor?: string
}

export interface LevelData {
  tiles: number[][]
  metadata: LevelMetadata
  /** 关卡标识，如 '1-1' */
  id: string
}
