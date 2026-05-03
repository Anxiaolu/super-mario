import * as Phaser from 'phaser'
import { DESTROY_Y_THRESHOLD } from '../config/constants'

/** 敌人基类：统一管理生命状态、掉落销毁、构造函数模式 */
export abstract class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  protected aliveFlag = true

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string) {
    super(scene, x, y, textureKey)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 1)
    this.setBounce(0)
  }

  /** 是否存活 */
  get alive(): boolean {
    return this.aliveFlag
  }

  /** 碰壁反转方向 */
  abstract reverse(): void

  /** 被火球/龟壳击杀（上弹渐隐动画） */
  kill(): void {
    if (!this.aliveFlag) return
    this.aliveFlag = false
    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = false
    this.scene.tweens.add({
      targets: this,
      y: this.y - 48,
      alpha: 0,
      duration: 500,
      onComplete: () => this.destroy(),
    })
  }

  /** 每帧：掉落销毁检测 */
  update(_time: number, _delta: number): void {
    if (this.y > DESTROY_Y_THRESHOLD) {
      this.destroy()
    }
  }
}
