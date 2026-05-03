/**
 * 生成特效纹理
 * 碎砖块碎片、得分文字
 */

import * as Phaser from 'phaser'
import { createCanvas } from './utils'

/** 砖块棕色 */
const BRICK_BROWN = '#C84C0C'
/** 砖块棕橙色 */
const BRICK_ORANGE = '#D88000'

export function generateEffectTextures(scene: Phaser.Scene): void {
  generateBrickDebris1(scene)
  generateBrickDebris2(scene)
  generateScoreText(scene, 'score-100', '100', 24)
  generateScoreText(scene, 'score-200', '200', 24)
  generateScoreText(scene, 'score-1000', '1000', 32)
  generateScoreText(scene, 'score-2000', '2000', 32)
}

/** 碎砖块碎片1 - 棕色 */
function generateBrickDebris1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'brick-debris-1', 8, 8)
  const ctx = ct.getContext()

  // 不规则碎片形状
  ctx.fillStyle = BRICK_BROWN
  ctx.fillRect(1, 0, 6, 2)
  ctx.fillRect(0, 2, 8, 3)
  ctx.fillRect(1, 5, 7, 2)
  ctx.fillRect(2, 7, 4, 1)

  // 深色纹理线
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 2, 8, 1)
  ctx.fillRect(4, 5, 1, 2)

  ct.update()
}

/** 碎砖块碎片2 - 棕橙色 */
function generateBrickDebris2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'brick-debris-2', 8, 8)
  const ctx = ct.getContext()

  // 不规则碎片形状（与碎片1镜像）
  ctx.fillStyle = BRICK_ORANGE
  ctx.fillRect(1, 0, 6, 2)
  ctx.fillRect(0, 2, 8, 3)
  ctx.fillRect(0, 5, 7, 2)
  ctx.fillRect(2, 7, 4, 1)

  // 深色纹理线
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 2, 8, 1)
  ctx.fillRect(3, 5, 1, 2)

  ct.update()
}

/** 得分文字纹理 */
function generateScoreText(scene: Phaser.Scene, key: string, text: string, width: number): void {
  const ct = createCanvas(scene, key, width, 8)
  const ctx = ct.getContext()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 8px monospace'
  ctx.textBaseline = 'top'
  ctx.fillText(text, 2, 0)
  ct.update()
}
