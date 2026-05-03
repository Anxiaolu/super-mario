import * as Phaser from 'phaser'
import { GOOMBA_SPEED, FLAT_DISPLAY_DURATION } from '../config/constants'
import { BaseEnemy } from './BaseEnemy'

export class Goomba extends BaseEnemy {
  private isFlat = false
  private flatTimer = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'goomba-1')

    this.setVelocityX(-GOOMBA_SPEED)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 14)
    body.setOffset(1, 2)
    this.play('goomba-walk')
  }

  stomp(): void {
    if (!this.aliveFlag) return
    this.isFlat = true
    this.aliveFlag = false
    this.setVelocityX(0)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = false
    this.setTexture('goomba-flat')
    this.flatTimer = this.scene.time.now + FLAT_DISPLAY_DURATION
  }

  reverse(): void {
    if (!this.aliveFlag) return
    const body = this.body as Phaser.Physics.Arcade.Body
    this.setVelocityX(-body.velocity.x)
  }

  update(time: number, delta: number): void {
    if (this.isFlat && this.scene.time.now > this.flatTimer) {
      this.destroy()
    }
    super.update(time, delta)
  }
}
