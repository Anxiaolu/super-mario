import Phaser from 'phaser';
import { getGameConfig } from './gameConfig';
import { BootScene } from './scenes/BootScene';
import { CompleteScene } from './scenes/CompleteScene';
import { LevelScene } from './scenes/LevelScene';
import { setupTouchControls } from './game/touchControls';
import './style.css';

setupTouchControls();

const config = {
  ...getGameConfig(),
  scene: [BootScene, LevelScene, CompleteScene],
};

new Phaser.Game(config);
