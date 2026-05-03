import * as Phaser from 'phaser'

export function createEnemyAnims(scene: Phaser.Scene): void {
  // 蘑菇怪行走
  scene.anims.create({
    key: 'goomba-walk',
    frames: [
      { key: 'goomba-1' },
      { key: 'goomba-2' },
    ],
    frameRate: 6,
    repeat: -1,
  })

  // 蘑菇怪被踩扁
  scene.anims.create({
    key: 'goomba-flat',
    frames: [{ key: 'goomba-flat' }],
    frameRate: 1,
  })

  // 乌龟行走
  scene.anims.create({
    key: 'koopa-walk',
    frames: [
      { key: 'koopa-1' },
      { key: 'koopa-2' },
    ],
    frameRate: 6,
    repeat: -1,
  })

  // 龟壳（单帧）
  scene.anims.create({
    key: 'shell-idle',
    frames: [{ key: 'shell' }],
    frameRate: 1,
  })

  // 硬壳虫行走
  scene.anims.create({
    key: 'buzzy-walk',
    frames: [
      { key: 'buzzy-walk-1' },
      { key: 'buzzy-walk-2' },
    ],
    frameRate: 6,
    repeat: -1,
  })
}
