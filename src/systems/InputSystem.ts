import * as Phaser from 'phaser'

export class InputSystem {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private runKey: Phaser.Input.Keyboard.Key
  private fireKey: Phaser.Input.Keyboard.Key
  private jumpKey: Phaser.Input.Keyboard.Key

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard
    if (!keyboard) {
      throw new Error('键盘输入不可用')
    }

    this.cursors = keyboard.createCursorKeys()
    this.runKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.fireKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  get isLeft(): boolean { return this.cursors.left.isDown }
  get isRight(): boolean { return this.cursors.right.isDown }
  get isUp(): boolean { return this.cursors.up.isDown }
  get isDown(): boolean { return this.cursors.down.isDown }
  get isJump(): boolean { return this.jumpKey.isDown }
  get isRun(): boolean { return this.runKey.isDown }
  get isFire(): boolean { return Phaser.Input.Keyboard.JustDown(this.fireKey) }
  get isJumpPressed(): boolean { return Phaser.Input.Keyboard.JustDown(this.jumpKey) }
}
