import * as Phaser from 'phaser'
import { Mario } from '../entities/Mario'
import { Goomba } from '../entities/Goomba'
import { Koopa } from '../entities/Koopa'
import { BuzzyBeetle } from '../entities/BuzzyBeetle'
import { HammerBro } from '../entities/HammerBro'
import { isEnemy, type Enemy } from '../utils/typeGuards'
import {
  TILE,
  BREAKABLE_TILES,
  QUESTION_TILES,
  SCORE,
  TILE_SIZE,
  MUSHROOM_SPEED,
} from '../config/constants'
import { SoundGenerator } from '../assets/audio/SoundGenerator'
import { ScoreSystem } from './ScoreSystem'

type ArcadeBody = Phaser.Physics.Arcade.Body

export class CollisionSystem {
  private scene: Phaser.Scene
  private mario: Mario
  private enemies: Phaser.Physics.Arcade.Group
  private items: Phaser.Physics.Arcade.Group
  private groundLayer: Phaser.Tilemaps.TilemapLayer
  private sfx: SoundGenerator
  private scoreSystem: ScoreSystem
  private combo = 0
  private comboTimer = 0

  constructor(
    scene: Phaser.Scene,
    mario: Mario,
    enemies: Phaser.Physics.Arcade.Group,
    items: Phaser.Physics.Arcade.Group,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    sfx: SoundGenerator,
    scoreSystem: ScoreSystem,
  ) {
    this.scene = scene
    this.mario = mario
    this.enemies = enemies
    this.items = items
    this.groundLayer = groundLayer
    this.sfx = sfx
    this.scoreSystem = scoreSystem
  }

  setupCollisions(): void {
    // 敌人与地形（碰壁反转）
    this.scene.physics.add.collider(this.enemies, this.groundLayer, (obj1, obj2) => {
      const enemyObj = isEnemy(obj1) ? obj1 : isEnemy(obj2) ? obj2 : null
      if (!enemyObj) return
      const body = enemyObj.body as ArcadeBody
      if (body.blocked.left || body.blocked.right) {
        enemyObj.reverse()
      }
    })

    // 马里奥与敌人
    this.scene.physics.add.collider(this.mario, this.enemies, (marioObj, enemyObj) => {
      if (!(marioObj instanceof Mario) || !isEnemy(enemyObj)) return
      const marioBody = marioObj.body as ArcadeBody
      const enemyBody = enemyObj.body as ArcadeBody

      // 踩杀判定：马里奥中心高于敌人中心，且正在下落
      const marioCenterY = marioBody.top + marioBody.halfHeight
      const enemyCenterY = enemyBody.top + enemyBody.halfHeight
      const isStomp = marioCenterY < enemyCenterY && marioBody.velocity.y >= 0

      if (isStomp) {
        this.handleStomp(marioObj, enemyObj)
      } else {
        marioObj.hit()
      }
    })

    // 马里奥与道具
    this.scene.physics.add.overlap(this.mario, this.items, (marioObj, itemObj) => {
      if (!(marioObj instanceof Mario)) return
      const sprite = itemObj as Phaser.Physics.Arcade.Sprite
      const itemType = sprite.getData('type') as string

      switch (itemType) {
        case 'mushroom':
          marioObj.grow()
          this.scoreSystem.addScore(SCORE.MUSHROOM)
          this.sfx.playPowerup()
          break
        case 'coin':
          this.scoreSystem.addScore(SCORE.COIN)
          this.scoreSystem.addCoin()
          this.sfx.playCoin()
          break
        case 'star':
          marioObj.goInvincible()
          this.scoreSystem.addScore(SCORE.STAR)
          this.sfx.playPowerup()
          break
        case 'flower':
          marioObj.goFire()
          this.scoreSystem.addScore(SCORE.FLOWER)
          this.sfx.playPowerup()
          break
      }

      sprite.destroy()
    })
  }

  // 踩杀处理
  private handleStomp(mario: Mario, enemy: Enemy): void {
    if (enemy instanceof Goomba) {
      enemy.stomp()
      mario.bounceOffEnemy()
      this.addComboScore(SCORE.GOOMBA_STOMP)
      this.sfx.playStomp()
    } else if (enemy instanceof Koopa) {
      if (enemy.koopaMode === 'walking') {
        enemy.stomp(mario.x)
      } else if (enemy.koopaMode === 'shell_idle') {
        enemy.kick(mario.x)
      } else if (enemy.koopaMode === 'shell_moving') {
        enemy.stomp(mario.x)
      }
      mario.bounceOffEnemy()
      this.addComboScore(SCORE.KOOPA_STOMP)
      this.sfx.playStomp()
    } else if (enemy instanceof BuzzyBeetle) {
      if (enemy.beetleMode === 'walking') {
        enemy.stomp(mario.x)
      } else if (enemy.beetleMode === 'shell_idle') {
        enemy.kick(mario.x)
      } else if (enemy.beetleMode === 'shell_moving') {
        enemy.stomp(mario.x)
      }
      mario.bounceOffEnemy()
      this.addComboScore(SCORE.KOOPA_STOMP)
      this.sfx.playStomp()
    } else if (enemy instanceof HammerBro) {
      enemy.stomp()
      mario.bounceOffEnemy()
      this.addComboScore(SCORE.KOOPA_STOMP)
      this.sfx.playStomp()
    }
  }

  // 马里奥从下方顶砖块
  handleBlockHit(mario: Mario, tile: Phaser.Tilemaps.Tile): void {
    const tileId = tile.index

    if (QUESTION_TILES.includes(tileId as typeof QUESTION_TILES[number])) {
      this.replaceWithUsedBlock(tile)
      this.spawnItemFromBlock(tile, tileId)
      this.bumpTile(tile)
      this.sfx.playCoin()
      return
    }

    if (BREAKABLE_TILES.includes(tileId as typeof BREAKABLE_TILES[number])) {
      if (mario.isBig) {
        this.breakBlock(tile)
        this.sfx.playBreak()
      } else {
        this.bumpTile(tile)
        this.sfx.playBump()
      }
    }
  }

  private replaceWithUsedBlock(tile: Phaser.Tilemaps.Tile): void {
    this.groundLayer.putTileAt(TILE.USED_BLOCK, tile.x, tile.y)
  }

  private spawnItemFromBlock(tile: Phaser.Tilemaps.Tile, originalTileId: number): void {
    if (originalTileId === TILE.QUESTION_MUSHROOM) {
      this.spawnMushroom(tile.pixelX, tile.pixelY)
    } else {
      this.spawnCoinEffect(tile.pixelX, tile.pixelY)
      this.scoreSystem.addScore(SCORE.COIN)
      this.scoreSystem.addCoin()
    }
  }

  private spawnMushroom(x: number, y: number): void {
    const mushroom = this.scene.physics.add.sprite(x + TILE_SIZE / 2, y - TILE_SIZE, 'mushroom-red')
    mushroom.setData('type', 'mushroom')
    const body = mushroom.body as ArcadeBody
    body.setVelocityX(MUSHROOM_SPEED)
    body.setBounce(0)
    body.setSize(14, 14)
    body.setOffset(1, 2)
    this.items.add(mushroom)

    // 蘑菇碰壁反转
    this.scene.physics.add.collider(mushroom, this.groundLayer, (obj) => {
      if (!(obj instanceof Phaser.Physics.Arcade.Sprite) || !obj.body) return
      const mBody = obj.body as ArcadeBody
      if (mBody.blocked.left || mBody.blocked.right) {
        mBody.setVelocityX(-mBody.velocity.x)
      }
    })
  }

  private spawnCoinEffect(x: number, y: number): void {
    const coin = this.scene.add.sprite(x + TILE_SIZE / 2, y, 'coin-1')
    coin.play('coin-spin')
    this.scene.tweens.add({
      targets: coin,
      y: y - TILE_SIZE * 2,
      duration: 300,
      yoyo: true,
      onComplete: () => coin.destroy(),
    })
  }

  private bumpTile(tile: Phaser.Tilemaps.Tile): void {
    const t = this.groundLayer.getTileAt(tile.x, tile.y)
    if (!t) return
    const origY = t.pixelY
    this.scene.tweens.add({
      targets: { val: 0 },
      val: 1,
      duration: 60,
      yoyo: true,
      onUpdate: (_tween, target) => {
        const offset = Math.sin((target as { val: number }).val * Math.PI) * 4
        t.pixelY = origY - offset
      },
      onComplete: () => { t.pixelY = origY },
    })
  }

  private breakBlock(tile: Phaser.Tilemaps.Tile): void {
    this.groundLayer.removeTileAt(tile.x, tile.y)
    const cx = tile.pixelX + TILE_SIZE / 2
    const cy = tile.pixelY + TILE_SIZE / 2

    const configs = [
      { dx: -4, dy: -8, vx: -60, vy: -200 },
      { dx: 4, dy: -8, vx: 60, vy: -200 },
      { dx: -4, dy: -2, vx: -40, vy: -120 },
      { dx: 4, dy: -2, vx: 40, vy: -120 },
    ]

    for (let i = 0; i < configs.length; i++) {
      const c = configs[i]
      const texKey = i % 2 === 0 ? 'brick-debris-1' : 'brick-debris-2'
      const debris = this.scene.physics.add.sprite(cx + c.dx, cy + c.dy, texKey)
      debris.setVelocity(c.vx, c.vy)
      debris.setGravityY(400)
      this.scene.time.delayedCall(600, () => { if (debris.active) debris.destroy() })
    }
  }

  // 连击加分：2 秒内连续踩杀累加倍率
  private addComboScore(basePoints: number): void {
    const now = this.scene.time.now
    if (now < this.comboTimer) {
      this.combo = Math.min(this.combo + 1, 8)
    } else {
      this.combo = 0
    }
    this.comboTimer = now + 2000
    const multiplier = Math.pow(SCORE.COMBO_MULTIPLIER, this.combo)
    this.scoreSystem.addScore(basePoints * multiplier)
  }
}