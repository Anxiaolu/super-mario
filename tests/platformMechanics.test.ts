import { describe, expect, test } from 'vitest';
import levelOneData from '../src/levels/level1.json';
import levelTwoData from '../src/levels/level2.json';
import {
  armFragilePlatform,
  getLandingVelocityY,
  revealHiddenPlatform,
  stepDynamicPlatform,
} from '../src/game/platforms';
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
      visible: true,
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

  test('移动平台允许 moveMin 为 0', () => {
    const platform: RuntimePlatform = {
      id: 'moving-zero',
      x: 10,
      y: 330,
      width: 160,
      height: 32,
      kind: 'moving',
      visible: true,
      moveAxis: 'x',
      moveMin: 0,
      moveMax: 120,
      moveSpeed: 50,
      direction: -1,
    };

    const nextPlatform = stepDynamicPlatform(platform, 0.1);

    expect(nextPlatform.x).toBe(5);
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
        visible: true,
        bounceVelocity: -920,
      },
      -620,
    );

    expect(springVelocityY).toBe(-920);
  });

  test('隐藏块命中后会从不可见变为可见', () => {
    const revealed = revealHiddenPlatform({
      id: 'hidden-1',
      x: 520,
      y: 280,
      width: 44,
      height: 44,
      kind: 'hidden',
      visible: false,
    });

    expect(revealed.visible).toBe(true);
  });

  test('一次性平台被触发后到时间会塌陷失效', () => {
    const armedPlatform = armFragilePlatform(
      {
        id: 'fragile-1',
        x: 860,
        y: 300,
        width: 120,
        height: 24,
        kind: 'fragile',
        visible: true,
        collapseDelaySeconds: 0.35,
      },
      2,
    );

    const collapsed = stepDynamicPlatform(armedPlatform, 0.4, 2.4);

    expect(armedPlatform.collapseAtSeconds).toBeCloseTo(2.35);
    expect(collapsed.consumed).toBe(true);
    expect(collapsed.visible).toBe(false);
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

  test('第 1 关包含至少一个隐藏块，第 2 关包含至少一个一次性平台', () => {
    const levelOne = parseLevel(levelOneData as LevelData);
    const levelTwo = parseLevel(levelTwoData as LevelData);

    const hiddenPlatforms = levelOne.platforms.filter((platform) => platform.kind === 'hidden');
    const fragilePlatforms = levelTwo.platforms.filter((platform) => platform.kind === 'fragile');

    expect(hiddenPlatforms.length).toBeGreaterThanOrEqual(1);
    expect(fragilePlatforms.length).toBeGreaterThanOrEqual(1);
  });
});
