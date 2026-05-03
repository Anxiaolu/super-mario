import * as Phaser from 'phaser'
import { BaseEnemy } from './BaseEnemy'

export class HammerBro extends BaseEnemy {
  private jumpTimer = 0
  private throwTimer = 0
  private readonly JUMP_INTERVAL = 2500
  private readonly THROW_INTERVAL = 2000

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'hammer-bro-1')

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 16)
    body.setOffset(1, 0)

    this.jumpTimer = Phaser.Math.Between(500, 2000)
    this.throwTimer = Phaser.Math.Between(1000, 3000)
  }

  stomp(): void {
    this.kill()
  }

  reverse(): void {
    // HammerBro 不反转方向
  }

  update(time: number, delta: number): void {
    if (!this.alive) return

    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body) return

    // 定期跳跃
    this.jumpTimer -= delta
    if (this.jumpTimer <= 0 && (body.blocked.down || body.touching.down)) {
      body.setVelocityY(-350)
      body.setVelocityX(Phaser.Math.Between(-60, 60))
      this.jumpTimer = this.JUMP_INTERVAL
    }

    // 定期投掷锤子（不再传方向，由 GameScene 计算）
    this.throwTimer -= delta
    if (this.throwTimer <= 0) {
      this.throwTimer = this.THROW_INTERVAL
      this.scene.events.emit('hammer-throw', this.x, this.y - 8)
    }

    // 动画帧
    const frame = Math.floor(time / 300) % 2 === 0 ? 'hammer-bro-1' : 'hammer-bro-2'
    this.setTexture(frame)

    // 掉落销毁
    super.update(time, delta)
  }
}
