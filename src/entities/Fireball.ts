import * as Phaser from 'phaser'
import { FIREBALL_SPEED, DESTROY_Y_THRESHOLD } from '../config/constants'

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  private lifespan = 0

  constructor(scene: Phaser.Scene, x: number, y: number, facingRight: boolean) {
    super(scene, x, y, 'fireball')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(8, 8)
      body.setOffset(0, 0)
      body.setBounce(1, 0.5) // 地面弹跳
      body.setVelocityX(facingRight ? FIREBALL_SPEED : -FIREBALL_SPEED)
      body.setVelocityY(-80) // 初始轻微上抛
      body.setAllowGravity(true)
      body.setCollideWorldBounds(false)
    }

    this.lifespan = 3000 // 3 秒后自动销毁
  }

  update(_time: number, delta: number): void {
    this.lifespan -= delta

    // 超时或掉出屏幕销毁
    if (this.lifespan <= 0 || this.y > DESTROY_Y_THRESHOLD) {
      this.destroy()
      return
    }

    // 碰墙反弹
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      if (body.blocked.left || body.blocked.right) {
        this.destroy()
      }
    }
  }
}
