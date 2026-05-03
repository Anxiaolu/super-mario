import * as Phaser from 'phaser'

function createLoopAnim(scene: Phaser.Scene, key: string, frameKeys: string[], frameRate = 10): void {
  scene.anims.create({
    key,
    frames: frameKeys.map(k => ({ key: k })),
    frameRate,
    repeat: -1,
  })
}

function createSingleAnim(scene: Phaser.Scene, key: string, frameKey: string): void {
  scene.anims.create({
    key,
    frames: [{ key: frameKey }],
    frameRate: 1,
  })
}

const STATES = ['small', 'big', 'fire'] as const

export function createMarioAnims(scene: Phaser.Scene): void {
  STATES.forEach(state => {
    const walkFrames = [1, 2, 3].map(i => `mario-${state}-walk-${i}`)
    createLoopAnim(scene, `mario-${state}-walk`, walkFrames)
    createSingleAnim(scene, `mario-${state}-jump`, `mario-${state}-jump`)
    createSingleAnim(scene, `mario-${state}-turn`, `mario-${state}-turn`)
  })

  // 蹲下只有大/火焰马里奥
  ;(['big', 'fire'] as const).forEach(state => {
    createSingleAnim(scene, `mario-${state}-duck`, `mario-${state}-duck`)
  })

  // 小马里奥死亡
  createSingleAnim(scene, 'mario-small-die', 'mario-small-die')
}
