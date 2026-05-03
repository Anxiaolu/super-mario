import * as Phaser from 'phaser'
import { DESTROY_Y_THRESHOLD } from '../config/constants'

export class Hammer extends Phaser.Physics.Arcade.Sprite {
  private lifespan = 0

  constructor(scene: Phaser.Scene, x: number, y: number, dir: number) {
    super(scene, x, y, 'hammer')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(8, 8)
      body.setBounce(0.3)
      body.setVelocityX(dir * 80)
      body.setVelocityY(-200) // 上抛弧线
      body.setAllowGravity(true)
    }

    this.lifespan = 4000
  }

  update(_time: number, delta: number): void {
    this.lifespan -= delta
    if (this.lifespan <= 0 || this.y > DESTROY_Y_THRESHOLD) {
      this.destroy()
    }
    // 旋转效果
    this.angle += 5
  }
}
