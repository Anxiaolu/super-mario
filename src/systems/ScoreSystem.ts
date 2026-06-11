import * as Phaser from 'phaser'
import { GAME, SCORE } from '../config/constants'

export class ScoreSystem {
  private scene: Phaser.Scene
  private _score: number
  private _coins: number
  private _lives: number
  private _time: number

  constructor(scene: Phaser.Scene, timeLimit?: number) {
    this.scene = scene

    // 从 registry 恢复跨关卡持久化的状态
    this._score = this.scene.registry.get('score') ?? GAME.INITIAL_SCORE
    this._coins = this.scene.registry.get('coins') ?? GAME.INITIAL_COINS
    this._lives = this.scene.registry.get('lives') ?? GAME.INITIAL_LIVES
    this._time = timeLimit ?? GAME.INITIAL_TIME
  }

  private emitHud(type: string, value: number): void {
    this.scene.game.events.emit('update-hud', { type, value })
  }

  private persist(key: string, value: number): void {
    this.scene.registry.set(key, value)
  }

  addScore(points: number): void {
    this._score += points
    this.persist('score', this._score)
    this.emitHud('score', this._score)
    if (
      Math.floor((this._score - points) / SCORE.ONE_UP_SCORE) <
      Math.floor(this._score / SCORE.ONE_UP_SCORE)
    ) {
      this.addLife()
    }
  }

  addCoin(): void {
    this._coins++
    this.persist('coins', this._coins)
    this.emitHud('coins', this._coins)
    if (this._coins % 100 === 0) {
      this.addLife()
    }
  }

  addLife(): void {
    this._lives++
    this.persist('lives', this._lives)
    this.emitHud('lives', this._lives)
  }

  loseLife(): void {
    this._lives--
    this.persist('lives', this._lives)
    this.emitHud('lives', this._lives)
  }

  tick(): void {
    this._time--
    this.emitHud('time', this._time)
  }

  /** 将当前所有状态同步到 HUD（场景重启后初始化用） */
  syncToHud(): void {
    this.emitHud('score', this._score)
    this.emitHud('coins', this._coins)
    this.emitHud('lives', this._lives)
    this.emitHud('time', this._time)
  }

  get score(): number { return this._score }
  get coins(): number { return this._coins }
  get lives(): number { return this._lives }
  get time(): number { return this._time }
  get isGameOver(): boolean { return this._lives <= 0 }
  get isTimeUp(): boolean { return this._time <= 0 }
}
