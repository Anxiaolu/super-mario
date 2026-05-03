/**
 * 生成背景装饰纹理
 * 云朵、山丘、灌木
 * 使用 scene.add.graphics() + generateTexture() 方法
 */

/** 绿色 */
const GREEN = 0x00A800
/** 白色 */
const WHITE = 0xFFFFFF
/** 深绿阴影 */
const DARK_GREEN = 0x005800

export function generateBackgroundTextures(scene: Phaser.Scene): void {
  generateCloudSmall(scene)
  generateCloudMedium(scene)
  generateCloudLarge(scene)
  generateHillSmall(scene)
  generateHillLarge(scene)
  generateBushSmall(scene)
  generateBushLarge(scene)
}

/** 小云朵（24x16）- 多个重叠圆形 */
function generateCloudSmall(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  g.fillStyle(WHITE, 1)
  // 左侧圆
  g.fillCircle(6, 10, 6)
  // 右侧圆
  g.fillCircle(18, 10, 6)
  // 顶部中间圆（让云朵蓬松）
  g.fillCircle(12, 7, 6)

  g.generateTexture('cloud-small', 24, 16)
  g.destroy()
}

/** 中云朵（32x16） */
function generateCloudMedium(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  g.fillStyle(WHITE, 1)
  // 左侧圆
  g.fillCircle(7, 10, 6)
  // 右侧圆
  g.fillCircle(25, 10, 6)
  // 中间偏左
  g.fillCircle(14, 8, 6)
  // 中间偏右
  g.fillCircle(19, 8, 6)
  // 顶部
  g.fillCircle(16, 5, 6)

  g.generateTexture('cloud-medium', 32, 16)
  g.destroy()
}

/** 大云朵（48x16） */
function generateCloudLarge(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  g.fillStyle(WHITE, 1)
  // 左侧圆
  g.fillCircle(8, 10, 7)
  // 右侧圆
  g.fillCircle(40, 10, 7)
  // 中间三个圆
  g.fillCircle(16, 8, 7)
  g.fillCircle(24, 6, 7)
  g.fillCircle(32, 8, 7)

  g.generateTexture('cloud-large', 48, 16)
  g.destroy()
}

/** 小山丘（48x24）- 三角形/半圆形 */
function generateHillSmall(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  // 主山丘 - 绿色半圆
  g.fillStyle(GREEN, 1)
  // 用填充三角形近似半圆
  g.beginPath()
  g.moveTo(0, 24)
  g.lineTo(24, 2)
  g.lineTo(48, 24)
  g.closePath()
  g.fillPath()

  // 顶部高光
  g.fillStyle(0x30C830, 1)
  g.beginPath()
  g.moveTo(16, 12)
  g.lineTo(24, 2)
  g.lineTo(32, 12)
  g.closePath()
  g.fillPath()

  g.generateTexture('hill-small', 48, 24)
  g.destroy()
}

/** 大山丘（80x32） */
function generateHillLarge(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  // 主山丘
  g.fillStyle(GREEN, 1)
  g.beginPath()
  g.moveTo(0, 32)
  g.lineTo(40, 2)
  g.lineTo(80, 32)
  g.closePath()
  g.fillPath()

  // 顶部高光
  g.fillStyle(0x30C830, 1)
  g.beginPath()
  g.moveTo(28, 14)
  g.lineTo(40, 2)
  g.lineTo(52, 14)
  g.closePath()
  g.fillPath()

  // 底部阴影
  g.fillStyle(DARK_GREEN, 1)
  g.fillRect(0, 28, 80, 4)

  g.generateTexture('hill-large', 80, 32)
  g.destroy()
}

/** 小灌木（24x12）- 波浪形边缘 */
function generateBushSmall(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  g.fillStyle(GREEN, 1)
  // 底部矩形
  g.fillRect(2, 4, 20, 8)
  // 波浪形顶部 - 三个半圆
  g.fillCircle(6, 6, 5)
  g.fillCircle(12, 4, 5)
  g.fillCircle(18, 6, 5)

  // 高光
  g.fillStyle(0x30C830, 1)
  g.fillCircle(6, 4, 3)
  g.fillCircle(12, 2, 3)
  g.fillCircle(18, 4, 3)

  g.generateTexture('bush-small', 24, 12)
  g.destroy()
}

/** 大灌木（48x12） */
function generateBushLarge(scene: Phaser.Scene): void {
  const g = scene.add.graphics()

  g.fillStyle(GREEN, 1)
  // 底部矩形
  g.fillRect(2, 4, 44, 8)
  // 波浪形顶部 - 五个半圆
  g.fillCircle(6, 6, 5)
  g.fillCircle(14, 4, 5)
  g.fillCircle(24, 4, 5)
  g.fillCircle(34, 4, 5)
  g.fillCircle(42, 6, 5)

  // 高光
  g.fillStyle(0x30C830, 1)
  g.fillCircle(6, 4, 3)
  g.fillCircle(14, 2, 3)
  g.fillCircle(24, 2, 3)
  g.fillCircle(34, 2, 3)
  g.fillCircle(42, 4, 3)

  g.generateTexture('bush-large', 48, 12)
  g.destroy()
}
