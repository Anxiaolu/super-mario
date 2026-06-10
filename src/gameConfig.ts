import type Phaser from 'phaser';

export const gameWidth = 960;
export const gameHeight = 540;
const rendererAuto = 0;
const scaleFit = 3;
const centerBoth = 1;

export function getGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: rendererAuto,
    parent: 'app',
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#9bdcff',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1400, x: 0 },
        debug: false,
      },
    },
    scale: {
      mode: scaleFit,
      autoCenter: centerBoth,
      width: gameWidth,
      height: gameHeight,
    },
  };
}
