import * as Phaser from 'phaser'
import { TILE_SIZE, GAME_WIDTH } from '../config/constants'

export class Flagpole {
  private scene: Phaser.Scene
  x: number
  private poleTop: number
  private poleBottom: number
  private flag!: Phaser.GameObjects.Image
  reached = false

  constructor(scene: Phaser.Scene, tileX: number, topRow: number, bottomRow: number) {
    this.scene = scene
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2
    this.poleTop = topRow * TILE_SIZE
    this.poleBottom = bottomRow * TILE_SIZE

    // 旗杆顶球
    scene.add.image(this.x, this.poleTop, 'tile-flagpole-top').setOrigin(0.5, 1).setScale(1)

    // 旗杆体
    const poleHeight = this.poleBottom - this.poleTop
    for (let y = 0; y < poleHeight; y += TILE_SIZE) {
      scene.add.image(this.x, this.poleTop + y + TILE_SIZE, 'tile-flagpole').setOrigin(0.5, 0).setScale(1)
    }

    // 旗帜（用问号砖纹理暂代，实际应添加旗帜纹理）
    this.flag = scene.add.image(this.x - 8, this.poleTop + TILE_SIZE, 'flag')
    this.flag.setOrigin(0.5, 0)
  }

  /** 触发通关：马里奥滑下旗杆 -> 走向城堡 -> 计分 */
  playCompleteSequence(mario: Phaser.Physics.Arcade.Sprite, onComplete: () => void): void {
    this.reached = true

    // 禁用马里奥输入
    mario.setVelocity(0, 0)
    const marioBody = mario.body as Phaser.Physics.Arcade.Body
    if (marioBody) {
      marioBody.enable = false
    }

    // 马里奥移到旗杆位置
    mario.x = this.x

    // 1) 旗子下降
    this.scene.tweens.add({
      targets: this.flag,
      y: this.poleBottom - TILE_SIZE * 2,
      duration: 800,
      ease: 'Linear',
    })

    // 2) 马里奥滑下旗杆
    this.scene.tweens.add({
      targets: mario,
      y: this.poleBottom - TILE_SIZE,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        // 3) 走向城堡右侧
        this.scene.tweens.add({
          targets: mario,
          x: mario.x + GAME_WIDTH / 2,
          duration: 1500,
          ease: 'Linear',
          onComplete: () => {
            onComplete()
          },
        })
      },
    })
  }

  /** 检测马里奥是否到达旗杆 */
  checkReach(marioX: number, marioY: number): boolean {
    if (this.reached) return false
    if (Math.abs(marioX - this.x) < 12 && marioY > this.poleTop && marioY < this.poleBottom + TILE_SIZE) {
      return true
    }
    return false
  }
}
