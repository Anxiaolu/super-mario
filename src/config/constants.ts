export const TILE_SIZE = 16
export const GAME_WIDTH = 256
export const GAME_HEIGHT = 240
export const GRAVITY = 1600
export const SKY_COLOR = '#5C94FC'
export const UNDERGROUND_BG = '#000000'

// 马里奥物理参数（调校以还原原版 NES 手感）
export const MARIO_WALK_SPEED = 100
export const MARIO_RUN_SPEED = 170
export const MARIO_JUMP_VELOCITY = -500
export const MARIO_ACCELERATION = 2400    // 近乎瞬时加速
export const MARIO_DECELERATION = 600     // 适中的滑动停止

// 敌人速度
export const GOOMBA_SPEED = 30
export const KOOPA_SPEED = 30
export const SHELL_SPEED = 220
export const MUSHROOM_SPEED = 40
export const FIREBALL_SPEED = 200

// 瓦片类型 ID
export const TILE = {
  EMPTY: 0,
  GROUND: 1,
  BRICK: 2,
  QUESTION: 3,
  QUESTION_MUSHROOM: 4,
  USED_BLOCK: 5,
  PIPE_TL: 6,
  PIPE_TR: 7,
  PIPE_BL: 8,
  PIPE_BR: 9,
  FLAGPOLE: 10,
  FLAGPOLE_TOP: 11,
  HARD_BLOCK: 12,
  CASTLE: 13,
  COIN_TILE: 14,
  INVISIBLE_BLOCK: 15,
} as const

// 碰撞瓦片集合
export const COLLISION_TILES = [
  TILE.GROUND, TILE.BRICK, TILE.QUESTION, TILE.QUESTION_MUSHROOM,
  TILE.USED_BLOCK, TILE.PIPE_TL, TILE.PIPE_TR, TILE.PIPE_BL, TILE.PIPE_BR,
  TILE.HARD_BLOCK, TILE.CASTLE, TILE.INVISIBLE_BLOCK,
] as const

export const BREAKABLE_TILES = [TILE.BRICK] as const
export const QUESTION_TILES = [TILE.QUESTION, TILE.QUESTION_MUSHROOM] as const

// 游戏状态
export const GAME = {
  INITIAL_LIVES: 3,
  INITIAL_TIME: 400,
  INITIAL_COINS: 0,
  INITIAL_SCORE: 0,
  INVINCIBLE_DURATION: 2000,
} as const

// 实体销毁阈值
export const DESTROY_Y_THRESHOLD = 260
export const FLAT_DISPLAY_DURATION = 500
export const SHELL_WAKE_DELAY = 6000

// 物理参数
export const JUMP_CUTOFF_VELOCITY = -200
export const STOMP_BOUNCE_VELOCITY = -280

// 分值
export const SCORE = {
  GOOMBA_STOMP: 100,
  KOOPA_STOMP: 100,
  COIN: 200,
  MUSHROOM: 1000,
  FLOWER: 1000,
  STAR: 1000,
  COMBO_MULTIPLIER: 2,
  ONE_UP_SCORE: 10000,
} as const

// 纹理 key 常量
export const TEX = {
  // 马里奥
  MARIO_SMALL_STAND: 'mario-small-stand',
  MARIO_SMALL_WALK_1: 'mario-small-walk-1',
  MARIO_SMALL_WALK_2: 'mario-small-walk-2',
  MARIO_SMALL_WALK_3: 'mario-small-walk-3',
  MARIO_SMALL_JUMP: 'mario-small-jump',
  MARIO_SMALL_DIE: 'mario-small-die',
  MARIO_SMALL_TURN: 'mario-small-turn',
  MARIO_BIG_STAND: 'mario-big-stand',
  MARIO_BIG_JUMP: 'mario-big-jump',
  MARIO_BIG_DUCK: 'mario-big-duck',
  MARIO_BIG_TURN: 'mario-big-turn',
  MARIO_FIRE_STAND: 'mario-fire-stand',
  // 道具
  MUSHROOM_RED: 'mushroom-red',
  FIREBALL: 'fireball',
  FLAG: 'flag',
  // 碎片
  BRICK_DEBRIS_1: 'brick-debris-1',
  BRICK_DEBRIS_2: 'brick-debris-2',
  // 敌人
  GOOMBA_1: 'goomba-1',
  GOOMBA_FLAT: 'goomba-flat',
  KOOPA_1: 'koopa-1',
  SHELL: 'shell',
  BUZZY_WALK_1: 'buzzy-walk-1',
  BUZZY_SHELL: 'buzzy-shell',
  HAMMER_BRO_1: 'hammer-bro-1',
  BOWSER_1: 'bowser-1',
  PIRANHA_1: 'piranha-plant-1',
  // 瓦片
  TILE_FLAGPOLE: 'tile-flagpole',
  TILE_FLAGPOLE_TOP: 'tile-flagpole-top',
  TILESET: 'mario-tileset',
} as const
