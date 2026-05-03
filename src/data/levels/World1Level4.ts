// World 1-4: 城堡关卡（模仿原版 SMB 1-4 布局）
// 背景: 黑色，灰色石头城堡

import { LevelData } from './types'

const H = 12  // 硬砖
const B = 2   // 砖块

// prettier-ignore
export const WORLD_1_LEVEL_4: LevelData = (() => {
  const COLS = 176
  const ROWS = 15
  const tiles: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0))

  // ===== 地面和天花板（灰色石头风格）=====
  for (let c = 0; c < COLS; c++) {
    tiles[13][c] = H
    tiles[14][c] = H
    tiles[0][c] = H
  }

  // 地面缺口（岩浆坑）
  const removeGroundRange = (start: number, end: number): void => {
    for (let c = start; c <= end; c++) {
      tiles[13][c] = 0
      tiles[14][c] = 0
    }
  }
  removeGroundRange(30, 33)    // 岩浆坑1
  removeGroundRange(68, 71)    // 岩浆坑2
  removeGroundRange(115, 118)  // 岩浆坑3 (Bowser前)

  // ===== 中层平台 =====
  // 平台1（行10）
  for (let c = 14; c <= 18; c++) tiles[10][c] = H
  for (let c = 22; c <= 25; c++) tiles[8][c] = H

  // 平台2（行10）
  for (let c = 36; c <= 40; c++) tiles[10][c] = H
  for (let c = 44; c <= 47; c++) tiles[7][c] = H

  // 平台3（过岩浆坑1的高平台）
  for (let c = 27; c <= 36; c++) tiles[5][c] = H

  // 平台4
  for (let c = 52; c <= 56; c++) tiles[10][c] = H
  for (let c = 60; c <= 63; c++) tiles[8][c] = H

  // 平台5（过岩浆坑2）
  for (let c = 64; c <= 72; c++) tiles[4][c] = H

  // 平台6
  for (let c = 74; c <= 78; c++) tiles[10][c] = H
  for (let c = 82; c <= 85; c++) tiles[9][c] = H

  // 平台7
  for (let c = 90; c <= 94; c++) tiles[10][c] = H
  for (let c = 98; c <= 101; c++) tiles[7][c] = H

  // 吊桥区域前平台（行8）
  for (let c = 105; c <= 112; c++) tiles[8][c] = H

  // ===== 问题砖和砖块 =====
  tiles[9][15] = B; tiles[9][16] = B
  tiles[9][38] = 3; tiles[9][53] = B
  tiles[9][75] = B; tiles[9][91] = 3
  tiles[9][99] = 4; tiles[9][107] = B

  // ===== 吊桥（可破坏砖块，列120-128，行8-9）=====
  for (let c = 120; c <= 128; c++) {
    tiles[8][c] = B
    tiles[9][c] = B
  }

  // ===== 斧头区域（列132，行7-8）=====
  // 用旗杆表示斧头机关
  tiles[7][132] = 11  // 斧头顶
  for (let r = 8; r <= 12; r++) tiles[r][132] = 10

  // ===== 通关旗杆和城堡 =====
  tiles[4][145] = 11
  for (let r = 5; r <= 12; r++) tiles[r][145] = 10
  for (let r = 6; r <= 12; r++) {
    for (let c = 149; c <= 152; c++) tiles[r][c] = 13
  }

  return {
    id: '1-4',
    tiles,
    metadata: {
      enemies: [
        { type: 'goomba', x: 6, y: 12 },
        { type: 'goomba', x: 10, y: 12 },
        { type: 'goomba', x: 16, y: 9 },
        { type: 'koopa', x: 24, y: 4 },
        { type: 'goomba', x: 37, y: 12 },
        { type: 'goomba', x: 46, y: 6 },
        { type: 'koopa', x: 54, y: 9 },
        { type: 'goomba', x: 62, y: 3 },
        { type: 'hammer', x: 76, y: 9 },
        { type: 'goomba', x: 84, y: 8 },
        { type: 'koopa', x: 93, y: 12 },
        { type: 'goomba', x: 100, y: 6 },
        { type: 'goomba', x: 108, y: 12 },
        { type: 'bowser', x: 125, y: 7 },
      ],
      coins: [],
      pipes: [],
      flagpoleX: 145,
      castleStartX: 149,
      timeLimit: 400,
      playerStartX: 3,
      playerStartY: 12,
      backgroundColor: '#181818',
    },
  }
})()
