import { describe, expect, test } from 'vitest';
import levelOneData from '../src/levels/level1.json';
import levelTwoData from '../src/levels/level2.json';
import { applyButtonState, createInputState, getOrientationHint } from '../src/game/inputState';
import { parseLevel } from '../src/game/levelLoader';
import type { LevelData } from '../src/game/types';

describe('原创关卡内容', () => {
  test('第 1 关是教学关，包含终点、收集物和 2-3 个敌人', () => {
    const level = parseLevel(levelOneData as LevelData);

    expect(level.name).toBe('晨光草坡');
    expect(level.coins.length).toBeGreaterThanOrEqual(8);
    expect(level.enemies.length).toBeGreaterThanOrEqual(2);
    expect(level.enemies.length).toBeLessThanOrEqual(3);
    expect(level.goal.x).toBeGreaterThan(1600);
  });

  test('第 2 关是进阶关，包含更多敌人和更长地图', () => {
    const levelOne = parseLevel(levelOneData as LevelData);
    const levelTwo = parseLevel(levelTwoData as LevelData);

    expect(levelTwo.name).toBe('云莓山径');
    expect(levelTwo.width).toBeGreaterThan(levelOne.width);
    expect(levelTwo.enemies.length).toBeGreaterThanOrEqual(4);
    expect(levelTwo.enemies.length).toBeLessThanOrEqual(6);
    expect(levelTwo.coins.length).toBeGreaterThan(levelOne.coins.length);
  });
});

describe('手机输入状态', () => {
  test('触屏按钮会生成方向、跳跃和冲刺状态', () => {
    const state = applyButtonState(createInputState(), {
      left: true,
      right: false,
      jump: true,
      action: true,
    });

    expect(state.moveX).toBe(-1);
    expect(state.jump).toBe(true);
    expect(state.action).toBe(true);
  });

  test('左右按钮同时按下时不移动，横屏不显示旋转提示', () => {
    const state = applyButtonState(createInputState(), {
      left: true,
      right: true,
      jump: false,
      action: false,
    });

    expect(state.moveX).toBe(0);
    expect(getOrientationHint(390, 844)).toBe('请旋转设备进入横屏游玩');
    expect(getOrientationHint(844, 390)).toBeNull();
  });
});
