import * as Phaser from 'phaser'

const SIZE = 16
const BIG_H = 32

// NES 经典调色板
const RED = '#B13425'
const BROWN = '#6B420C'
const SKIN = '#E8A060'
const DARK_SKIN = '#A85400'
const FIRE_WHITE = '#FCF8FC'
const FIRE_RED = '#D88000'

type ColorMap = Record<number, string>

// 0=透明, 1=红/白, 2=棕/裤, 3=皮肤, 4=深色
const SMALL_COLORS: ColorMap = { 1: RED, 2: BROWN, 3: SKIN, 4: DARK_SKIN }
const FIRE_COLORS: ColorMap = { 1: FIRE_WHITE, 2: FIRE_RED, 3: SKIN, 4: DARK_SKIN }

// 小马里奥站立 (16x16) - 面向右
const MARIO_SMALL_STAND: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,2,2,3,2,2,2,0,0,0,0,0,0],
  [0,0,0,2,2,2,3,2,2,3,2,2,2,0,0,0],
  [0,0,2,2,2,2,3,3,3,2,2,2,2,0,0,0],
  [0,0,3,3,2,3,3,2,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,2,2,0,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
]

// 小马里奥行走帧1
const MARIO_SMALL_WALK1: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,2,2,2,3,2,2,0,0,0,0,0,0],
  [0,0,0,0,3,2,2,3,2,3,2,0,0,0,0,0],
  [0,0,0,0,3,3,2,2,3,2,3,3,3,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0],
  [0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0],
]

// 小马里奥行走帧2
const MARIO_SMALL_WALK2: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,2,2,3,2,2,2,0,0,0,0,0,0],
  [0,0,0,2,2,2,3,2,2,3,2,2,2,0,0,0],
  [0,0,2,2,2,2,3,3,3,2,2,2,2,0,0,0],
  [0,0,3,3,2,3,3,2,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,2,2,0,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
]

// 小马里奥行走帧3
const MARIO_SMALL_WALK3: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,2,2,3,2,2,0,2,2,2,0,0,0,0],
  [0,0,3,2,2,3,2,0,0,0,2,3,3,0,0,0],
  [0,0,3,3,2,2,2,0,0,0,2,3,3,0,0,0],
  [0,0,0,3,3,3,0,0,0,2,2,3,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],
]

// 小马里奥跳跃
const MARIO_SMALL_JUMP: number[][] = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,2,2,2,3,2,2,2,2,3,2,0,0,0],
  [0,0,2,3,3,2,3,3,3,2,2,3,3,3,0,0],
  [0,0,3,3,3,3,2,2,2,3,3,3,3,3,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,0,2,2,2,0,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

// 小马里奥死亡
const MARIO_SMALL_DIE: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,3,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,3,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,2,2,3,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,3,2,2,3,2,2,0,0,0,0],
  [0,0,0,0,2,2,3,3,3,2,2,2,0,0,0,0],
  [0,0,0,0,3,3,3,2,3,3,3,3,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
]

// 小马里奥转身
const MARIO_SMALL_TURN: number[][] = [
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,4,4,4,2,2,3,2,0,0,0,0,0],
  [0,0,0,4,2,4,2,2,2,3,2,2,2,0,0,0],
  [0,0,0,4,4,2,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,4,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,2,2,3,2,2,2,0,0,0,0,0,0],
  [0,0,0,2,2,2,3,2,2,3,2,2,2,0,0,0],
  [0,0,2,2,2,2,3,3,3,2,2,2,2,0,0,0],
  [0,0,3,3,2,3,3,2,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,2,2,2,3,3,3,3,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,2,2,0,2,2,0,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,2,0,2,2,2,0,0,0,0,0],
]

function drawPixels(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  pixels: number[][],
  colors: ColorMap,
): void {
  const ct = scene.textures.createCanvas(key, w, h)
  if (!ct) return
  const ctx = ct.getContext()
  ctx.clearRect(0, 0, w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = pixels[y][x]
      if (idx === 0) continue
      const color = colors[idx]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  }
  ct.update()
}

// 大马里奥下半身（16x16）
function makeBigBottom(): number[][] {
  // 0=透明, 2=裤子色, 3=皮肤色
  const PANTS = 2
  const FEET = 3
  const data: number[][] = []
  for (let y = 0; y < SIZE; y++) {
    const row: number[] = new Array(SIZE).fill(0)
    data.push(row)
  }
  // 上身延伸（裤子区域）
  for (let y = 0; y < 6; y++) {
    for (let x = 3; x < 13; x++) {
      data[y][x] = PANTS
    }
  }
  // 腿部
  for (let y = 6; y < 12; y++) {
    data[y][3] = FEET; data[y][4] = FEET; data[y][5] = FEET
    data[y][10] = FEET; data[y][11] = FEET; data[y][12] = FEET
  }
  // 鞋
  for (let x = 3; x < 7; x++) { data[12][x] = PANTS; data[13][x] = PANTS }
  for (let x = 10; x < 14; x++) { data[12][x] = PANTS; data[13][x] = PANTS }
  return data
}

function drawBigMario(
  scene: Phaser.Scene,
  key: string,
  topPixels: number[][],
  bottomPixels: number[][],
  colors: ColorMap,
): void {
  const ct = scene.textures.createCanvas(key, SIZE, BIG_H)
  if (!ct) return
  const ctx = ct.getContext()
  ctx.clearRect(0, 0, SIZE, BIG_H)

  // 上半身
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = topPixels[y][x]
      if (idx === 0) continue
      const color = colors[idx]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  }
  // 下半身
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = bottomPixels[y][x]
      if (idx === 0) continue
      const color = colors[idx]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y + SIZE, 1, 1)
    }
  }
  ct.update()
}

export function generateMarioTextures(scene: Phaser.Scene): void {
  // ===== 小马里奥 =====
  drawPixels(scene, 'mario-small-stand', SIZE, SIZE, MARIO_SMALL_STAND, SMALL_COLORS)
  drawPixels(scene, 'mario-small-walk-1', SIZE, SIZE, MARIO_SMALL_WALK1, SMALL_COLORS)
  drawPixels(scene, 'mario-small-walk-2', SIZE, SIZE, MARIO_SMALL_WALK2, SMALL_COLORS)
  drawPixels(scene, 'mario-small-walk-3', SIZE, SIZE, MARIO_SMALL_WALK3, SMALL_COLORS)
  drawPixels(scene, 'mario-small-jump', SIZE, SIZE, MARIO_SMALL_JUMP, SMALL_COLORS)
  drawPixels(scene, 'mario-small-die', SIZE, SIZE, MARIO_SMALL_DIE, SMALL_COLORS)
  drawPixels(scene, 'mario-small-turn', SIZE, SIZE, MARIO_SMALL_TURN, SMALL_COLORS)

  // ===== 大马里奥 =====
  const bigBottom = makeBigBottom()
  const bigBottomWalk1: number[][] = BIG_BOTTOM_WALK1()
  const bigBottomWalk3: number[][] = BIG_BOTTOM_WALK3()

  drawBigMario(scene, 'mario-big-stand', MARIO_SMALL_STAND, bigBottom, SMALL_COLORS)
  drawBigMario(scene, 'mario-big-walk-1', MARIO_SMALL_WALK1, bigBottomWalk1, SMALL_COLORS)
  drawBigMario(scene, 'mario-big-walk-2', MARIO_SMALL_WALK2, bigBottom, SMALL_COLORS)
  drawBigMario(scene, 'mario-big-walk-3', MARIO_SMALL_WALK3, bigBottomWalk3, SMALL_COLORS)
  drawBigMario(scene, 'mario-big-jump', MARIO_SMALL_JUMP, BIG_BOTTOM_JUMP(), SMALL_COLORS)
  drawBigMario(scene, 'mario-big-duck', MARIO_SMALL_STAND, BIG_BOTTOM_DUCK(), SMALL_COLORS)
  drawBigMario(scene, 'mario-big-turn', MARIO_SMALL_TURN, bigBottom, SMALL_COLORS)

  // ===== 火焰马里奥（同大马里奥帧，不同颜色）=====
  drawBigMario(scene, 'mario-fire-stand', MARIO_SMALL_STAND, bigBottom, FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-walk-1', MARIO_SMALL_WALK1, bigBottomWalk1, FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-walk-2', MARIO_SMALL_WALK2, bigBottom, FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-walk-3', MARIO_SMALL_WALK3, bigBottomWalk3, FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-jump', MARIO_SMALL_JUMP, BIG_BOTTOM_JUMP(), FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-duck', MARIO_SMALL_STAND, BIG_BOTTOM_DUCK(), FIRE_COLORS)
  drawBigMario(scene, 'mario-fire-turn', MARIO_SMALL_TURN, bigBottom, FIRE_COLORS)
}

// 大马里奥下半身变体
function BIG_BOTTOM_WALK1(): number[][] {
  const P = 2, F = 3
  const d: number[][] = []
  for (let y = 0; y < SIZE; y++) d.push(new Array(SIZE).fill(0))
  for (let y = 0; y < 6; y++) for (let x = 3; x < 13; x++) d[y][x] = P
  // 左腿前伸
  for (let y = 6; y < 11; y++) { d[y][2] = F; d[y][3] = F; d[y][4] = F }
  for (let y = 6; y < 11; y++) { d[y][10] = F; d[y][11] = F }
  for (let x = 1; x < 6; x++) { d[11][x] = P; d[12][x] = P }
  for (let x = 9; x < 13; x++) { d[11][x] = P; d[12][x] = P }
  return d
}

function BIG_BOTTOM_WALK3(): number[][] {
  const P = 2, F = 3
  const d: number[][] = []
  for (let y = 0; y < SIZE; y++) d.push(new Array(SIZE).fill(0))
  for (let y = 0; y < 6; y++) for (let x = 3; x < 13; x++) d[y][x] = P
  for (let y = 6; y < 11; y++) { d[y][3] = F; d[y][4] = F }
  for (let y = 6; y < 11; y++) { d[y][11] = F; d[y][12] = F; d[y][13] = F }
  for (let x = 2; x < 6; x++) { d[11][x] = P; d[12][x] = P }
  for (let x = 10; x < 15; x++) { d[11][x] = P; d[12][x] = P }
  return d
}

function BIG_BOTTOM_JUMP(): number[][] {
  const P = 2, F = 3
  const d: number[][] = []
  for (let y = 0; y < SIZE; y++) d.push(new Array(SIZE).fill(0))
  for (let y = 0; y < 5; y++) for (let x = 3; x < 13; x++) d[y][x] = P
  // 腿收起
  for (let x = 3; x < 7; x++) { d[5][x] = F; d[6][x] = F }
  for (let x = 10; x < 14; x++) { d[5][x] = F; d[6][x] = F }
  for (let x = 2; x < 7; x++) d[7][x] = P
  for (let x = 10; x < 15; x++) d[7][x] = P
  return d
}

function BIG_BOTTOM_DUCK(): number[][] {
  const P = 2
  const d: number[][] = []
  for (let y = 0; y < SIZE; y++) d.push(new Array(SIZE).fill(0))
  // 蹲下时下半身很短
  for (let y = 0; y < 4; y++) for (let x = 2; x < 14; x++) d[y][x] = P
  for (let x = 2; x < 7; x++) { d[4][x] = P; d[5][x] = P }
  for (let x = 10; x < 15; x++) { d[4][x] = P; d[5][x] = P }
  return d
}
