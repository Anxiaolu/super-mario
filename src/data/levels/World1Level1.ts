// 超级玛丽 1-1 关卡数据
// 224 列 × 15 行，瓦片 16×16 像素
// 行 0=最上，14=最下；列 0=最左

import { LevelData } from './types'

// 瓦片 ID 说明：
// 0=空, 1=地面, 2=砖块, 3=问号(金币), 4=问号(蘑菇), 5=已使用砖块
// 6=管道左上, 7=管道右上, 8=管道左下, 9=管道右下
// 10=旗杆, 11=旗杆顶, 12=硬砖, 13=城堡

// 辅助函数：创建空行
function emptyRow(): number[] {
  return new Array(224).fill(0)
}

// 辅助函数：创建地面行（行13和行14都有地面，除了坑洞）
function groundRows(): { row13: number[]; row14: number[] } {
  const row13 = new Array(224).fill(1)
  const row14 = new Array(224).fill(1)

  // 坑洞1：列69-70
  row13[69] = 0; row13[70] = 0
  row14[69] = 0; row14[70] = 0

  // 坑洞2：列86-88
  row13[86] = 0; row13[87] = 0; row13[88] = 0
  row14[86] = 0; row14[87] = 0; row14[88] = 0

  return { row13, row14 }
}

export const WORLD_1_LEVEL_1: LevelData = (() => {
  // 初始化 15 行，每行 224 列
  const tiles: number[][] = []
  for (let i = 0; i < 15; i++) {
    tiles.push(emptyRow())
  }

  // ===== 地面（行13和行14）=====
  const { row13, row14 } = groundRows()
  tiles[13] = row13
  tiles[14] = row14

  // ===== 第一个问号砖/砖块组（列16-23）=====
  // 行9: 砖 问号(金币) 砖 问号(蘑菇) 砖 问号(金币) 砖 问号(金币)
  tiles[9][16] = 2  // 砖块
  tiles[9][17] = 3  // 问号(金币)
  tiles[9][18] = 2  // 砖块
  tiles[9][19] = 4  // 问号(蘑菇)
  tiles[9][20] = 2  // 砖块
  tiles[9][21] = 3  // 问号(金币)
  tiles[9][22] = 2  // 砖块
  tiles[9][23] = 3  // 问号(金币)
  // 行5: 列22 问号(金币)
  tiles[5][22] = 3

  // ===== 管道1（列28-29，高2格）=====
  tiles[11][28] = 6; tiles[11][29] = 7
  tiles[12][28] = 8; tiles[12][29] = 9

  // ===== 管道2（列38-39，高3格）=====
  tiles[10][38] = 6; tiles[10][39] = 7
  tiles[11][38] = 8; tiles[11][39] = 9
  tiles[12][38] = 8; tiles[12][39] = 9

  // ===== 管道3（列46-47，高4格）=====
  tiles[9][46] = 6; tiles[9][47] = 7
  tiles[10][46] = 8; tiles[10][47] = 9
  tiles[11][46] = 8; tiles[11][47] = 9
  tiles[12][46] = 8; tiles[12][47] = 9

  // ===== 管道4（列57-58，高4格）=====
  tiles[9][57] = 6; tiles[9][58] = 7
  tiles[10][57] = 8; tiles[10][58] = 9
  tiles[11][57] = 8; tiles[11][58] = 9
  tiles[12][57] = 8; tiles[12][58] = 9

  // ===== 列64-66 浮空砖块/问号组 =====
  // 行5: 砖 砖 砖
  tiles[5][64] = 2; tiles[5][65] = 2; tiles[5][66] = 2
  // 行9: 砖 问号(金币) 砖
  tiles[9][64] = 2; tiles[9][65] = 3; tiles[9][66] = 2

  // ===== 列77-79 砖块组 =====
  // 行5: 砖 问号(蘑菇) 砖
  tiles[5][77] = 2; tiles[5][78] = 4; tiles[5][79] = 2
  // 行9: 砖 砖 砖
  tiles[9][77] = 2; tiles[9][78] = 2; tiles[9][79] = 2

  // ===== 列80 问号(金币) =====
  tiles[5][80] = 3

  // ===== 阶梯1（列91-94，4级台阶）=====
  // 行12: 硬砖 硬砖 硬砖 硬砖
  // 行11: 0 硬砖 硬砖 硬砖
  // 行10: 0 0 硬砖 硬砖
  // 行9: 0 0 0 硬砖
  tiles[12][91] = 12; tiles[12][92] = 12; tiles[12][93] = 12; tiles[12][94] = 12
  tiles[11][92] = 12; tiles[11][93] = 12; tiles[11][94] = 12
  tiles[10][93] = 12; tiles[10][94] = 12
  tiles[9][94] = 12

  // ===== 阶梯2（列100-104，4级台阶）=====
  tiles[12][100] = 12; tiles[12][101] = 12; tiles[12][102] = 12; tiles[12][103] = 12
  tiles[11][101] = 12; tiles[11][102] = 12; tiles[11][103] = 12
  tiles[10][102] = 12; tiles[10][103] = 12
  tiles[9][103] = 12

  // ===== 列107-108 砖块/问号 =====
  tiles[5][107] = 2; tiles[5][108] = 3

  // ===== 列110-114 砖块/问号组 =====
  tiles[9][110] = 2; tiles[9][111] = 3; tiles[9][112] = 2

  // ===== 列118-120 砖块组 =====
  tiles[5][118] = 2; tiles[5][119] = 4; tiles[5][120] = 2

  // ===== 列124-125 问号(金币) =====
  tiles[9][124] = 3; tiles[9][125] = 3

  // ===== 阶梯3（终点前大阶梯，列134-141）=====
  // 从1级到8级递增
  // 行12层: 列134-141 全部有
  for (let c = 134; c <= 141; c++) tiles[12][c] = 12
  // 行11层: 列135-141
  for (let c = 135; c <= 141; c++) tiles[11][c] = 12
  // 行10层: 列136-141
  for (let c = 136; c <= 141; c++) tiles[10][c] = 12
  // 行9层: 列137-141
  for (let c = 137; c <= 141; c++) tiles[9][c] = 12
  // 行8层: 列138-141
  for (let c = 138; c <= 141; c++) tiles[8][c] = 12
  // 行7层: 列139-141
  for (let c = 139; c <= 141; c++) tiles[7][c] = 12
  // 行6层: 列140-141
  for (let c = 140; c <= 141; c++) tiles[6][c] = 12
  // 行5层: 列141
  tiles[5][141] = 12

  // ===== 旗杆（列148）=====
  tiles[4][148] = 11  // 旗杆顶
  for (let r = 5; r <= 12; r++) {
    tiles[r][148] = 10  // 旗杆
  }

  // ===== 城堡（列152-155，行6-12）=====
  for (let r = 6; r <= 12; r++) {
    for (let c = 152; c <= 155; c++) {
      tiles[r][c] = 13
    }
  }

  return {
    id: '1-1',
    tiles,
    metadata: {
      enemies: [
        { type: 'goomba', x: 22, y: 12 },
        { type: 'goomba', x: 40, y: 12 },
        { type: 'goomba', x: 51, y: 12 },
        { type: 'goomba', x: 52, y: 12 },
        { type: 'koopa', x: 80, y: 12 },
        { type: 'goomba', x: 97, y: 12 },
        { type: 'goomba', x: 98, y: 12 },
        { type: 'goomba', x: 114, y: 12 },
        { type: 'goomba', x: 115, y: 12 },
        { type: 'goomba', x: 124, y: 12 },
        { type: 'goomba', x: 125, y: 12 },
        { type: 'goomba', x: 128, y: 12 },
        { type: 'goomba', x: 129, y: 12 },
        { type: 'goomba', x: 174, y: 12 },
        { type: 'piranha', x: 46, y: 11 },
        { type: 'piranha', x: 57, y: 11 },
      ],
      coins: [],
      pipes: [
        { x: 28, height: 2 },
        { x: 38, height: 3 },
        { x: 46, height: 4 },
        { x: 57, height: 4 },
      ],
      flagpoleX: 148,
      castleStartX: 152,
      timeLimit: 400,
      playerStartX: 3,
      playerStartY: 12,
    },
  }
})()
