/**
 * 生成敌人角色纹理
 * 使用 CanvasTexture 逐像素绘制，16x16 像素
 */

import * as Phaser from 'phaser'
import { createCanvas } from './utils'

/** 蘑菇怪棕 */
const GOOMBA_BROWN = '#C84C0C'
/** 蘑菇怪深棕 */
const GOOMBA_DARK = '#A03800'
/** 蘑菇怪浅色脚 */
const GOOMBA_FOOT = '#FCBCB0'
/** 乌龟深绿 */
const KOOPA_DARK_GREEN = '#005800'
/** 龟壳亮绿 */
const SHELL_GREEN = '#80D010'
/** 乌龟皮肤 */
const KOOPA_SKIN = '#FCA044'

const SIZE = 16

export function generateEnemyTextures(scene: Phaser.Scene): void {
  generateGoomba1(scene)
  generateGoomba2(scene)
  generateGoombaFlat(scene)
  generateKoopa1(scene)
  generateKoopa2(scene)
  generateShell(scene)
  generateBuzzyWalk1(scene)
  generateBuzzyWalk2(scene)
  generateBuzzyShell(scene)
  generateBowser1(scene)
  generateBowser2(scene)
  generateHammerBro1(scene)
  generateHammerBro2(scene)
}

/** 蘑菇怪行走帧1 - 棕色蘑菇形，左脚前 */
function generateGoomba1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'goomba-1', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头部（蘑菇伞盖）- 棕色半圆，占上半部
  ctx.fillStyle = GOOMBA_BROWN
  ctx.fillRect(3, 0, 10, 7)
  ctx.fillRect(2, 2, 12, 5)

  // 眼睛 - 白底黑瞳
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(4, 3, 3, 3)
  ctx.fillRect(9, 3, 3, 3)
  ctx.fillStyle = '#000000'
  ctx.fillRect(5, 4, 2, 2)
  ctx.fillRect(10, 4, 2, 2)

  // 身体 - 深棕
  ctx.fillStyle = GOOMBA_DARK
  ctx.fillRect(4, 7, 8, 4)

  // 脚 - 浅色，帧1左脚向前
  ctx.fillStyle = GOOMBA_FOOT
  ctx.fillRect(2, 11, 5, 3)
  ctx.fillRect(9, 11, 5, 3)

  // 脚底阴影
  ctx.fillStyle = GOOMBA_DARK
  ctx.fillRect(2, 14, 5, 2)
  ctx.fillRect(9, 14, 5, 2)

  ct.update()
}

/** 蘑菇怪行走帧2 - 右脚前 */
function generateGoomba2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'goomba-2', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头部（蘑菇伞盖）
  ctx.fillStyle = GOOMBA_BROWN
  ctx.fillRect(3, 0, 10, 7)
  ctx.fillRect(2, 2, 12, 5)

  // 眼睛
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(4, 3, 3, 3)
  ctx.fillRect(9, 3, 3, 3)
  ctx.fillStyle = '#000000'
  ctx.fillRect(5, 4, 2, 2)
  ctx.fillRect(10, 4, 2, 2)

  // 身体
  ctx.fillStyle = GOOMBA_DARK
  ctx.fillRect(4, 7, 8, 4)

  // 脚 - 帧2右脚向前（与帧1对称）
  ctx.fillStyle = GOOMBA_FOOT
  ctx.fillRect(3, 11, 5, 3)
  ctx.fillRect(8, 11, 5, 3)

  // 脚底阴影
  ctx.fillStyle = GOOMBA_DARK
  ctx.fillRect(3, 14, 5, 2)
  ctx.fillRect(8, 14, 5, 2)

  ct.update()
}

/** 蘑菇怪被踩扁 - 很矮的扁片 */
function generateGoombaFlat(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'goomba-flat', SIZE, SIZE)
  const ctx = ct.getContext()

  // 扁平身体 - 只有 3px 高，贴底
  ctx.fillStyle = GOOMBA_BROWN
  ctx.fillRect(1, 13, 14, 2)

  // 两只挤压的眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(4, 13, 2, 1)
  ctx.fillRect(10, 13, 2, 1)

  // 脚
  ctx.fillStyle = GOOMBA_FOOT
  ctx.fillRect(1, 15, 5, 1)
  ctx.fillRect(10, 15, 5, 1)

  ct.update()
}

/** 乌龟行走帧1 - 面向右 */
function generateKoopa1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'koopa-1', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头部 - 皮肤色，偏右
  ctx.fillStyle = KOOPA_SKIN
  ctx.fillRect(9, 1, 6, 6)

  // 眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(12, 3, 2, 2)

  // 壳 - 亮绿色椭圆
  ctx.fillStyle = SHELL_GREEN
  ctx.fillRect(3, 4, 8, 8)
  ctx.fillRect(2, 5, 10, 6)

  // 壳的高光
  ctx.fillStyle = '#A0E830'
  ctx.fillRect(4, 5, 3, 2)

  // 壳的阴影边缘
  ctx.fillStyle = KOOPA_DARK_GREEN
  ctx.fillRect(2, 5, 1, 6)
  ctx.fillRect(12, 5, 1, 6)
  ctx.fillRect(3, 11, 8, 1)

  // 身体下部 - 皮肤色
  ctx.fillStyle = KOOPA_SKIN
  ctx.fillRect(5, 12, 6, 2)

  // 脚 - 帧1左脚向前
  ctx.fillStyle = KOOPA_DARK_GREEN
  ctx.fillRect(2, 13, 4, 3)
  ctx.fillRect(10, 13, 4, 3)

  ct.update()
}

/** 乌龟行走帧2 - 右脚前 */
function generateKoopa2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'koopa-2', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头部
  ctx.fillStyle = KOOPA_SKIN
  ctx.fillRect(9, 1, 6, 6)

  // 眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(12, 3, 2, 2)

  // 壳
  ctx.fillStyle = SHELL_GREEN
  ctx.fillRect(3, 4, 8, 8)
  ctx.fillRect(2, 5, 10, 6)

  // 壳的高光
  ctx.fillStyle = '#A0E830'
  ctx.fillRect(4, 5, 3, 2)

  // 壳的阴影边缘
  ctx.fillStyle = KOOPA_DARK_GREEN
  ctx.fillRect(2, 5, 1, 6)
  ctx.fillRect(12, 5, 1, 6)
  ctx.fillRect(3, 11, 8, 1)

  // 身体下部
  ctx.fillStyle = KOOPA_SKIN
  ctx.fillRect(5, 12, 6, 2)

  // 脚 - 帧2右脚向前（与帧1对称）
  ctx.fillStyle = KOOPA_DARK_GREEN
  ctx.fillRect(3, 13, 4, 3)
  ctx.fillRect(9, 13, 4, 3)

  ct.update()
}

/** 龟壳 - 绿色椭圆壳 */
function generateShell(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'shell', SIZE, SIZE)
  const ctx = ct.getContext()

  // 壳主体 - 亮绿色椭圆
  ctx.fillStyle = SHELL_GREEN
  ctx.fillRect(2, 3, 12, 10)
  ctx.fillRect(1, 5, 14, 6)

  // 壳的高光
  ctx.fillStyle = '#A0E830'
  ctx.fillRect(3, 4, 4, 3)

  // 壳边缘深绿
  ctx.fillStyle = KOOPA_DARK_GREEN
  // 上边
  ctx.fillRect(3, 3, 10, 1)
  // 下边
  ctx.fillRect(3, 12, 10, 1)
  // 左边
  ctx.fillRect(1, 5, 1, 6)
  // 右边
  ctx.fillRect(14, 5, 1, 6)

  // 壳底
  ctx.fillStyle = KOOPA_DARK_GREEN
  ctx.fillRect(3, 13, 10, 2)

  ct.update()
}

// Buzzy Beetle 颜色
const BUZZY_BODY = '#586878'
const BUZZY_SHELL = '#384858'
const BUZZY_SHELL_LIGHT = '#687888'
const BUZZY_EYE = '#F8F8F8'

/** 硬壳虫行走帧1 */
function generateBuzzyWalk1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'buzzy-walk-1', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头部 - 灰蓝色
  ctx.fillStyle = BUZZY_BODY
  ctx.fillRect(9, 1, 6, 6)

  // 眼睛
  ctx.fillStyle = BUZZY_EYE
  ctx.fillRect(11, 3, 3, 2)
  ctx.fillStyle = '#000000'
  ctx.fillRect(12, 3, 1, 2)

  // 硬壳 - 深灰蓝椭圆
  ctx.fillStyle = BUZZY_SHELL
  ctx.fillRect(3, 4, 8, 8)
  ctx.fillRect(2, 5, 10, 6)

  // 壳的高光
  ctx.fillStyle = BUZZY_SHELL_LIGHT
  ctx.fillRect(4, 5, 3, 2)

  // 身体下部
  ctx.fillStyle = BUZZY_BODY
  ctx.fillRect(5, 12, 6, 2)

  // 脚
  ctx.fillStyle = BUZZY_SHELL
  ctx.fillRect(2, 13, 4, 3)
  ctx.fillRect(10, 13, 4, 3)

  ct.update()
}

/** 硬壳虫行走帧2 */
function generateBuzzyWalk2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'buzzy-walk-2', SIZE, SIZE)
  const ctx = ct.getContext()

  ctx.fillStyle = BUZZY_BODY
  ctx.fillRect(9, 1, 6, 6)

  ctx.fillStyle = BUZZY_EYE
  ctx.fillRect(11, 3, 3, 2)
  ctx.fillStyle = '#000000'
  ctx.fillRect(12, 3, 1, 2)

  ctx.fillStyle = BUZZY_SHELL
  ctx.fillRect(3, 4, 8, 8)
  ctx.fillRect(2, 5, 10, 6)

  ctx.fillStyle = BUZZY_SHELL_LIGHT
  ctx.fillRect(4, 5, 3, 2)

  ctx.fillStyle = BUZZY_BODY
  ctx.fillRect(5, 12, 6, 2)

  // 帧2右脚向前
  ctx.fillStyle = BUZZY_SHELL
  ctx.fillRect(3, 13, 4, 3)
  ctx.fillRect(9, 13, 4, 3)

  ct.update()
}

/** 硬壳虫龟壳 */
function generateBuzzyShell(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'buzzy-shell', SIZE, SIZE)
  const ctx = ct.getContext()

  // 深灰蓝圆壳
  ctx.fillStyle = BUZZY_SHELL
  ctx.fillRect(2, 3, 12, 10)
  ctx.fillRect(1, 5, 14, 6)

  ctx.fillStyle = BUZZY_SHELL_LIGHT
  ctx.fillRect(3, 4, 4, 3)

  // 壳边缘
  ctx.fillStyle = '#202838'
  ctx.fillRect(3, 3, 10, 1)
  ctx.fillRect(3, 12, 10, 1)

  // 壳底
  ctx.fillRect(3, 13, 10, 2)

  ct.update()
}

const BOWSER_SIZE = 32

const BOWSER_GREEN = '#50B828'
const BOWSER_DARK = '#287800'
const BOWSER_SKIN = '#FCB848'
const BOWSER_RED = '#E82020'

/** Bowser 帧1 - 张嘴 */
function generateBowser1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'bowser-1', BOWSER_SIZE, BOWSER_SIZE)
  const ctx = ct.getContext()

  // 角
  ctx.fillStyle = BOWSER_RED
  ctx.fillRect(2, 0, 4, 6)
  ctx.fillRect(26, 0, 4, 6)

  // 头部（绿色大椭圆）
  ctx.fillStyle = BOWSER_GREEN
  ctx.fillRect(4, 3, 24, 12)
  ctx.fillRect(2, 5, 28, 8)

  // 眼睛
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(8, 5, 6, 5)
  ctx.fillRect(18, 5, 6, 5)
  ctx.fillStyle = '#000000'
  ctx.fillRect(11, 6, 3, 3)
  ctx.fillRect(21, 6, 3, 3)

  // 张嘴（帧1张开）
  ctx.fillStyle = BOWSER_RED
  ctx.fillRect(10, 12, 12, 4)
  ctx.fillStyle = '#000000'
  ctx.fillRect(12, 12, 8, 4)

  // 身体（带壳）
  ctx.fillStyle = BOWSER_GREEN
  ctx.fillRect(6, 16, 20, 10)
  ctx.fillStyle = BOWSER_DARK
  ctx.fillRect(6, 15, 20, 2)
  ctx.fillRect(6, 25, 20, 2)

  // 手臂
  ctx.fillStyle = BOWSER_SKIN
  ctx.fillRect(2, 18, 5, 6)
  ctx.fillRect(25, 18, 5, 6)

  // 腿
  ctx.fillStyle = BOWSER_DARK
  ctx.fillRect(8, 26, 6, 6)
  ctx.fillRect(18, 26, 6, 6)

  ct.update()
}

/** Bowser 帧2 - 闭嘴 */
function generateBowser2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'bowser-2', BOWSER_SIZE, BOWSER_SIZE)
  const ctx = ct.getContext()

  // 角
  ctx.fillStyle = BOWSER_RED
  ctx.fillRect(2, 0, 4, 6)
  ctx.fillRect(26, 0, 4, 6)

  // 头部
  ctx.fillStyle = BOWSER_GREEN
  ctx.fillRect(4, 3, 24, 12)
  ctx.fillRect(2, 5, 28, 8)

  // 眼睛
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(8, 5, 6, 5)
  ctx.fillRect(18, 5, 6, 5)
  ctx.fillStyle = '#000000'
  ctx.fillRect(11, 6, 3, 3)
  ctx.fillRect(21, 6, 3, 3)

  // 闭嘴（帧2闭合）
  ctx.fillStyle = BOWSER_GREEN
  ctx.fillRect(10, 13, 12, 3)
  ctx.fillStyle = BOWSER_DARK
  ctx.fillRect(12, 13, 8, 2)

  // 身体
  ctx.fillStyle = BOWSER_GREEN
  ctx.fillRect(6, 16, 20, 10)
  ctx.fillStyle = BOWSER_DARK
  ctx.fillRect(6, 15, 20, 2)
  ctx.fillRect(6, 25, 20, 2)

  // 手臂
  ctx.fillStyle = BOWSER_SKIN
  ctx.fillRect(2, 18, 5, 6)
  ctx.fillRect(25, 18, 5, 6)

  // 腿（稍不同帧）
  ctx.fillStyle = BOWSER_DARK
  ctx.fillRect(7, 26, 6, 6)
  ctx.fillRect(19, 26, 6, 6)

  ct.update()
}

const HAMMER_BODY = '#48B828'
const HAMMER_SKIN = '#FCB848'
const HAMMER_HELMET = '#505050'
const HAMMER_SHELL = '#385018'

/** 锤子兄弟帧1 */
function generateHammerBro1(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'hammer-bro-1', SIZE, SIZE)
  const ctx = ct.getContext()

  // 头盔
  ctx.fillStyle = HAMMER_HELMET
  ctx.fillRect(3, 0, 10, 5)

  // 头部（皮肤色）
  ctx.fillStyle = HAMMER_SKIN
  ctx.fillRect(4, 5, 8, 5)

  // 眼睛
  ctx.fillStyle = '#000000'
  ctx.fillRect(9, 6, 2, 2)

  // 身体/壳
  ctx.fillStyle = HAMMER_BODY
  ctx.fillRect(3, 10, 10, 6)

  // 壳
  ctx.fillStyle = HAMMER_SHELL
  ctx.fillRect(4, 10, 8, 4)

  // 脚
  ctx.fillStyle = HAMMER_HELMET
  ctx.fillRect(2, 15, 5, 1)
  ctx.fillRect(9, 15, 5, 1)

  ct.update()
}

/** 锤子兄弟帧2 */
function generateHammerBro2(scene: Phaser.Scene): void {
  const ct = createCanvas(scene, 'hammer-bro-2', SIZE, SIZE)
  const ctx = ct.getContext()

  ctx.fillStyle = HAMMER_HELMET
  ctx.fillRect(3, 0, 10, 5)

  ctx.fillStyle = HAMMER_SKIN
  ctx.fillRect(4, 5, 8, 5)

  ctx.fillStyle = '#000000'
  ctx.fillRect(9, 6, 2, 2)

  ctx.fillStyle = HAMMER_BODY
  ctx.fillRect(3, 10, 10, 6)

  ctx.fillStyle = HAMMER_SHELL
  ctx.fillRect(4, 10, 8, 4)

  // 帧2脚稍不同
  ctx.fillStyle = HAMMER_HELMET
  ctx.fillRect(3, 15, 5, 1)
  ctx.fillRect(8, 15, 5, 1)

  ct.update()
}
