// 超级玛丽 1-2 关卡数据（地下关卡）
// 160 列 × 15 行，瓦片 16×16 像素
// 黑色背景，低矮天花板，更多管道/坑洞/Koopa

import { LevelData } from './types'

// 辅助函数：创建空行
function emptyRow(cols: number): number[] {
  return new Array(cols).fill(0)
}

export const WORLD_1_LEVEL_2: LevelData = (() => {
  const COLS = 160
  const tiles: number[][] = []
  for (let i = 0; i < 15; i++) {
    tiles.push(emptyRow(COLS))
  }

  // ===== 地面（行13和行14）=====
  const row13 = new Array(COLS).fill(1)
  const row14 = new Array(COLS).fill(1)

  // 坑洞：地下关卡坑洞更多更宽
  // 坑洞1：列20-22（3格）
  row13[20] = 0; row13[21] = 0; row13[22] = 0
  row14[20] = 0; row14[21] = 0; row14[22] = 0
  // 坑洞2：列42-45（4格）
  for (let c = 42; c <= 45; c++) { row13[c] = 0; row14[c] = 0 }
  // 坑洞3：列70-72（3格）
  row13[70] = 0; row13[71] = 0; row13[72] = 0
  row14[70] = 0; row14[71] = 0; row14[72] = 0
  // 坑洞4：列95-99（5格，最长坑洞）
  for (let c = 95; c <= 99; c++) { row13[c] = 0; row14[c] = 0 }

  tiles[13] = row13
  tiles[14] = row14

  // ===== 天花板层（行2-3，硬砖）=====
  // 段落1：列6-25 低矮通道天花板
  for (let c = 6; c <= 25; c++) {
    tiles[2][c] = 12
    tiles[3][c] = 12
  }

  // 段落2：列66-90 迷宫通道天花板（间断）
  for (let c = 66; c <= 75; c++) tiles[3][c] = 12
  for (let c = 80; c <= 82; c++) tiles[3][c] = 12
  for (let c = 85; c <= 90; c++) tiles[3][c] = 12

  // ===== 管道区（列26-40）=====
  // 管道1（列26-27，高5格，顶到天花板）
  tiles[8][26] = 6; tiles[8][27] = 7
  tiles[9][26] = 8; tiles[9][27] = 9
  tiles[10][26] = 8; tiles[10][27] = 9
  tiles[11][26] = 8; tiles[11][27] = 9
  tiles[12][26] = 8; tiles[12][27] = 9

  // 管道2（列33-34，高4格）
  tiles[9][33] = 6; tiles[9][34] = 7
  tiles[10][33] = 8; tiles[10][34] = 9
  tiles[11][33] = 8; tiles[11][34] = 9
  tiles[12][33] = 8; tiles[12][34] = 9

  // 管道3（列38-39，高3格）
  tiles[10][38] = 6; tiles[10][39] = 7
  tiles[11][38] = 8; tiles[11][39] = 9
  tiles[12][38] = 8; tiles[12][39] = 9

  // ===== 砖块/问号组 =====

  // 低矮通道内的问号砖（行9，天花板下方）
  tiles[9][10] = 3  // 问号(金币)
  tiles[9][14] = 4  // 问号(蘑菇)
  tiles[9][18] = 3  // 问号(金币)
  tiles[9][22] = 3  // 问号(金币)

  // 开阔区砖块组（行7）
  tiles[7][48] = 2; tiles[7][49] = 3; tiles[7][50] = 2; tiles[7][51] = 4; tiles[7][52] = 2

  // 开阔区上方浮空问号（行4）
  tiles[4][50] = 3

  // 浮空平台（行9，列55-58）
  tiles[9][55] = 12; tiles[9][56] = 12; tiles[9][57] = 12; tiles[9][58] = 12

  // 迷宫通道内的砖块（行8-9）
  tiles[8][68] = 2; tiles[8][69] = 3; tiles[8][70] = 2
  tiles[9][74] = 2; tiles[9][75] = 4; tiles[9][76] = 2

  // 坑洞上方浮空平台（行10，列95-99 帮助越过坑洞）
  tiles[10][95] = 12; tiles[10][96] = 12; tiles[10][97] = 12
  tiles[10][98] = 12; tiles[10][99] = 12

  // 迷宫区砖块墙（行5-12，列83-84）
  for (let r = 5; r <= 11; r++) {
    tiles[r][83] = 2
    tiles[r][84] = 2
  }
  // 留一个洞口（行8-10，48px高，大马里奥站立可通过）
  tiles[8][83] = 0; tiles[8][84] = 0
  tiles[9][83] = 0; tiles[9][84] = 0
  tiles[10][83] = 0; tiles[10][84] = 0

  // 砖块墙前的辅助平台（行10-11，列80-82，帮助跳到洞口高度）
  tiles[10][80] = 12; tiles[10][81] = 12; tiles[10][82] = 12
  tiles[11][80] = 12; tiles[11][81] = 12; tiles[11][82] = 12

  // 更多砖块组
  tiles[7][100] = 2; tiles[7][101] = 3; tiles[7][102] = 2
  tiles[7][105] = 4; tiles[7][106] = 2; tiles[7][107] = 3

  // 密集敌人区低矮天花板
  for (let c = 108; c <= 118; c++) tiles[4][c] = 12

  // ===== 阶梯（终点前，列121-128）=====
  for (let c = 121; c <= 128; c++) tiles[12][c] = 12
  for (let c = 122; c <= 128; c++) tiles[11][c] = 12
  for (let c = 123; c <= 128; c++) tiles[10][c] = 12
  for (let c = 124; c <= 128; c++) tiles[9][c] = 12
  for (let c = 125; c <= 128; c++) tiles[8][c] = 12
  for (let c = 126; c <= 128; c++) tiles[7][c] = 12
  for (let c = 127; c <= 128; c++) tiles[6][c] = 12
  tiles[5][128] = 12

  // ===== 旗杆（列135）=====
  tiles[4][135] = 11  // 旗杆顶
  for (let r = 5; r <= 12; r++) {
    tiles[r][135] = 10  // 旗杆
  }

  // ===== 城堡（列139-142，行6-12）=====
  for (let r = 6; r <= 12; r++) {
    for (let c = 139; c <= 142; c++) {
      tiles[r][c] = 13
    }
  }

  return {
    id: '1-2',
    tiles,
    metadata: {
      enemies: [
        // 低矮通道内的 Koopa
        { type: 'koopa', x: 12, y: 12 },
        { type: 'goomba', x: 16, y: 12 },
        { type: 'koopa', x: 23, y: 12 },
        // 管道区
        { type: 'goomba', x: 30, y: 12 },
        { type: 'goomba', x: 31, y: 12 },
        // 开阔区
        { type: 'koopa', x: 47, y: 12 },
        { type: 'goomba', x: 53, y: 12 },
        { type: 'goomba', x: 54, y: 12 },
        // 坑洞前（注意坑洞3在列70-72，敌人不能在列72）
        { type: 'buzzy', x: 60, y: 12 },
        { type: 'goomba', x: 63, y: 12 },
        { type: 'goomba', x: 64, y: 12 },
        // 迷宫区
        { type: 'buzzy', x: 68, y: 12 },
        { type: 'buzzy', x: 78, y: 12 },
        { type: 'goomba', x: 85, y: 12 },
        { type: 'goomba', x: 86, y: 12 },
        // 坑洞区后
        { type: 'buzzy', x: 93, y: 12 },
        // 密集敌人区
        { type: 'goomba', x: 102, y: 12 },
        { type: 'goomba', x: 103, y: 12 },
        { type: 'koopa', x: 108, y: 12 },
        { type: 'koopa', x: 112, y: 12 },
        { type: 'goomba', x: 115, y: 12 },
        { type: 'goomba', x: 116, y: 12 },
      ],
      coins: [],
      pipes: [
        { x: 26, height: 5 },
        { x: 33, height: 4 },
        { x: 38, height: 3 },
      ],
      flagpoleX: 135,
      castleStartX: 139,
      timeLimit: 400,
      playerStartX: 3,
      playerStartY: 12,
      backgroundColor: '#000000',
    },
  }
})()
