import * as Phaser from 'phaser'
import { DESTROY_Y_THRESHOLD } from '../config/constants'

export class HammerBro extends Phaser.Physics.Arcade.Sprite {
  private isAlive = true
  private jumpTimer = 0
  private throwTimer = 0
  private readonly JUMP_INTERVAL = 2500
  private readonly THROW_INTERVAL = 2000

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hammer-bro-1')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 1)
    this.setBounce(0)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 16)
    body.setOffset(1, 0)

    this.jumpTimer = Phaser.Math.Between(500, 2000)
    this.throwTimer = Phaser.Math.Between(1000, 3000)
  }

  stomp(): void {
    if (!this.isAlive) return
    this.kill()
  }

  reverse(): void {
    // Hammer Bro 不反转方向，忽略
  }

  kill(): void {
    if (!this.isAlive) return
    this.isAlive = false
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

  get alive(): boolean { return this.isAlive }

  update(time: number, delta: number): void {
    if (!this.isAlive) return

    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body) return

    // 定期跳跃
    this.jumpTimer -= delta
    if (this.jumpTimer <= 0 && (body.blocked.down || body.touching.down)) {
      body.setVelocityY(-350)
      body.setVelocityX(Phaser.Math.Between(-60, 60))
      this.jumpTimer = this.JUMP_INTERVAL
    }

    // 定期投掷锤子
    this.throwTimer -= delta
    if (this.throwTimer <= 0) {
      this.throwTimer = this.THROW_INTERVAL
      this.scene.events.emit('hammer-throw', this.x, this.y - 8, Phaser.Math.Between(-1, 1))
    }

    // 动画帧
    const frame = Math.floor(time / 300) % 2 === 0 ? 'hammer-bro-1' : 'hammer-bro-2'
    this.setTexture(frame)

    if (this.y > DESTROY_Y_THRESHOLD) {
      this.destroy()
    }
  }
}
