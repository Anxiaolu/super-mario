import * as Phaser from 'phaser'
import { KOOPA_SPEED } from '../config/constants'
import { ShellEnemy } from './ShellEnemy'

export class Koopa extends ShellEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'koopa-1', KOOPA_SPEED, 'koopa-walk', 'shell')
  }

  /** 向后兼容别名 */
  get koopaMode() { return this.shellModeState }
}
