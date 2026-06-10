import { describe, expect, test, vi } from 'vitest';

vi.mock('phaser', () => {
  class Scene {
    scene = { start: () => undefined };
  }

  return {
    default: {
      Scene,
      Input: {
        Keyboard: {
          KeyCodes: {
            A: 65,
            D: 68,
            W: 87,
          },
        },
      },
    },
  };
});

import {
  buildCompletionSummary,
  completeLevel,
  createGameState,
  formatTimeRemaining,
  tickTimer,
} from '../src/game/gameState';
import { LevelScene } from '../src/scenes/LevelScene';
import type { RuntimePlatform } from '../src/game/types';

describe('HUD 与结算逻辑', () => {
  test('创建关卡状态时带有默认倒计时', () => {
    const state = createGameState(1);

    expect(state.timeRemainingSeconds).toBe(75);
    expect(state.timeBonusAwarded).toBe(0);
  });

  test('倒计时会递减，归零时触发 game-over', () => {
    const state = {
      ...createGameState(1),
      timeRemainingSeconds: 1.2,
    };

    const nextState = tickTimer(state, 0.5);
    const timeoutState = tickTimer(nextState, 1);

    expect(nextState.timeRemainingSeconds).toBeCloseTo(0.7);
    expect(timeoutState.timeRemainingSeconds).toBe(0);
    expect(timeoutState.status).toBe('game-over');
  });

  test('完成关卡时把剩余时间换算成奖励分数', () => {
    const state = {
      ...createGameState(2),
      score: 180,
      timeRemainingSeconds: 13.4,
    };

    const completedState = completeLevel(state);

    expect(completedState.timeBonusAwarded).toBe(65);
    expect(completedState.score).toBe(245);
    expect(completedState.status).toBe('completed');
  });

  test('完成第 1 关时会把时间奖励带入下一关分数', () => {
    const state = {
      ...createGameState(1),
      score: 80,
      timeRemainingSeconds: 10.9,
    };

    const nextLevelState = completeLevel(state);

    expect(nextLevelState.currentLevel).toBe(2);
    expect(nextLevelState.timeBonusAwarded).toBe(50);
    expect(nextLevelState.score).toBe(130);
    expect(nextLevelState.status).toBe('playing');
  });

  test('可以格式化 HUD 时间和结算摘要', () => {
    const summary = buildCompletionSummary({
      ...createGameState(2),
      score: 245,
      timeRemainingSeconds: 13.4,
      timeBonusAwarded: 65,
      status: 'completed',
    });

    expect(formatTimeRemaining(73.8)).toBe('01:13');
    expect(summary.title).toBe('两关通关');
    expect(summary.lines).toContain('时间奖励 +65');
    expect(summary.lines).toContain('最终分数 245');
  });

  test('同一帧到达终点时优先进入过关流程，不会先被判定超时', () => {
    const scene = new LevelScene() as LevelScene & Record<string, unknown>;
    const startScene = vi.fn();

    scene.scene = {
      start: startScene,
    } as unknown as typeof scene.scene;
    scene['gameState'] = {
      ...createGameState(1),
      timeRemainingSeconds: 0.01,
    };
    scene['isChangingScene'] = false;
    scene['updatePlatforms'] = vi.fn();
    scene['updatePlayer'] = vi.fn();
    scene['updateEnemies'] = vi.fn();
    scene['updateCoins'] = vi.fn();
    scene['updateCamera'] = vi.fn();
    scene['updateHud'] = vi.fn();
    scene['updateGoal'] = vi.fn(() => {
      scene['isChangingScene'] = true;
      startScene('LevelScene', { levelNumber: 2 });
    });

    scene.update(0, 16);

    expect(startScene).toHaveBeenCalledTimes(1);
    expect(startScene).toHaveBeenCalledWith('LevelScene', { levelNumber: 2 });
  });

  test('掉坑受伤后会回到出生点，避免在地图外连续扣命', () => {
    const scene = new LevelScene();
    const sceneAny = scene as unknown as Record<string, unknown>;

    sceneAny['level'] = {
      width: 960,
      height: 540,
      playerSpawn: { x: 96, y: 388 },
      goal: { x: 900, y: 360, width: 40, height: 120 },
    };
    sceneAny['gameState'] = createGameState(1);
    sceneAny['player'] = {
      shape: {
        setPosition: vi.fn(),
        setAlpha: vi.fn(),
      },
      x: 320,
      y: 700,
      width: 34,
      height: 52,
      motion: {
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        lastGroundedAtSeconds: Number.NEGATIVE_INFINITY,
        jumpPressedAtSeconds: null,
        landingSlowUntilSeconds: 0,
        hardLanding: false,
        controlLockedUntilSeconds: 0,
        invulnerableUntilSeconds: 0,
      },
    };
    sceneAny['platforms'] = [];
    sceneAny['time'] = { now: 1000 };

    (sceneAny['updatePlayer'] as (deltaSeconds: number) => void)(0.016);

    expect((sceneAny['gameState'] as { lives: number }).lives).toBe(2);
    expect((sceneAny['player'] as { y: number }).y).toBeLessThan((sceneAny['level'] as { height: number }).height);
    expect(
      ((sceneAny['player'] as { shape: { setPosition: ReturnType<typeof vi.fn> } }).shape.setPosition),
    ).toHaveBeenCalled();
  });

  test('塌陷平台不会在头顶碰撞中继续挡住玩家', () => {
    const scene = new LevelScene();
    const sceneAny = scene as unknown as Record<string, unknown>;

    sceneAny['player'] = {
      shape: {
        setPosition: vi.fn(),
        setAlpha: vi.fn(),
      },
      x: 120,
      y: 170,
      width: 34,
      height: 52,
      motion: {
        velocityX: 0,
        velocityY: -320,
        onGround: false,
        lastGroundedAtSeconds: Number.NEGATIVE_INFINITY,
        jumpPressedAtSeconds: null,
        landingSlowUntilSeconds: 0,
        hardLanding: false,
        controlLockedUntilSeconds: 0,
        invulnerableUntilSeconds: 0,
      },
    };
    sceneAny['platforms'] = [
      {
        data: {
          id: 'fragile-consumed',
          x: 90,
          y: 110,
          width: 120,
          height: 24,
          kind: 'fragile',
          visible: false,
          consumed: true,
        },
        shape: {
          setPosition: vi.fn(),
          setAlpha: vi.fn(),
        },
        previousX: 90,
        previousY: 110,
      },
    ];

    (sceneAny['resolvePlatformHeadHit'] as (previousY: number) => void)(150);

    expect((sceneAny['player'] as { motion: { velocityY: number } }).motion.velocityY).toBe(-320);
  });

  test('垂直移动平台会托着站立中的玩家一起移动', () => {
    const scene = new LevelScene();
    const sceneAny = scene as unknown as Record<string, unknown>;

    sceneAny['player'] = {
      shape: {
        setPosition: vi.fn(),
        setAlpha: vi.fn(),
      },
      x: 120,
      y: 174,
      width: 34,
      height: 52,
      motion: {
        velocityX: 0,
        velocityY: 0,
        onGround: true,
        lastGroundedAtSeconds: Number.NEGATIVE_INFINITY,
        jumpPressedAtSeconds: null,
        landingSlowUntilSeconds: 0,
        hardLanding: false,
        controlLockedUntilSeconds: 0,
        invulnerableUntilSeconds: 0,
      },
    };
    sceneAny['platforms'] = [
      {
        data: {
          id: 'lift-1',
          x: 80,
          y: 180,
          width: 160,
          height: 32,
          kind: 'moving',
          visible: true,
          moveAxis: 'y',
          moveMin: 160,
          moveMax: 240,
          moveSpeed: 40,
          direction: 1,
        },
        shape: {
          setPosition: vi.fn(),
          setAlpha: vi.fn(),
        },
        previousX: 80,
        previousY: 200,
      },
    ];

    (sceneAny['carryPlayerWithPlatform'] as () => void)();

    expect((sceneAny['player'] as { x: number }).x).toBe(120);
    expect((sceneAny['player'] as { y: number }).y).toBe(154);
  });
});
