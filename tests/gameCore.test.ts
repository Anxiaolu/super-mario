import { describe, expect, test } from 'vitest';
import { resolvePlayerEnemyCollision, stepEnemyPatrol } from '../src/game/enemies';
import { collectCoin, completeLevel, createGameState, damagePlayer } from '../src/game/gameState';
import { parseLevel } from '../src/game/levelLoader';
import type { LevelData } from '../src/game/types';

const levelData: LevelData = {
  id: 'level-1',
  name: '晨光草坡',
  width: 2400,
  height: 540,
  playerSpawn: { x: 96, y: 388 },
  goal: { x: 2240, y: 372, width: 48, height: 96 },
  platforms: [
    { id: 'ground-1', x: 0, y: 460, width: 720, height: 80 },
    { id: 'step-1', x: 360, y: 360, width: 180, height: 32 },
  ],
  coins: [
    { id: 'coin-1', x: 420, y: 320, value: 10 },
    { id: 'coin-2', x: 480, y: 320, value: 10 },
  ],
  enemies: [
    {
      id: 'snail-1',
      x: 620,
      y: 420,
      width: 42,
      height: 30,
      patrolMinX: 560,
      patrolMaxX: 760,
      speed: 60,
    },
  ],
};

describe('关卡数据', () => {
  test('解析原创关卡并保留玩家出生点、终点和实体数量', () => {
    const level = parseLevel(levelData);

    expect(level.id).toBe('level-1');
    expect(level.playerSpawn).toEqual({ x: 96, y: 388 });
    expect(level.goal.x).toBe(2240);
    expect(level.platforms).toHaveLength(2);
    expect(level.coins).toHaveLength(2);
    expect(level.enemies).toHaveLength(1);
  });

  test('拒绝没有终点的关卡', () => {
    const invalidLevel: LevelData = {
      ...levelData,
      goal: undefined,
    };

    expect(() => parseLevel(invalidLevel)).toThrow('关卡缺少终点');
  });
});

describe('游戏状态', () => {
  test('收集金币会增加分数且不会重复计分', () => {
    const state = createGameState(1);

    const afterFirstCollect = collectCoin(state, levelData.coins[0]);
    const afterSecondCollect = collectCoin(afterFirstCollect, levelData.coins[0]);

    expect(afterFirstCollect.score).toBe(10);
    expect(afterSecondCollect.score).toBe(10);
    expect(afterSecondCollect.collectedCoinIds).toEqual(['coin-1']);
  });

  test('受伤会减少生命，生命归零时标记游戏结束', () => {
    const state = createGameState(1);

    const afterDamage = damagePlayer(state);
    const afterFatalDamage = damagePlayer(damagePlayer(afterDamage));

    expect(afterDamage.lives).toBe(2);
    expect(afterFatalDamage.lives).toBe(0);
    expect(afterFatalDamage.status).toBe('game-over');
  });

  test('完成第 1 关会进入第 2 关，完成第 2 关会通关', () => {
    const state = createGameState(1);

    const levelTwoState = completeLevel(state);
    const completedState = completeLevel(levelTwoState);

    expect(levelTwoState.currentLevel).toBe(2);
    expect(levelTwoState.status).toBe('playing');
    expect(completedState.status).toBe('completed');
  });
});

describe('敌人行为', () => {
  test('敌人巡逻到边界会转向并限制在巡逻范围内', () => {
    const enemy = {
      ...levelData.enemies[0],
      x: 755,
      direction: 1 as const,
      defeated: false,
    };

    const nextEnemy = stepEnemyPatrol(enemy, 0.2);

    expect(nextEnemy.x).toBe(760);
    expect(nextEnemy.direction).toBe(-1);
  });

  test('玩家从上方踩到敌人会击败敌人，否则玩家受伤', () => {
    const enemy = {
      ...levelData.enemies[0],
      direction: -1 as const,
      defeated: false,
    };

    expect(resolvePlayerEnemyCollision({ velocityY: 260, bottom: 418 }, enemy).type).toBe('stomp');
    expect(resolvePlayerEnemyCollision({ velocityY: 0, bottom: 430 }, enemy).type).toBe('hurt');
  });
});
