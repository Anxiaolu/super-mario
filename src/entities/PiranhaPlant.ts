import * as Phaser from 'phaser'
import { TILE_SIZE, DESTROY_Y_THRESHOLD } from '../config/constants'

type PlantState = 'hidden' | 'rising' | 'visible' | 'retracting'

export class PiranhaPlant extends Phaser.Physics.Arcade.Sprite {
  private plantState: PlantState = 'hidden'
  private isAlive = true
  private timer = 0
  private baseY: number
  private readonly RISE_SPEED = 40
  private readonly MAX_EXTEND = TILE_SIZE * 2 // 伸出 2 格
  private readonly VISIBLE_DURATION = 1800 // 可见时间
  private readonly HIDDEN_DURATION = 1200 // 隐藏时间

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'piranha-plant-1')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.baseY = y
    this.setOrigin(0.5, 1)

    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setSize(14, 14)
      body.setOffset(1, 2)
      body.setAllowGravity(false)
      body.setImmovable(true)
    }

    // 初始延迟（随机，避免所有食人花同步）
    this.timer = Phaser.Math.Between(0, 2000)
    this.setAlpha(0)
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

  update(time: number, delta: number, marioX: number, marioY: number): void {
    if (!this.isAlive || !this.body) return

    this.timer -= delta

    const distToMario = Math.abs(marioX - this.x)
    const marioOnPipe = distToMario < TILE_SIZE && marioY > this.baseY - TILE_SIZE * 2

    switch (this.plantState) {
      case 'hidden':
        this.setAlpha(0)
        // Mario 在管道上方时不伸出
        if (this.timer <= 0 && !marioOnPipe) {
          this.plantState = 'rising'
        }
        break

      case 'rising': {
        this.setAlpha(1)
        const targetY = this.baseY - this.MAX_EXTEND
        this.y -= this.RISE_SPEED * (delta / 1000)
        if (this.y <= targetY) {
          this.y = targetY
          this.plantState = 'visible'
          this.timer = this.VISIBLE_DURATION
        }
        break
      }

      case 'visible':
        if (this.timer <= 0) {
          this.plantState = 'retracting'
        }
        break

      case 'retracting': {
        this.y += this.RISE_SPEED * (delta / 1000)
        if (this.y >= this.baseY) {
          this.y = this.baseY
          this.plantState = 'hidden'
          this.timer = this.HIDDEN_DURATION
        }
        break
      }
    }

    // 动画帧切换（2 帧嘴部动画）
    const frame = Math.floor(time / 200) % 2 === 0 ? 'piranha-plant-1' : 'piranha-plant-2'
    if (this.plantState !== 'hidden') {
      this.setTexture(frame)
    }

    if (this.y > DESTROY_Y_THRESHOLD) {
      this.destroy()
    }
  }
}
