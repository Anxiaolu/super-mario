import { describe, expect, test } from 'vitest';
import { getGameConfig } from '../src/gameConfig';

describe('Phaser 游戏配置', () => {
  test('使用手机横屏友好的固定逻辑分辨率和自适应缩放', () => {
    const config = getGameConfig();

    expect(config.width).toBe(960);
    expect(config.height).toBe(540);
    expect(config.parent).toBe('app');
    expect(config.scale).toMatchObject({
      mode: 3,
      autoCenter: 1,
      width: 960,
      height: 540,
    });
  });
});
