import * as Phaser from 'phaser'
import { generateTileTextures } from './TileTextures'

const TILE_SIZE = 16
const TILE_COUNT = 16

/**
 * 生成完整的 tileset spritesheet 纹理，供 Phaser Tilemap 使用
 * 瓦片 ID 对应纹理中的水平位置
 */
export function generateTileset(scene: Phaser.Scene): void {
  // 先确保所有独立瓦片纹理已生成
  generateTileTextures(scene)

  const width = TILE_SIZE * TILE_COUNT
  const ct = scene.textures.createCanvas('mario-tileset', width, TILE_SIZE)
  if (!ct) throw new Error('创建 Canvas 纹理失败: mario-tileset')
  const ctx = ct.getContext()

  // 瓦片 ID 对应的纹理 key，null 表示留空（透明）
  const tileKeys: (string | null)[] = [
    null,              // 0: 空
    'tile-ground',     // 1
    'tile-brick',      // 2
    'tile-question-1', // 3
    'tile-question-1', // 4: QUESTION_MUSHROOM 复用问号外观
    'tile-used',       // 5
    'tile-pipe-tl',    // 6
    'tile-pipe-tr',    // 7
    'tile-pipe-bl',    // 8
    'tile-pipe-br',    // 9
    'tile-flagpole',   // 10
    'tile-flagpole-top', // 11
    'tile-hard',       // 12
    'tile-castle',     // 13
    'tile-ground',     // 14: COIN_TILE 暂时用地面代替
    'tile-ground',     // 15: INVISIBLE_BLOCK 用地面代替
  ]

  for (let i = 0; i < tileKeys.length; i++) {
    const key = tileKeys[i]
    if (!key) continue

    const srcTexture = scene.textures.get(key)
    const srcImage = srcTexture.getSourceImage() as HTMLCanvasElement
    ctx.drawImage(srcImage, i * TILE_SIZE, 0)
  }

  ct.update()
}
