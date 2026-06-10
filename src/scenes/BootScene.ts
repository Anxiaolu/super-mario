import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x9bdcff);
    this.add.ellipse(210, 440, 360, 140, 0x8bcf78);
    this.add.ellipse(610, 470, 520, 180, 0x6fbf6a);
    this.add
      .text(480, 176, '云莓跳跳', {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '56px',
        color: '#263238',
        stroke: '#fff8df',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.add
      .text(480, 274, '原创手机端平台跳跃游戏', {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '24px',
        color: '#263238',
      })
      .setOrigin(0.5);
    this.add
      .text(480, 350, '点击或按空格开始', {
        fontFamily: 'Trebuchet MS, Noto Sans SC, sans-serif',
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#e76f51',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.startGame());
    this.input.keyboard?.once('keydown-SPACE', () => this.startGame());
  }

  private startGame(): void {
    this.scene.start('LevelScene', {
      levelNumber: 1,
      score: 0,
      lives: 3,
    });
  }
}
