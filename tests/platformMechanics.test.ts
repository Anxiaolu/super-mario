import { describe, expect, test } from 'vitest';
import levelTwoData from '../src/levels/level2.json';
import { getLandingVelocityY, stepDynamicPlatform } from '../src/game/platforms';
import { parseLevel } from '../src/game/levelLoader';
import type { LevelData, RuntimePlatform } from '../src/game/types';

describe('平台机关逻辑', () => {
  test('移动平台达到边界后会反向移动', () => {
    const platform: RuntimePlatform = {
      id: 'moving-1',
      x: 796,
      y: 330,
      width: 160,
      height: 32,
      kind: 'moving',
      moveAxis: 'x',
      moveMin: 760,
      moveMax: 800,
      moveSpeed: 80,
      direction: 1,
    };

    const nextPlatform = stepDynamicPlatform(platform, 0.2);

    expect(nextPlatform.x).toBe(800);
    expect(nextPlatform.direction).toBe(-1);
  });

  test('弹簧平台落地时会返回更强的起跳速度', () => {
    const springVelocityY = getLandingVelocityY(
      {
        id: 'spring-1',
        x: 1480,
        y: 284,
        width: 70,
        height: 16,
        kind: 'spring',
        bounceVelocity: -920,
      },
      -620,
    );

    expect(springVelocityY).toBe(-920);
  });
});

describe('第 2 关机关内容', () => {
  test('第 2 关包含至少一个移动平台和一个弹簧平台', () => {
    const level = parseLevel(levelTwoData as LevelData);

    const movingPlatforms = level.platforms.filter((platform) => platform.kind === 'moving');
    const springPlatforms = level.platforms.filter((platform) => platform.kind === 'spring');

    expect(movingPlatforms.length).toBeGreaterThanOrEqual(1);
    expect(springPlatforms.length).toBeGreaterThanOrEqual(1);
  });
});
