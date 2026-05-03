import * as Phaser from 'phaser'
import { SHELL_SPEED, SHELL_WAKE_DELAY } from '../config/constants'
import { BaseEnemy } from './BaseEnemy'

type ShellMode = 'walking' | 'shell_idle' | 'shell_moving'

export type { ShellMode }

/**
 * 龟壳类敌人基类（Koopa / BuzzyBeetle）
 * 管理 walking → shell_idle → shell_moving 状态转换
 */
export abstract class ShellEnemy extends BaseEnemy {
  protected shellMode: ShellMode = 'walking'
  private wakeTimer = 0
  private walkSpeed: number
  private walkAnimKey: string
  private shellTextureKey: string

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey: string,
    walkSpeed: number,
    walkAnimKey: string,
    shellTextureKey: string,
  ) {
    super(scene, x, y, textureKey)

    this.walkSpeed = walkSpeed
    this.walkAnimKey = walkAnimKey
    this.shellTextureKey = shellTextureKey

    this.setVelocityX(-walkSpeed)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 14)
    body.setOffset(1, 2)
    this.play(walkAnimKey)
  }

  stomp(_marioX?: number): void {
    if (this.shellMode === 'walking') {
      this.enterShellIdle()
    } else if (this.shellMode === 'shell_moving') {
      this.stopShell()
    }
  }

  kick(marioX: number): void {
    if (this.shellMode !== 'shell_idle') return
    this.shellMode = 'shell_moving'
    const dir = this.x < marioX ? -1 : 1
    this.setVelocityX(SHELL_SPEED * dir)
  }

  reverse(): void {
    if (this.shellMode === 'shell_idle') return
    const body = this.body as Phaser.Physics.Arcade.Body
    this.setVelocityX(-body.velocity.x)
  }

  get shellModeState(): ShellMode { return this.shellMode }

  update(time: number, delta: number): void {
    if (!this.aliveFlag) return

    if (
      this.shellMode === 'shell_idle' &&
      this.wakeTimer > 0 &&
      this.scene.time.now > this.wakeTimer
    ) {
      this.exitShellIdle()
    }

    super.update(time, delta)
  }

  private enterShellIdle(): void {
    this.shellMode = 'shell_idle'
    this.setVelocityX(0)
    this.setTexture(this.shellTextureKey)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 12)
    body.setOffset(1, 4)
    this.stop()
    this.wakeTimer = this.scene.time.now + SHELL_WAKE_DELAY
  }

  private stopShell(): void {
    this.shellMode = 'shell_idle'
    this.setVelocityX(0)
    this.wakeTimer = this.scene.time.now + SHELL_WAKE_DELAY
  }

  private exitShellIdle(): void {
    this.shellMode = 'walking'
    this.setVelocityX(-this.walkSpeed)
    this.play(this.walkAnimKey)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 14)
    body.setOffset(1, 2)
  }
}
