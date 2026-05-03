import * as Phaser from 'phaser'
import { generateMarioTextures } from '../assets/textures/MarioTextures'
import { generateEnemyTextures } from '../assets/textures/EnemyTextures'
import { generateItemTextures } from '../assets/textures/ItemTextures'
import { generateEffectTextures } from '../assets/textures/EffectTextures'
import { generateBackgroundTextures } from '../assets/textures/BackgroundTextures'
import { generateTileset } from '../assets/textures/TilesetGenerator'
import { createMarioAnims } from '../assets/animations/MarioAnims'
import { createEnemyAnims } from '../assets/animations/EnemyAnims'
import { createItemAnims } from '../assets/animations/ItemAnims'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  create(): void {
    try {
      generateMarioTextures(this)
      generateEnemyTextures(this)
      generateItemTextures(this)
      generateEffectTextures(this)
      generateBackgroundTextures(this)
      generateTileset(this)

      createMarioAnims(this)
      createEnemyAnims(this)
      createItemAnims(this)

      this.scene.start('GameScene')
    } catch (err) {
      console.error('[BootScene] 初始化失败:', err instanceof Error ? err.message : String(err))
      this.add.text(8, 100, '资源加载失败，请刷新页面重试', {
        fontSize: '8px',
        color: '#ff0000',
        fontFamily: 'monospace',
        wordWrap: { width: 240 },
      })
    }
  }
}
