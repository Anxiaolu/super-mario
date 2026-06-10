import { describe, expect, test } from 'vitest';
import levelOneData from '../src/levels/level1.json';
import levelTwoData from '../src/levels/level2.json';
import { applyButtonState, createInputState, getOrientationHint } from '../src/game/inputState';
import { parseLevel } from '../src/game/levelLoader';
import type { LevelData } from '../src/game/types';

interface FakePointerEvent {
  preventDefault(): void;
}

type FakeEventHandler = (event: FakePointerEvent) => void;

class FakeControlButton {
  dataset: { control: string };
  classList = {
    classes: new Set<string>(),
    add: (className: string): void => {
      this.classList.classes.add(className);
    },
    remove: (className: string): void => {
      this.classList.classes.delete(className);
    },
    contains: (className: string): boolean => this.classList.classes.has(className),
  };
  private listeners = new Map<string, FakeEventHandler[]>();

  constructor(control: string) {
    this.dataset = { control };
  }

  addEventListener(type: string, handler: FakeEventHandler): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), handler]);
  }

  dispatch(type: string): void {
    for (const handler of this.listeners.get(type) ?? []) {
      handler({ preventDefault: () => undefined });
    }
  }
}

class FakeEventTarget {
  private listeners = new Map<string, FakeEventHandler[]>();

  addEventListener(type: string, handler: FakeEventHandler): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), handler]);
  }

  dispatch(type: string): void {
    for (const handler of this.listeners.get(type) ?? []) {
      handler({ preventDefault: () => undefined });
    }
  }
}

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

  test('第 2 关包含跳跃敌人和浮空敌人，形成更丰富的节奏', () => {
    const level = parseLevel(levelTwoData as LevelData);

    const hopperCount = level.enemies.filter((enemy) => enemy.kind === 'hopper').length;
    const flyerCount = level.enemies.filter((enemy) => enemy.kind === 'flyer').length;

    expect(hopperCount).toBeGreaterThanOrEqual(1);
    expect(flyerCount).toBeGreaterThanOrEqual(1);
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

  test('触屏按钮在全局释放事件后会清空输入状态', async () => {
    const { getTouchInputState, setupTouchControls } = await import('../src/game/touchControls');
    const leftButton = new FakeControlButton('left');
    const documentRef = {
      querySelectorAll: () => [leftButton],
    };
    const windowRef = new FakeEventTarget();
    const setupControls = setupTouchControls as unknown as (
      documentRef: Document,
      windowRef: Window,
    ) => void;

    setupControls(documentRef as unknown as Document, windowRef as unknown as Window);
    leftButton.dispatch('pointerdown');
    windowRef.dispatch('pointerup');

    expect(getTouchInputState().moveX).toBe(0);
    expect(leftButton.classList.contains('is-active')).toBe(false);
  });
});
