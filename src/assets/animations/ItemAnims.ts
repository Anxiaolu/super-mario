import * as Phaser from 'phaser'

export function createItemAnims(scene: Phaser.Scene): void {
  // 金币旋转
  scene.anims.create({
    key: 'coin-spin',
    frames: [
      { key: 'coin-1' },
      { key: 'coin-2' },
      { key: 'coin-3' },
      { key: 'coin-4' },
    ],
    frameRate: 8,
    repeat: -1,
  })

  // 问号砖闪烁
  scene.anims.create({
    key: 'question-blink',
    frames: [
      { key: 'tile-question-1' },
      { key: 'tile-question-2' },
      { key: 'tile-question-3' },
    ],
    frameRate: 4,
    repeat: -1,
  })

  // 星星旋转
  scene.anims.create({
    key: 'star-spin',
    frames: [
      { key: 'star-1' },
      { key: 'star-2' },
      { key: 'star-3' },
      { key: 'star-4' },
    ],
    frameRate: 10,
    repeat: -1,
  })
}
