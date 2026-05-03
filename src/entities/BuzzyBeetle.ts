import * as Phaser from 'phaser'
import { KOOPA_SPEED } from '../config/constants'
import { ShellEnemy } from './ShellEnemy'

export class BuzzyBeetle extends ShellEnemy {
  readonly fireImmune = true

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'buzzy-walk-1', KOOPA_SPEED, 'buzzy-walk', 'buzzy-shell')
  }

  /** 向后兼容别名 */
  get beetleMode() { return this.shellModeState }
}
