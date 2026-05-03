/**
 * 生成道具纹理
 * 金币、蘑菇、星星、火焰花、火球
 */

import * as Phaser from 'phaser'
import { createCanvas } from './utils'

/** 金黄色 */
const GOLD = '#FAC000'
/** 红帽色 */
const RED_CAP = '#B13425'
/** 白色 */
const WHITE = '#FCF8FC'
/** 绿色 */
const GREEN = '#00A800'
/** 橙色 */
const ORANGE = '#D88000'

export function generateItemTextures(scene: Phaser.Scene): void {
  generateCoinFrames(scene)
  generateMushroomRed(scene)
  generateMushroomGreen(scene)
  generateStarFrames(scene)
  generateFlower(scene)
  generateFireball(scene)
  generatePiranhaPlant(scene)
  generateFlag(scene)
  generateHammer(scene)
}

/** 金币旋转4帧（8x16） */
function generateCoinFrames(scene: Phaser.Scene): void {
  // 4帧宽度分别为 6, 2, 4, 2，模拟旋转效果
  const widths = [6, 2, 4, 2]

  for (let i = 0; i < 4; i++) {
    const ct = createCanvas(scene, `coin-${i + 1}`, 8, 16)
    const ctx = ct.getContext()
    const w = widths[i]
    const x = Math.floor((8 - w) / 2)

    // 金币主体
    ctx.fillStyle = GOLD
    ctx.fillRect(x, 2, w, 12)

    // 边缘高光（较宽的帧才绘制）
    if (w >= 4) {
      ctx.fillStyle = '#FCE060'
      ctx.fillRect(x, 2, 1, 12)
    }

    // 边缘阴影
    if (w >= 4) {
      ctx.fillStyle = '#C89800'
      ctx.fillRect(x + w - 1, 2, 1, 12)
    }

    // 上下边缘
    ctx.fillStyle = '#C89800'
    ctx.fillRect(x, 1, w, 1)
    ctx.fillRect(x, 14, w, 1)

    ct.update()
  }
}

/** 超级蘑菇（16x16）- 红帽白点 */
function generateMushroomRed(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'mushroom-red', 16, 16)
  const ctx = ct.getContext()

  // 蘑菇帽 - 红色上半圆
  ctx.fillStyle = RED_CAP
  ctx.fillRect(2, 0, 12, 8)
  ctx.fillRect(1, 2, 14, 4)

  // 白色斑点
  ctx.fillStyle = WHITE
  ctx.fillRect(3, 2, 3, 3)
  ctx.fillRect(10, 2, 3, 3)
  ctx.fillRect(6, 1, 4, 3)

  // 帽檐阴影
  ctx.fillStyle = '#801810'
  ctx.fillRect(2, 7, 12, 1)

  // 蘑菇柄 - 白色
  ctx.fillStyle = WHITE
  ctx.fillRect(4, 8, 8, 5)

  // 眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(5, 9, 2, 2)
  ctx.fillRect(9, 9, 2, 2)

  // 脚
  ctx.fillStyle = RED_CAP
  ctx.fillRect(3, 13, 4, 3)
  ctx.fillRect(9, 13, 4, 3)

  ct.update()
}

/** 1UP蘑菇（16x16）- 绿帽白点 */
function generateMushroomGreen(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'mushroom-green', 16, 16)
  const ctx = ct.getContext()

  // 蘑菇帽 - 绿色上半圆
  ctx.fillStyle = GREEN
  ctx.fillRect(2, 0, 12, 8)
  ctx.fillRect(1, 2, 14, 4)

  // 白色斑点
  ctx.fillStyle = WHITE
  ctx.fillRect(3, 2, 3, 3)
  ctx.fillRect(10, 2, 3, 3)
  ctx.fillRect(6, 1, 4, 3)

  // 帽檐阴影
  ctx.fillStyle = '#005800'
  ctx.fillRect(2, 7, 12, 1)

  // 蘑菇柄
  ctx.fillStyle = WHITE
  ctx.fillRect(4, 8, 8, 5)

  // 眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(5, 9, 2, 2)
  ctx.fillRect(9, 9, 2, 2)

  // 脚
  ctx.fillStyle = GREEN
  ctx.fillRect(3, 13, 4, 3)
  ctx.fillRect(9, 13, 4, 3)

  ct.update()
}

/** 星星旋转4帧（16x16）- 黄色五角星 */
function generateStarFrames(scene: Phaser.Scene): void {
  // 4帧通过旋转偏移实现简单动画
  const rotations = [0, 1, 2, 1]

  for (let frame = 0; frame < 4; frame++) {
    const ct = createCanvas(scene, `star-${frame + 1}`, 16, 16)
    const ctx = ct.getContext()
    const offset = rotations[frame]

    // 五角星 - 用像素块近似绘制
    // 中心点 (8, 8)，半径约 7
    ctx.fillStyle = GOLD

    // 上尖
    ctx.fillRect(7 - offset, 0, 2 + offset, 5)
    // 右上尖
    ctx.fillRect(11, 3 - offset, 4, 2 + offset)
    // 右下尖
    ctx.fillRect(10, 8, 4, 2)
    // 下左尖
    ctx.fillRect(3, 10 + offset, 3, 2)
    // 下右尖
    ctx.fillRect(10, 10 + offset, 3, 2)
    // 左下尖
    ctx.fillRect(1, 8, 4, 2)
    // 左上尖
    ctx.fillRect(1, 3 - offset, 4, 2 + offset)

    // 中心填充
    ctx.fillRect(5, 4, 6, 7)
    ctx.fillRect(4, 5, 8, 5)

    // 眼睛（让星星有表情）
    ctx.fillStyle = '#000000'
    ctx.fillRect(6, 7, 1, 1)
    ctx.fillRect(9, 7, 1, 1)

    ct.update()
  }
}

/** 火焰花（16x16）- 橙红绿配色 */
function generateFlower(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'flower', 16, 16)
  const ctx = ct.getContext()

  // 茎 - 绿色
  ctx.fillStyle = GREEN
  ctx.fillRect(7, 8, 2, 6)
  // 叶子
  ctx.fillRect(4, 9, 3, 2)
  ctx.fillRect(9, 10, 3, 2)

  // 花瓣 - 橙红色，四瓣
  ctx.fillStyle = ORANGE
  // 上瓣
  ctx.fillRect(6, 1, 4, 4)
  // 下瓣
  ctx.fillRect(6, 7, 4, 3)
  // 左瓣
  ctx.fillRect(2, 4, 4, 4)
  // 右瓣
  ctx.fillRect(10, 4, 4, 4)

  // 花瓣深色边缘
  ctx.fillStyle = RED_CAP
  ctx.fillRect(6, 1, 4, 1)
  ctx.fillRect(6, 9, 4, 1)
  ctx.fillRect(2, 4, 1, 4)
  ctx.fillRect(13, 4, 1, 4)

  // 花心 - 黄色
  ctx.fillStyle = GOLD
  ctx.fillRect(6, 4, 4, 3)

  // 底部
  ctx.fillStyle = GREEN
  ctx.fillRect(6, 14, 4, 2)

  ct.update()
}

/** 火球（8x8）- 橙红 */
function generateFireball(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'fireball', 8, 8)
  const ctx = ct.getContext()

  // 外圈 - 红色
  ctx.fillStyle = RED_CAP
  ctx.fillRect(2, 0, 4, 8)
  ctx.fillRect(0, 2, 8, 4)

  // 内圈 - 橙色
  ctx.fillStyle = ORANGE
  ctx.fillRect(2, 1, 4, 6)
  ctx.fillRect(1, 2, 6, 4)

  // 核心 - 黄色高光
  ctx.fillStyle = GOLD
  ctx.fillRect(3, 3, 2, 2)

  ct.update()
}

/** 食人花（16x16x2 帧，红绿配色张嘴动画） */
function generatePiranhaPlant(scene: Phaser.Scene): void {
  const RED = '#D84040'
  const GREEN = '#40A840'
  const WHITE = '#F8F8F8'

  for (let frame = 1; frame <= 2; frame++) {
    const ct = createCanvas(scene, `piranha-plant-${frame}`, 16, 16)
    const ctx = ct.getContext()

    // 茎（绿色）
    ctx.fillStyle = GREEN
    ctx.fillRect(6, 8, 4, 8)

    // 头部（红色圆球）
    ctx.fillStyle = RED
    ctx.fillRect(2, 0, 12, 10)
    ctx.fillRect(1, 2, 14, 6)
    ctx.fillRect(3, 8, 10, 3)

    // 白色斑点
    ctx.fillStyle = WHITE
    ctx.fillRect(3, 3, 2, 2)
    ctx.fillRect(10, 3, 2, 2)

    // 嘴（frame 1 微张，frame 2 张更大）
    ctx.fillStyle = '#000000'
    const mouthHeight = frame === 1 ? 2 : 3
    ctx.fillRect(3, 7, 10, mouthHeight)

    // 嘴唇白色边框
    ctx.fillStyle = WHITE
    ctx.fillRect(3, 6, 10, 1)

    ct.update()
  }
}

/** 绿色旗帜（8x8） */
function generateFlag(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'flag', 8, 12)
  const ctx = ct.getContext()

  // 绿色旗面
  ctx.fillStyle = '#40C840'
  ctx.fillRect(0, 0, 8, 7)

  // 白色圆形图案
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(2, 1, 4, 2)
  ctx.fillRect(1, 2, 6, 1)
  ctx.fillRect(2, 3, 4, 2)

  // 旗杆（灰色）
  ctx.fillStyle = '#888888'
  ctx.fillRect(0, 7, 1, 5)

  ct.update()
}

/** 锤子（8x8 灰色） */
function generateHammer(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'hammer', 8, 8)
  const ctx = ct.getContext()

  // 锤头（灰色）
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 8, 4)

  // 锤头高光
  ctx.fillStyle = '#A0A0A0'
  ctx.fillRect(0, 0, 3, 2)

  // 锤柄（棕色）
  ctx.fillStyle = '#886030'
  ctx.fillRect(3, 4, 2, 4)

  ct.update()
}
