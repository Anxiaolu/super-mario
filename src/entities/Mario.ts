import * as Phaser from 'phaser'
import {
  MARIO_WALK_SPEED, MARIO_RUN_SPEED, MARIO_JUMP_VELOCITY,
  MARIO_DECELERATION,
  TEX, GAME, JUMP_CUTOFF_VELOCITY, STOMP_BOUNCE_VELOCITY,
} from '../config/constants'
import { InputSystem } from '../systems/InputSystem'

// 内联类型定义，避免 import type（verbatimModuleSyntax 要求）
type PowerState = 'small' | 'big' | 'fire'
type MarioAction = 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'duck' | 'turn' | 'die'

/** 动画 key 前缀映射 */
const ANIM_PREFIX: Record<PowerState, string> = {
  small: 'mario-small-',
  big: 'mario-big-',
  fire: 'mario-fire-',
}

/** 小马里奥物理体尺寸 */
const SMALL_BODY_W = 12
const SMALL_BODY_H = 14
const SMALL_OFFSET_X = 2
const SMALL_OFFSET_Y = 2

/** 大/火焰马里奥物理体尺寸 */
const BIG_BODY_W = 12
const BIG_BODY_H = 30
const BIG_OFFSET_X = 2
const BIG_OFFSET_Y = 2

/**
 * 马里奥角色
 * 继承 Arcade Sprite，管理状态、输入、动画和物理体
 */
export class Mario extends Phaser.Physics.Arcade.Sprite {
  /** 当前力量状态 */
  powerState: PowerState = 'small'
  /** 当前动作状态 */
  action: MarioAction = 'idle'
  /** 是否着地 */
  isGrounded = true
  /** 是否无敌（受伤后闪烁） */
  isInvincible = false
  /** 无敌剩余时间(ms) */
  invincibleTimer = 0
  /** 是否面向右方 */
  facingRight = true
  /** 是否已死亡 */
  isDead = false
  /** 跳跃键是否按住（用于可变高度跳跃） */
  jumpHeld = false
  /** 火球冷却计时器(ms) */
  fireballCooldown = 0
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.MARIO_SMALL_STAND)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 1)
    this.setCollideWorldBounds(true)

    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setBounce(0)
      body.setSize(SMALL_BODY_W, SMALL_BODY_H)
      body.setOffset(SMALL_OFFSET_X, SMALL_OFFSET_Y)
    }
  }

  /**
   * 每帧处理输入，调度各子处理模块
   */
  handleInput(input: InputSystem, delta: number): void {
    if (this.isDead) return

    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body) return

    const deltaSec = delta / 1000

    // 判断着地状态：body.blocked.down 或 body.touching.down
    this.isGrounded = body.blocked.down || body.touching.down

    if (this.handleDuck(input, body)) return

    const isTurning = this.handleMovement(input, body, deltaSec)

    if (input.isLeft) this.facingRight = false
    else if (input.isRight) this.facingRight = true

    this.handleJump(input, body)
    this.handleFire(input)

    this.determineAction(body, isTurning)
    this.updateAnimation()
  }

  /** 蹲下处理，返回 true 表示消耗该帧不再处理移动 */
  private handleDuck(input: InputSystem, body: Phaser.Physics.Arcade.Body): boolean {
    if (this.isGrounded && input.isDown && (this.powerState === 'big' || this.powerState === 'fire')) {
      this.action = 'duck'
      body.setVelocityX(0)
      body.setSize(SMALL_BODY_W, SMALL_BODY_H)
      body.setOffset(SMALL_OFFSET_X, SMALL_OFFSET_Y)
      this.updateAnimation()
      return true
    }

    if (this.action === 'duck') {
      this.updateBodySize()
    }
    return false
  }

  /** 水平移动：瞬时加速 + 惯性减速 */
  private handleMovement(input: InputSystem, body: Phaser.Physics.Arcade.Body, deltaSec: number): boolean {
    let targetSpeed = 0
    const maxSpeed = input.isRun ? MARIO_RUN_SPEED : MARIO_WALK_SPEED

    if (input.isLeft) {
      targetSpeed = -maxSpeed
    } else if (input.isRight) {
      targetSpeed = maxSpeed
    }

    if (targetSpeed !== 0) {
      body.velocity.x = targetSpeed
    } else {
      const decel = MARIO_DECELERATION * deltaSec
      if (Math.abs(body.velocity.x) <= decel) {
        body.velocity.x = 0
      } else {
        body.velocity.x -= Math.sign(body.velocity.x) * decel
      }
    }

    return this.checkTurn(body, input)
  }

  /** 跳跃 + 可变高度截断 */
  private handleJump(input: InputSystem, body: Phaser.Physics.Arcade.Body): void {
    if (input.isJumpPressed && this.isGrounded) {
      body.setVelocityY(MARIO_JUMP_VELOCITY)
      this.jumpHeld = true
    }

    if (this.jumpHeld && !input.isJump && body.velocity.y < JUMP_CUTOFF_VELOCITY) {
      body.velocity.y = JUMP_CUTOFF_VELOCITY
      this.jumpHeld = false
    }
    if (!input.isJump) {
      this.jumpHeld = false
    }
  }

  /** 火球射击 */
  private handleFire(input: InputSystem): void {
    if (input.isFire && this.powerState === 'fire' && this.fireballCooldown <= 0) {
      this.fireballCooldown = 300
      this.scene.events.emit('mario-shoot', this.x, this.y, this.facingRight)
    }
  }

  /**
   * 检测转身：当前有速度且方向键与运动方向相反
   */
  private checkTurn(body: Phaser.Physics.Arcade.Body, input: InputSystem): boolean {
    if (this.isGrounded && Math.abs(body.velocity.x) > 10) {
      const movingRight = body.velocity.x > 0
      if ((movingRight && input.isLeft) || (!movingRight && input.isRight)) {
        return true
      }
    }
    return false
  }

  /**
   * 根据物理状态判定动作
   */
  private determineAction(body: Phaser.Physics.Arcade.Body, isTurning: boolean): void {
    if (this.isDead) {
      this.action = 'die'
      return
    }

    if (!this.isGrounded) {
      // 空中：跳跃或下落
      this.action = body.velocity.y < 0 ? 'jump' : 'fall'
      return
    }

    if (isTurning) {
      this.action = 'turn'
      return
    }

    if (Math.abs(body.velocity.x) > 5) {
      this.action = Math.abs(body.velocity.x) > MARIO_WALK_SPEED ? 'run' : 'walk'
      return
    }

    this.action = 'idle'
  }

  /**
   * 根据 powerState + action 播放正确的动画
   */
  updateAnimation(): void {
    if (this.isDead) {
      this.setTexture(TEX.MARIO_SMALL_DIE)
      return
    }

    const prefix = ANIM_PREFIX[this.powerState]

    // 根据 action 选择动画
    switch (this.action) {
      case 'walk':
      case 'run':
        this.play(`${prefix}walk`, true)
        break
      case 'jump':
      case 'fall':
        this.play(`${prefix}jump`, true)
        break
      case 'turn':
        this.play(`${prefix}turn`, true)
        break
      case 'duck':
        this.play(`${prefix}duck`, true)
        break
      case 'idle':
      default:
        // idle 使用静态纹理
        this.anims.stop()
        if (this.powerState === 'small') {
          this.setTexture(TEX.MARIO_SMALL_STAND)
        } else if (this.powerState === 'big') {
          this.setTexture(TEX.MARIO_BIG_STAND)
        } else {
          this.setTexture(TEX.MARIO_FIRE_STAND)
        }
        break
    }

    // 翻转方向
    this.setFlipX(!this.facingRight)
  }

  /**
   * 小马里奥变大
   */
  grow(): void {
    if (this.powerState === 'small') {
      this.powerState = 'big'
      this.updateBodySize()

      // 简单变大动画：短暂闪烁 + 缩放效果
      this.scene.tweens.add({
        targets: this,
        scaleX: { from: 1, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 300,
        ease: 'Back.easeOut',
        yoyo: false,
      })
    }
  }

  /**
   * 大/火焰马里奥受伤变小
   */
  shrink(): void {
    if (this.powerState !== 'small') {
      this.powerState = 'small'
      this.updateBodySize()

      this.isInvincible = true
      this.invincibleTimer = GAME.INVINCIBLE_DURATION

      // 闪烁效果（每次闪烁周期 = 100ms * 2 = 200ms）
      const blinkCycles = Math.floor(GAME.INVINCIBLE_DURATION / 200)
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0.2 },
        duration: 100,
        repeat: blinkCycles - 1,
        yoyo: true,
        ease: 'Linear',
        onComplete: () => {
          this.setAlpha(1)
        },
      })
    }
  }

  /**
   * 死亡
   */
  die(): void {
    if (this.isDead) return

    this.isDead = true
    this.action = 'die'

    const body = this.body as Phaser.Physics.Arcade.Body
    if (body) {
      body.enable = false
    }

    // 经典死亡动画：先上弹再下落
    this.scene.tweens.add({
      targets: this,
      y: this.y - 80,
      duration: 400,
      ease: 'Power1',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          y: this.y + 300,
          duration: 600,
          ease: 'Power2',
          onComplete: () => {
            this.scene.events.emit('mario-died')
          },
        })
      },
    })

    this.updateAnimation()
  }

  /**
   * 每帧更新（无敌计时器、闪烁）
   */
  update(_time: number, delta: number): void {
    if (this.isDead) return

    // 处理无敌计时器
    if (this.isInvincible) {
      this.invincibleTimer -= delta
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false
        this.invincibleTimer = 0
        this.setAlpha(1)
      }
    }

    // 火球冷却
    if (this.fireballCooldown > 0) {
      this.fireballCooldown -= delta
    }
  }

  /** 踩敌后弹起 */
  bounceOffEnemy(): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    if (body) {
      body.setVelocityY(STOMP_BOUNCE_VELOCITY)
    }
  }

  /** 受伤处理 */
  hit(): void {
    if (this.isInvincible || this.isDead) return
    if (this.powerState !== 'small') {
      this.shrink()
    } else {
      this.die()
    }
  }

  /** 变火焰马里奥（body 尺寸与 big 相同，无需更新） */
  goFire(): void {
    this.powerState = 'fire'
  }

  /** 无敌星星效果 */
  goInvincible(): void {
    this.isInvincible = true
    this.invincibleTimer = 8000
    // 彩虹闪烁效果
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.3 },
      duration: 80,
      repeat: Math.floor(8000 / 160),
      yoyo: true,
      onComplete: () => {
        this.setAlpha(1)
        this.isInvincible = false
      },
    })
  }

  /** 是否为大/火焰马里奥 */
  get isBig(): boolean {
    return this.powerState === 'big' || this.powerState === 'fire'
  }

  /**
   * 根据当前 powerState 更新物理体尺寸
   */
  private updateBodySize(): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    if (!body) return

    if (this.powerState === 'small') {
      body.setSize(SMALL_BODY_W, SMALL_BODY_H)
      body.setOffset(SMALL_OFFSET_X, SMALL_OFFSET_Y)
    } else {
      body.setSize(BIG_BODY_W, BIG_BODY_H)
      body.setOffset(BIG_OFFSET_X, BIG_OFFSET_Y)
    }
  }
}
