import { describe, expect, test } from 'vitest';
import {
  applyKnockback,
  createPlayerMotionState,
  stepPlayerMotion,
  type PlayerMotionConfig,
} from '../src/game/playerController';

const config: PlayerMotionConfig = {
  walkSpeed: 245,
  runSpeed: 310,
  groundAcceleration: 1600,
  airAcceleration: 900,
  groundDeceleration: 1900,
  airDeceleration: 480,
  gravity: 1650,
  jumpVelocity: -620,
  coyoteTimeSeconds: 0.1,
  jumpBufferSeconds: 0.12,
  knockbackVelocityX: 240,
  knockbackVelocityY: -320,
  invulnerabilitySeconds: 1.4,
};

describe('玩家手感控制器', () => {
  test('地面上按住右方向会逐步加速，而不是瞬时满速', () => {
    const initialState = createPlayerMotionState();

    const nextState = stepPlayerMotion(
      initialState,
      {
        moveX: 1,
        jumpPressed: false,
        jumpHeld: false,
        actionHeld: false,
      },
      {
        deltaSeconds: 0.05,
        nowSeconds: 0.05,
        isGrounded: true,
      },
      config,
    );

    expect(nextState.velocityX).toBeGreaterThan(0);
    expect(nextState.velocityX).toBeLessThan(config.walkSpeed);
  });

  test('松开方向后会逐步减速到接近静止', () => {
    const movingState = {
      ...createPlayerMotionState(),
      velocityX: 200,
      onGround: true,
    };

    const nextState = stepPlayerMotion(
      movingState,
      {
        moveX: 0,
        jumpPressed: false,
        jumpHeld: false,
        actionHeld: false,
      },
      {
        deltaSeconds: 0.1,
        nowSeconds: 0.1,
        isGrounded: true,
      },
      config,
    );

    expect(nextState.velocityX).toBeLessThan(200);
    expect(nextState.velocityX).toBeGreaterThanOrEqual(0);
  });

  test('离开平台后的短暂土狼时间内仍然允许起跳', () => {
    const fallingState = {
      ...createPlayerMotionState(),
      onGround: false,
      lastGroundedAtSeconds: 1.96,
    };

    const nextState = stepPlayerMotion(
      fallingState,
      {
        moveX: 0,
        jumpPressed: true,
        jumpHeld: true,
        actionHeld: false,
      },
      {
        deltaSeconds: 0.016,
        nowSeconds: 2,
        isGrounded: false,
      },
      config,
    );

    expect(nextState.velocityY).toBe(config.jumpVelocity);
  });

  test('落地前按下跳跃会触发跳跃缓冲', () => {
    const bufferedState = {
      ...createPlayerMotionState(),
      jumpPressedAtSeconds: 1.95,
      velocityY: 120,
    };

    const nextState = stepPlayerMotion(
      bufferedState,
      {
        moveX: 0,
        jumpPressed: false,
        jumpHeld: true,
        actionHeld: false,
      },
      {
        deltaSeconds: 0.016,
        nowSeconds: 2,
        isGrounded: true,
      },
      config,
    );

    expect(nextState.velocityY).toBe(config.jumpVelocity);
  });

  test('受伤击退会根据命中方向推开玩家并设置无敌时间', () => {
    const nextState = applyKnockback(
      createPlayerMotionState(),
      {
        sourceX: 500,
        playerX: 460,
        nowSeconds: 3,
      },
      config,
    );

    expect(nextState.velocityX).toBeLessThan(0);
    expect(nextState.velocityY).toBe(config.knockbackVelocityY);
    expect(nextState.invulnerableUntilSeconds).toBeCloseTo(4.4);
  });
});
