import * as Phaser from 'phaser'

/** 创建 Canvas 纹理的辅助函数，统一处理空值检查 */
export function createCanvas(scene: Phaser.Scene, key: string, w: number, h: number): Phaser.Textures.CanvasTexture {
  const ct = scene.textures.createCanvas(key, w, h)
  if (!ct) throw new Error(`创建 Canvas 纹理失败: ${key}`)
  return ct
}
