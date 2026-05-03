import * as Phaser from 'phaser'
import { Mario } from '../entities/Mario'
import { Goomba } from '../entities/Goomba'
import { Koopa } from '../entities/Koopa'
import { BuzzyBeetle } from '../entities/BuzzyBeetle'
import { Bowser } from '../entities/Bowser'
import { HammerBro } from '../entities/HammerBro'
import { Hammer } from '../entities/Hammer'
import { Fireball } from '../entities/Fireball'
import { PiranhaPlant } from '../entities/PiranhaPlant'
import { Flagpole } from '../entities/Flagpole'
import { InputSystem } from '../systems/InputSystem'
import { LevelSystem } from '../systems/LevelSystem'
import { CameraSystem } from '../systems/CameraSystem'
import { CollisionSystem } from '../systems/CollisionSystem'
import { ScoreSystem } from '../systems/ScoreSystem'
import { SoundGenerator } from '../assets/audio/SoundGenerator'
import { MusicGenerator, MusicTheme } from '../assets/audio/MusicGenerator'
import { getLevel, getLevelCount } from '../data/levels'
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT, SKY_COLOR, UNDERGROUND_BG } from '../config/constants'
import type { LevelData } from '../data/levels/types'

export class GameScene extends Phaser.Scene {
  private mario!: Mario
  private inputSystem!: InputSystem
  private cameraSystem!: CameraSystem
  private collisionSystem!: CollisionSystem
  private scoreSystem!: ScoreSystem
  private sfx!: SoundGenerator
  private music!: MusicGenerator
  private flagpole!: Flagpole
  private enemies!: Phaser.Physics.Arcade.Group
  private items!: Phaser.Physics.Arcade.Group
  private fireballs!: Phaser.Physics.Arcade.Group
  private piranhas!: Phaser.Physics.Arcade.Group
  private bowser!: Bowser | null
  private hammers!: Phaser.Physics.Arcade.Group
  private currentLevel!: LevelData
  private timeAccum = 0
  private isLevelComplete = false
  private isPaused = false

  /** 当前关卡索引，通过 registry 在场景重启间持久化 */
  private levelIndex = 0

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    // 状态初始化
    this.isLevelComplete = false
    this.isPaused = false
    this.timeAccum = 0
    this.levelIndex = this.registry.get('levelIndex') ?? 0
    this.currentLevel = getLevel(this.levelIndex)

    // 系统初始化
    this.inputSystem = new InputSystem(this)
    this.scoreSystem = new ScoreSystem(this, this.currentLevel.metadata.timeLimit)
    this.resetIfNeeded()
    this.sfx = SoundGenerator.getInstance()
    this.music = MusicGenerator.getInstance()
    this.setupTheme()

    // 关卡构建
    const { groundLayer, mapWidth } = this.buildLevel()

    // 物理碰撞
    this.setupPhysics(groundLayer)

    // 相机和 HUD
    this.cameraSystem = new CameraSystem(this, mapWidth)
    this.cameraSystem.startFollow(this.mario)
    this.scene.launch('UIScene', { levelId: this.currentLevel.id })
    this.scoreSystem.syncToHud()

    // 事件监听
    this.setupEvents()
  }

  private resetIfNeeded(): void {
    if (this.registry.get('needsReset')) {
      this.registry.set('score', 0)
      this.registry.set('coins', 0)
      this.registry.set('needsReset', false)
    }
  }

  private setupTheme(): void {
    const bgColor = this.currentLevel.metadata.backgroundColor ?? SKY_COLOR
    this.cameras.main.setBackgroundColor(bgColor)

    let musicTheme: MusicTheme = 'overworld'
    if (bgColor === UNDERGROUND_BG) {
      musicTheme = 'underground'
    } else if (bgColor === '#181818') {
      musicTheme = 'castle'
    }
    this.music.play(musicTheme)
  }

  private buildLevel(): { groundLayer: Phaser.Tilemaps.TilemapLayer; mapWidth: number } {
    const levelSystem = new LevelSystem(this, this.currentLevel)
    const { groundLayer, mapWidth } = levelSystem.build()

    this.enemies = this.physics.add.group({ allowGravity: true })
    this.items = this.physics.add.group({ allowGravity: true })
    this.fireballs = this.physics.add.group({ allowGravity: true, maxSize: 2 })
    this.piranhas = this.physics.add.group({ allowGravity: false })
    this.hammers = this.physics.add.group({ allowGravity: true })

    const { playerStartX, playerStartY } = this.currentLevel.metadata
    this.mario = new Mario(
      this,
      playerStartX * TILE_SIZE + TILE_SIZE / 2,
      playerStartY * TILE_SIZE + TILE_SIZE,
    )

    this.spawnEnemies()
    this.setupBowserCollisions(groundLayer)

    const { flagpoleX } = this.currentLevel.metadata
    this.flagpole = new Flagpole(this, flagpoleX, 4, 12)

    return { groundLayer, mapWidth }
  }

  private setupPhysics(groundLayer: Phaser.Tilemaps.TilemapLayer): void {
    this.collisionSystem = new CollisionSystem(
      this, this.mario, this.enemies, this.items, groundLayer, this.sfx,
      this.scoreSystem,
    )
    this.collisionSystem.setupCollisions()

    // 马里奥与地形碰撞（含顶砖回调）
    this.physics.add.collider(this.mario, groundLayer, (obj1, obj2) => {
      if (!(obj1 instanceof Mario)) return
      const tile = obj2 as Phaser.Tilemaps.Tile
      const body = obj1.body as Phaser.Physics.Arcade.Body
      if (body.blocked.up && tile.index !== 0) {
        this.collisionSystem.handleBlockHit(obj1, tile)
      }
    })

    // 火球与地形碰撞
    this.physics.add.collider(this.fireballs, groundLayer, (obj) => {
      if (!(obj instanceof Fireball)) return
      const body = obj.body as Phaser.Physics.Arcade.Body
      if (body.blocked.left || body.blocked.right) {
        obj.destroy()
      }
    })

    // 火球与敌人碰撞
    this.physics.add.overlap(this.fireballs, this.enemies, (fbObj, enemyObj) => {
      if (!(fbObj instanceof Fireball)) return
      const enemy = enemyObj as unknown as Goomba | Koopa | BuzzyBeetle | HammerBro
      if (!fbObj.active) return
      if (enemy instanceof BuzzyBeetle || !enemy.alive) {
        fbObj.destroy()
        return
      }
      enemy.kill()
      fbObj.destroy()
      this.sfx.playStomp()
    })

    // 火球与食人花碰撞
    this.physics.add.overlap(this.fireballs, this.piranhas, (fbObj, plantObj) => {
      if (!(fbObj instanceof Fireball) || !(plantObj instanceof PiranhaPlant)) return
      if (!fbObj.active || !plantObj.active || !plantObj.alive) return
      plantObj.kill()
      fbObj.destroy()
      this.sfx.playStomp()
    })

    // 马里奥与食人花碰撞
    this.physics.add.overlap(this.mario, this.piranhas, (marioObj, plantObj) => {
      if (!(marioObj instanceof Mario) || !(plantObj instanceof PiranhaPlant)) return
      if (!plantObj.active || !plantObj.alive || marioObj.isDead) return
      marioObj.hit()
    })

    // 锤子与地形碰撞
    this.physics.add.collider(this.hammers, groundLayer)

    // Mario 与锤子碰撞
    this.physics.add.overlap(this.mario, this.hammers, (marioObj) => {
      if (!(marioObj instanceof Mario)) return
      if (!marioObj.isDead) marioObj.hit()
    })
  }

  private setupEvents(): void {
    this.events.on('hammer-throw', this.handleHammerThrow, this)
    this.events.on('bowser-fire', this.handleBowserFire, this)
    this.events.on('mario-shoot', this.handleMarioShoot, this)
    this.events.on('mario-died', this.handleMarioDied, this)
  }

  update(time: number, delta: number): void {
    if (this.isPaused || this.isLevelComplete) return

    this.mario.handleInput(this.inputSystem, delta)
    this.mario.update(time, delta)
    this.cameraSystem.update()

    // 更新敌人（直接迭代，避免数组展开）
    for (const child of this.enemies.getChildren()) {
      const enemy = child as Goomba | Koopa | BuzzyBeetle | HammerBro
      if (enemy.active) {
        enemy.update(time, delta)
      }
    }

    // 更新火球
    for (const child of this.fireballs.getChildren()) {
      const fb = child as Fireball
      if (fb.active) {
        fb.update(time, delta)
      }
    }

    // 更新食人花
    for (const child of this.piranhas.getChildren()) {
      const plant = child as PiranhaPlant
      if (plant.active) {
        plant.update(time, delta, this.mario.x, this.mario.y)
      }
    }

    // 更新锤子
    for (const child of this.hammers.getChildren()) {
      const hm = child as Hammer
      if (hm.active) {
        hm.update(time, delta)
      }
    }

    // 更新 Bowser
    if (this.bowser?.active) {
      this.bowser.update(time, delta)
    }

    // 计时器
    this.timeAccum += delta
    if (this.timeAccum >= 1000) {
      this.timeAccum -= 1000
      this.scoreSystem.tick()
      if (this.scoreSystem.isTimeUp) {
        this.mario.die()
      }
    }

    // 掉落检测
    if (this.mario.y > GAME_HEIGHT + 16) {
      this.mario.die()
    }

    // 限制 Mario 不能走出相机左边界（单向卷轴，不跟随后退）
    const camLeft = this.cameras.main.scrollX
    const minX = camLeft + 8
    if (this.mario.x < minX) {
      this.mario.x = minX
      const body = this.mario.body as Phaser.Physics.Arcade.Body
      if (body && body.velocity.x < 0) {
        body.velocity.x = 0
      }
    }

    // 旗杆检测（仅存活时触发）
    if (!this.mario.isDead && !this.flagpole.reached && this.flagpole.checkReach(this.mario.x, this.mario.y)) {
      this.handleFlagReached()
    }
  }

  private spawnEnemies(): void {
    const { enemies } = this.currentLevel.metadata
    for (const spawn of enemies) {
      const x = spawn.x * TILE_SIZE + TILE_SIZE / 2
      const y = spawn.y * TILE_SIZE + TILE_SIZE
      if (spawn.type === 'goomba') {
        this.enemies.add(new Goomba(this, x, y))
      } else if (spawn.type === 'koopa') {
        this.enemies.add(new Koopa(this, x, y))
      } else if (spawn.type === 'buzzy') {
        this.enemies.add(new BuzzyBeetle(this, x, y))
      } else if (spawn.type === 'piranha') {
        this.piranhas.add(new PiranhaPlant(this, x, y))
      } else if (spawn.type === 'bowser') {
        this.bowser = new Bowser(this, x, y)
      } else if (spawn.type === 'hammer') {
        const hb = new HammerBro(this, x, y)
        this.enemies.add(hb)
      }
    }
  }

  private restartScene(): void {
    this.music.stop()
    this.scene.stop('UIScene')
    this.scene.restart()
  }

  private setupBowserCollisions(groundLayer: Phaser.Tilemaps.TilemapLayer): void {
    if (!this.bowser) return

    // Bowser 与地形碰撞
    this.physics.add.collider(this.bowser, groundLayer)

    // Mario 与 Bowser 碰撞（踩头无效，直接受伤）
    this.physics.add.overlap(this.mario, this.bowser, (marioObj) => {
      if (!(marioObj instanceof Mario)) return
      if (marioObj.isDead || !this.bowser?.alive) return
      marioObj.hit()
    })

    // 火球与 Bowser 碰撞
    this.physics.add.overlap(this.fireballs, this.bowser, (fbObj) => {
      if (!(fbObj instanceof Fireball)) return
      if (!fbObj.active || !this.bowser?.alive) return
      this.bowser.hit()
      fbObj.destroy()
      this.sfx.playStomp()
    })
  }

  private handleHammerThrow(x: number, y: number, dir: number): void {
    const hammer = new Hammer(this, x, y, dir)
    this.hammers.add(hammer)
  }

  private handleBowserFire(x: number, y: number, facingRight: boolean): void {
    if (!this.bowser?.alive) return
    const fb = new Fireball(this, x, y - 4, facingRight)
    // 降低 Bowser 火球速度
    if (fb.body) {
      const body = fb.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(facingRight ? 100 : -100)
      body.setVelocityY(-40)
    }
    this.fireballs.add(fb)
  }

  private handleMarioShoot(x: number, y: number, facingRight: boolean): void {
    // 限制最多 2 个火球（原版规则）
    if (this.fireballs.getLength() >= 2) return
    const offsetX = facingRight ? 8 : -8
    const fireball = new Fireball(this, x + offsetX, y - 8, facingRight)
    this.fireballs.add(fireball)
    this.sfx.playFireball()
  }

  private handleMarioDied(): void {
    this.scoreSystem.loseLife()
    this.isPaused = true
    if (this.scoreSystem.isGameOver) {
      this.add.text(GAME_WIDTH / 2 - 40, GAME_HEIGHT / 2 - 8, 'GAME OVER', {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      // 游戏结束，重置到第一关
      this.registry.set('levelIndex', 0)
      this.registry.set('needsReset', true)
      this.time.delayedCall(3000, () => {
        this.restartScene()
      })
    } else {
      this.time.delayedCall(1000, () => {
        this.restartScene()
      })
    }
  }

  private handleFlagReached(): void {
    this.isLevelComplete = true
    this.sfx.playFlagpole()

    this.flagpole.playCompleteSequence(this.mario, () => {
      // 时间奖励
      const remaining = this.scoreSystem.time
      this.scoreSystem.addScore(remaining * 50)

      // 显示通关文字
      const tx = this.cameras.main.scrollX + GAME_WIDTH / 2 - 48
      this.add.text(tx, GAME_HEIGHT / 2 - 8, 'COURSE CLEAR!', {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })

      this.time.delayedCall(3000, () => {
        const nextIndex = this.levelIndex + 1
        if (nextIndex < getLevelCount()) {
          this.registry.set('levelIndex', nextIndex)
        } else {
          this.registry.set('levelIndex', 0)
        }
        this.restartScene()
      })
    })
  }

  shutdown(): void {
    this.events.off('mario-died', this.handleMarioDied, this)
    this.events.off('mario-shoot', this.handleMarioShoot, this)
    this.events.off('bowser-fire', this.handleBowserFire, this)
    this.events.off('hammer-throw', this.handleHammerThrow, this)
  }
}
