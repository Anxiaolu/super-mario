// World 1-3: 树顶关卡（模仿原版 SMB 1-3 布局）
// 背景: 白色天空，Mario在树冠间跳跃

import { LevelData } from './types'

const G = 1   // 地面
const H = 12  // 硬砖（不可破坏）
const B = 2   // 砖块

// prettier-ignore
export const WORLD_1_3: LevelData = (() => {
  const COLS = 192
  const ROWS = 15
  const tiles: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0))

  // ===== 地面层（有间断）=====
  for (let c = 0; c < COLS; c++) {
    // 地面段1: 列0-16
    if (c <= 16) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段2: 列20-35
    else if (c >= 20 && c <= 35) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段3: 列39-55
    else if (c >= 39 && c <= 55) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段4: 列59-75
    else if (c >= 59 && c <= 75) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段5: 列79-95
    else if (c >= 79 && c <= 95) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段6: 列99-115
    else if (c >= 99 && c <= 115) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段7: 列119-135
    else if (c >= 119 && c <= 135) { tiles[13][c] = G; tiles[14][c] = G }
    // 地面段8: 列139-192
    else if (c >= 139) { tiles[13][c] = G; tiles[14][c] = G }
  }

  // ===== 树冠平台（行6-9）=====
  const platforms = [
    [3, 7], [10, 14],        // 平台组1
    [18, 22], [26, 30],       // 平台组2
    [34, 38], [42, 46],       // 平台组3
    [50, 54], [58, 62],       // 平台组4
    [66, 70], [74, 78],       // 平台组5
    [82, 86], [90, 94],       // 平台组6
    [98, 102], [106, 110],    // 平台组7
    [114, 118], [122, 126],   // 平台组8
    [130, 134], [138, 142],   // 平台组9
    [146, 150],               // 平台组10
  ]

  for (const [start, end] of platforms) {
    for (let c = start; c <= end; c++) {
      // 平台高度交替变化
      const row = c % 4 < 2 ? 6 : 8
      tiles[row][c] = H
      tiles[row + 1][c] = H
    }
  }

  // ===== 高位小平台（行3-4）=====
  const highPlatforms = [
    [7, 8], [22, 23], [40, 41], [58, 59],
    [76, 77], [94, 95], [112, 113], [130, 131],
  ]
  for (const [start, end] of highPlatforms) {
    for (let c = start; c <= end; c++) {
      tiles[3][c] = H
      tiles[4][c] = H
    }
  }

  // ===== 阶梯平台（行10-11，从地面跳到树冠的中转）=====
  const steppingStones: [number, number][] = [
    [1, 3], [14, 16],      // 地面段1
    [20, 22], [33, 35],    // 地面段2
    [39, 41], [53, 55],    // 地面段3
    [59, 61], [73, 75],    // 地面段4
    [79, 81], [93, 95],    // 地面段5
    [99, 101], [113, 115], // 地面段6
    [119, 121], [133, 135],// 地面段7
    [141, 143],            // 地面段8
  ]
  for (const [start, end] of steppingStones) {
    for (let c = start; c <= end; c++) {
      tiles[10][c] = H
      tiles[11][c] = H
    }
  }

  // ===== 问题砖和砖块 =====
  // 砖块组1
  tiles[9][10] = B; tiles[9][11] = B
  tiles[9][26] = 3; tiles[9][27] = B
  tiles[9][42] = B; tiles[9][43] = B
  tiles[9][58] = 3; tiles[9][59] = 3
  tiles[9][74] = B; tiles[9][75] = B
  tiles[9][90] = 4; tiles[9][106] = 3
  tiles[9][122] = B; tiles[9][123] = B

  // ===== 阶梯到旗杆（列155-162）=====
  for (let step = 0; step < 8; step++) {
    for (let r = 13 - step; r <= 14; r++) {
      tiles[r][155 + step] = H
    }
  }

  // ===== 旗杆（列168）=====
  tiles[4][168] = 11
  for (let r = 5; r <= 12; r++) tiles[r][168] = 10

  // ===== 城堡（列172-175，行6-12）=====
  for (let r = 6; r <= 12; r++) {
    for (let c = 172; c <= 175; c++) tiles[r][c] = 13
  }

  return {
    id: '1-3',
    tiles,
    metadata: {
      enemies: [
        { type: 'goomba', x: 11, y: 12 },
        { type: 'goomba', x: 15, y: 5 },
        { type: 'goomba', x: 28, y: 12 },
        { type: 'hammer', x: 35, y: 5 },
        { type: 'goomba', x: 43, y: 12 },
        { type: 'goomba', x: 53, y: 7 },
        { type: 'goomba', x: 62, y: 12 },
        { type: 'koopa', x: 70, y: 7 },
        { type: 'goomba', x: 83, y: 12 },
        { type: 'goomba', x: 92, y: 7 },
        { type: 'goomba', x: 101, y: 12 },
        { type: 'koopa', x: 110, y: 7 },
        { type: 'goomba', x: 120, y: 12 },
        { type: 'goomba', x: 132, y: 7 },
        { type: 'goomba', x: 148, y: 12 },
      ],
      coins: [],
      pipes: [],
      flagpoleX: 168,
      castleStartX: 172,
      timeLimit: 300,
      playerStartX: 3,
      playerStartY: 12,
      backgroundColor: '#FCFCFC',
    },
  }
})()
