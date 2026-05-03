import * as Phaser from 'phaser'

// 5x5 像素字形
const GLYPHS: Record<string, number[]> = {
  '0': [0b01110,0b10001,0b10001,0b10001,0b01110],
  '1': [0b00100,0b01100,0b00100,0b00100,0b01110],
  '2': [0b01110,0b10001,0b00110,0b01000,0b11111],
  '3': [0b01110,0b10001,0b00110,0b10001,0b01110],
  '4': [0b00010,0b00110,0b01010,0b11111,0b00010],
  '5': [0b11111,0b10000,0b11110,0b00001,0b11110],
  '6': [0b01110,0b10000,0b11110,0b10001,0b01110],
  '7': [0b11111,0b00001,0b00010,0b00100,0b01000],
  '8': [0b01110,0b10001,0b01110,0b10001,0b01110],
  '9': [0b01110,0b10001,0b01111,0b00001,0b01110],
  'M': [0b10001,0b11011,0b10101,0b10001,0b10001],
  'A': [0b01110,0b10001,0b11111,0b10001,0b10001],
  'R': [0b11110,0b10001,0b11110,0b10100,0b10010],
  'I': [0b01110,0b00100,0b00100,0b00100,0b01110],
  'O': [0b10001,0b10001,0b10101,0b10001,0b01110],
  'W': [0b10001,0b10001,0b10101,0b11011,0b10001],
  'L': [0b10000,0b10000,0b10000,0b10000,0b11111],
  'D': [0b11100,0b10010,0b10001,0b10010,0b11100],
  'T': [0b11111,0b00100,0b00100,0b00100,0b00100],
  'E': [0b11111,0b10000,0b11110,0b10000,0b11111],
  'x': [0b00000,0b00000,0b10101,0b01010,0b00000],
  '-': [0b00000,0b00000,0b11111,0b00000,0b00000],
  ' ': [0,0,0,0,0],
}

const CW = 5
const CH = 6

export class UIScene extends Phaser.Scene {
  private scoreImg: Phaser.GameObjects.Image | null = null
  private coinImg: Phaser.GameObjects.Image | null = null
  private timeImg: Phaser.GameObjects.Image | null = null
  private livesImg: Phaser.GameObjects.Image | null = null

  constructor() {
    super({ key: 'UIScene' })
  }

  create(): void {
    this.game.events.off('update-hud', this.handleUpdate, this)

    // 固定标签
    this.makeTextTexture('txt-mario', 'MARIO')
    this.add.image(8, 2, 'txt-mario').setOrigin(0, 0)

    this.makeTextTexture('txt-x', 'x')
    this.add.image(96, 10, 'txt-x').setOrigin(0, 0)

    this.makeTextTexture('txt-world', 'WORLD')
    this.add.image(140, 2, 'txt-world').setOrigin(0, 0)

    // 从场景数据获取关卡编号，默认 '1-1'
    const initData = this.scene.settings.data as { levelId?: string } | undefined
    const levelId = initData?.levelId ?? '1-1'
    this.makeTextTexture('txt-level', levelId)
    this.add.image(146, 10, 'txt-level').setOrigin(0, 0)

    this.makeTextTexture('txt-time-label', 'TIME')
    this.add.image(206, 2, 'txt-time-label').setOrigin(0, 0)

    // 动态数值
    this.refreshText('score', '000000')
    this.refreshText('coins', '00')
    this.refreshText('lives', '03')
    this.refreshText('time', '400')

    this.game.events.on('update-hud', this.handleUpdate, this)
  }

  private handleUpdate(data: { type: string; value: number }): void {
    switch (data.type) {
      case 'score':
        this.refreshText('score', String(data.value).padStart(6, '0'))
        break
      case 'coins':
        this.refreshText('coins', String(data.value).padStart(2, '0'))
        break
      case 'time':
        this.refreshText('time', String(data.value).padStart(3, '0'))
        break
      case 'lives':
        this.refreshText('lives', String(data.value).padStart(2, '0'))
        break
    }
  }

  private refreshText(id: string, text: string): void {
    const pos = { score: { x: 8, y: 10 }, coins: { x: 104, y: 10 }, lives: { x: 128, y: 10 }, time: { x: 210, y: 10 } }[id]
    if (!pos) return

    const oldImg = id === 'score' ? this.scoreImg : id === 'coins' ? this.coinImg : id === 'lives' ? this.livesImg : this.timeImg
    const texKey = `txt-${id}`
    if (oldImg) {
      oldImg.destroy()
    }
    // 先清理旧纹理，避免 Texture Manager 累积
    if (this.textures.exists(texKey)) {
      this.textures.remove(texKey)
    }

    this.makeTextTexture(texKey, text)
    const img = this.add.image(pos.x, pos.y, texKey).setOrigin(0, 0)

    if (id === 'score') this.scoreImg = img
    else if (id === 'coins') this.coinImg = img
    else if (id === 'lives') this.livesImg = img
    else this.timeImg = img
  }

  private makeTextTexture(key: string, text: string): void {
    const lines = text.split('\n')
    const maxLen = Math.max(...lines.map(l => l.length))
    const w = Math.max(maxLen * CW, 1)
    const h = Math.max(lines.length * CH, 1)

    const g = this.add.graphics()
    g.fillStyle(0xffffff)

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li]
      for (let ci = 0; ci < line.length; ci++) {
        const glyph = GLYPHS[line[ci]]
        if (!glyph) continue
        for (let gy = 0; gy < 5; gy++) {
          const bits = glyph[gy]
          for (let gx = 0; gx < 5; gx++) {
            if (bits & (1 << (4 - gx))) {
              g.fillRect(ci * CW + gx, li * CH + gy, 1, 1)
            }
          }
        }
      }
    }

    g.generateTexture(key, w, h)
    g.destroy()
  }

  shutdown(): void {
    this.game.events.off('update-hud', this.handleUpdate, this)
  }
}
