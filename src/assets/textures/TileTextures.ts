import * as Phaser from 'phaser'
import { createCanvas } from './utils'

const TILE_SIZE = 16

/**
 * 生成所有地形瓦片纹理
 * 每个瓦片 16x16 像素
 */
export function generateTileTextures(scene: Phaser.Scene): void {
  generateGroundTile(scene)
  generateBrickTile(scene)
  generateQuestionTiles(scene)
  generateUsedTile(scene)
  generateHardTile(scene)
  generatePipeTiles(scene)
  generateFlagpoleTiles(scene)
  generateCastleTile(scene)
}

/** 地面砖块 - 棕橙色填充，砖缝纹理 */
function generateGroundTile(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  // 填充
  g.fillStyle(0xC84C0C)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 描边外框
  g.lineStyle(1, 0x000000)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 水平砖缝线（中间偏上和偏下各一条）
  g.lineStyle(1, 0x000000)
  g.moveTo(0, 4)
  g.lineTo(TILE_SIZE, 4)
  g.moveTo(0, 12)
  g.lineTo(TILE_SIZE, 12)
  // 垂直砖缝线（交错排列）
  g.moveTo(4, 0)
  g.lineTo(4, 4)
  g.moveTo(12, 4)
  g.lineTo(12, 8)
  g.moveTo(4, 8)
  g.lineTo(4, 12)
  g.moveTo(12, 12)
  g.lineTo(12, TILE_SIZE)
  g.generateTexture('tile-ground', TILE_SIZE, TILE_SIZE)
  g.destroy()
}

/** 可破坏砖块 - 深橙色填充，砖缝纹理 */
function generateBrickTile(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  g.fillStyle(0xD88000)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(1, 0x000000)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 水平砖缝线
  g.moveTo(0, 4)
  g.lineTo(TILE_SIZE, 4)
  g.moveTo(0, 12)
  g.lineTo(TILE_SIZE, 12)
  // 垂直砖缝线（交错排列）
  g.moveTo(4, 0)
  g.lineTo(4, 4)
  g.moveTo(12, 4)
  g.lineTo(12, 8)
  g.moveTo(4, 8)
  g.lineTo(4, 12)
  g.moveTo(12, 12)
  g.lineTo(12, TILE_SIZE)
  g.generateTexture('tile-brick', TILE_SIZE, TILE_SIZE)
  g.destroy()
}

/** 问号砖 - 3帧动画，黄色背景，中央白色 "?" */
function generateQuestionTiles(scene: Phaser.Scene): void {
  const keys = ['tile-question-1', 'tile-question-2', 'tile-question-3']
  // 3帧中 ? 的位置/大小略有不同以产生闪烁效果
  const questionOffsets: Array<{ x: number; y: number; size: string }> = [
    { x: 4, y: 11, size: '10px' },
    { x: 3, y: 10, size: '12px' },
    { x: 5, y: 12, size: '9px' },
  ]

  for (let i = 0; i < keys.length; i++) {
    const ct = createCanvas(scene, keys[i], TILE_SIZE, TILE_SIZE)
    const ctx = ct.getContext()
    // 黄色背景
    ctx.fillStyle = '#FAC000'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    // 黑色描边
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
    // 白色 "?" 字符
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `${questionOffsets[i].size} monospace`
    ctx.fillText('?', questionOffsets[i].x, questionOffsets[i].y)
    ct.update()
  }
}

/** 已使用砖块 - 暗棕色填充，十字纹理 */
function generateUsedTile(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  g.fillStyle(0x885418)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(1, 0x000000)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 十字纹理
  g.lineStyle(1, 0x000000)
  g.moveTo(8, 0)
  g.lineTo(8, TILE_SIZE)
  g.moveTo(0, 8)
  g.lineTo(TILE_SIZE, 8)
  g.generateTexture('tile-used', TILE_SIZE, TILE_SIZE)
  g.destroy()
}

/** 硬砖 - 灰色填充，金属质感 */
function generateHardTile(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  g.fillStyle(0xBCBCBC)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(1, 0x000000)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 金属质感纹理：对角线
  g.lineStyle(1, 0x888888)
  g.moveTo(0, 4)
  g.lineTo(TILE_SIZE, 4)
  g.moveTo(0, 12)
  g.lineTo(TILE_SIZE, 12)
  g.generateTexture('tile-hard', TILE_SIZE, TILE_SIZE)
  g.destroy()
}

/** 管道瓦片 - 上部（左上+右上）和身部（左下+右下） */
function generatePipeTiles(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  // 管道左上 - 有顶部边缘
  g.fillStyle(0x80D010)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 深绿边框
  g.lineStyle(2, 0x005800)
  g.strokeRect(0, 2, TILE_SIZE, TILE_SIZE - 2)
  // 顶部边缘
  g.lineStyle(2, 0x005800)
  g.moveTo(0, 0)
  g.lineTo(TILE_SIZE, 0)
  g.generateTexture('tile-pipe-tl', TILE_SIZE, TILE_SIZE)

  // 管道右上 - 有顶部边缘
  g.clear()
  g.fillStyle(0x80D010)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(2, 0x005800)
  g.strokeRect(0, 2, TILE_SIZE, TILE_SIZE - 2)
  g.lineStyle(2, 0x005800)
  g.moveTo(0, 0)
  g.lineTo(TILE_SIZE, 0)
  g.generateTexture('tile-pipe-tr', TILE_SIZE, TILE_SIZE)

  // 管道左下 - 管道身，无顶部边缘
  g.clear()
  g.fillStyle(0x80D010)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(2, 0x005800)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.generateTexture('tile-pipe-bl', TILE_SIZE, TILE_SIZE)

  // 管道右下 - 管道身，无顶部边缘
  g.clear()
  g.fillStyle(0x80D010)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(2, 0x005800)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.generateTexture('tile-pipe-br', TILE_SIZE, TILE_SIZE)

  g.destroy()
}

/** 旗杆和旗杆顶 */
function generateFlagpoleTiles(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  // 旗杆 - 灰色细竖条
  g.fillStyle(0xBCBCBC)
  g.fillRect(7, 0, 2, TILE_SIZE)
  g.lineStyle(1, 0x000000)
  g.moveTo(7, 0)
  g.lineTo(7, TILE_SIZE)
  g.moveTo(9, 0)
  g.lineTo(9, TILE_SIZE)
  g.generateTexture('tile-flagpole', TILE_SIZE, TILE_SIZE)

  // 旗杆顶 - 灰色底座 + 绿色小球
  g.clear()
  g.fillStyle(0xBCBCBC)
  g.fillRect(5, 4, 6, TILE_SIZE - 4)
  // 绿色小球
  g.fillStyle(0x00A800)
  g.fillCircle(8, 4, 4)
  g.lineStyle(1, 0x000000)
  g.strokeCircle(8, 4, 4)
  g.generateTexture('tile-flagpole-top', TILE_SIZE, TILE_SIZE)

  g.destroy()
}

/** 城堡砖块 - 灰色填充，深灰砖缝 */
function generateCastleTile(scene: Phaser.Scene): void {
  const g = scene.add.graphics()
  g.fillStyle(0xBCBCBC)
  g.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  g.lineStyle(1, 0x000000)
  g.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
  // 深灰砖缝
  g.lineStyle(1, 0x7C7C7C)
  g.moveTo(0, 4)
  g.lineTo(TILE_SIZE, 4)
  g.moveTo(0, 12)
  g.lineTo(TILE_SIZE, 12)
  g.moveTo(4, 0)
  g.lineTo(4, 4)
  g.moveTo(12, 4)
  g.lineTo(12, 8)
  g.moveTo(4, 8)
  g.lineTo(4, 12)
  g.moveTo(12, 12)
  g.lineTo(12, TILE_SIZE)
  g.generateTexture('tile-castle', TILE_SIZE, TILE_SIZE)
  g.destroy()
}
