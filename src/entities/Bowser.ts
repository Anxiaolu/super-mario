import * as Phaser from 'phaser'
import { DESTROY_Y_THRESHOLD } from '../config/constants'

export class Bowser extends Phaser.Physics.Arcade.Sprite {
  private isAlive = true
  private hp = 5
  private moveDir = -1
  private readonly SPEED = 25
  private jumpTimer = 0
  private fireTimer = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bowser-1')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 1)
    this.setBounce(0)
    this.setVelocityX(this.SPEED * this.moveDir)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(28, 30)
    body.setOffset(2, 2)

    this.jumpTimer = Phaser.Math.Between(2000, 4000)
    this.fireTimer = Phaser.Math.Between(3000, 6000)
  }

  hit(): void {
    if (!this.isAlive) return
    this.hp--
    if (this.hp <= 0) {
      this.kill()
    } else {
      // 受击闪烁
      this.setTint(0xff0000)
      this.scene.time.delayedCall(100, () => {
        if (this.active) this.clearTint()
      })
    }
  }

  kill(): void {
    if (!this.isAlive) return
    this.isAlive = false
    const body = this.body as Phaser.Physics.Arcade.Body
    body.enable = false
    this.scene.tweens.add({
      targets: this,
      y: this.y + 100,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.destroy(),
    })
  }

  get alive(): boolean { return this.isAlive }

  update(time: number, delta: number): void {
    if (!this.isAlive) return

    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body) return

    // 碰壁反转
    if (body.blocked.left || body.blocked.right) {
      this.moveDir *= -1
      this.setVelocityX(this.SPEED * this.moveDir)
    }

    // 定期跳跃
    this.jumpTimer -= delta
    if (this.jumpTimer <= 0 && (body.blocked.down || body.touching.down)) {
      body.setVelocityY(-350)
      this.jumpTimer = Phaser.Math.Between(3000, 5000)
    }

    // 喷火（通过事件通知 GameScene）
    this.fireTimer -= delta
    if (this.fireTimer <= 0) {
      this.fireTimer = Phaser.Math.Between(3000, 6000)
      this.scene.events.emit('bowser-fire', this.x, this.y + 16, this.moveDir > 0)
    }

    // 动画帧
    const frame = Math.floor(time / 300) % 2 === 0 ? 'bowser-1' : 'bowser-2'
    this.setTexture(frame)
    this.setFlipX(this.moveDir > 0)

    if (this.y > DESTROY_Y_THRESHOLD + 200) {
      this.destroy()
    }
  }
}
