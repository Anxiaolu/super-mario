import Phaser from 'phaser';

interface CompleteSceneData {
  score?: number;
  title?: string;
  message?: string;
}

export class CompleteScene extends Phaser.Scene {
  private score = 0;
  private title = '通关完成';
  private message = '点击重新开始';

  constructor() {
    super('CompleteScene');
  }

  init(data: CompleteSceneData): void {
    this.score = data.score ?? 0;
    this.title = data.title ?? '通关完成';
    this.message = data.message ?? '点击重新开始';
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x163646);
    this.add.ellipse(480, 560, 760, 220, 0x7a9352);
    this.add
      .text(480, 180, this.title, {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '56px',
        color: '#fff8df',
      })
      .setOrigin(0.5);
    this.add
      .text(480, 270, `分数 ${this.score}`, {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '32px',
        color: '#f6c85f',
      })
      .setOrigin(0.5);
    this.add
      .text(480, 360, this.message, {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '26px',
        color: '#ffffff',
        backgroundColor: '#e76f51',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('BootScene'));
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('BootScene'));
  }
}
