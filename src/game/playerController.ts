export interface PlayerMotionConfig {
  walkSpeed: number;
  runSpeed: number;
  groundAcceleration: number;
  airAcceleration: number;
  groundDeceleration: number;
  airDeceleration: number;
  gravity: number;
  jumpVelocity: number;
  coyoteTimeSeconds: number;
  jumpBufferSeconds: number;
  knockbackVelocityX: number;
  knockbackVelocityY: number;
  invulnerabilitySeconds: number;
}

export interface PlayerMotionState {
  velocityX: number;
  velocityY: number;
  onGround: boolean;
  lastGroundedAtSeconds: number;
  jumpPressedAtSeconds: number | null;
  invulnerableUntilSeconds: number;
}

export interface PlayerMotionInput {
  moveX: -1 | 0 | 1;
  jumpPressed: boolean;
  jumpHeld: boolean;
  actionHeld: boolean;
}

export interface PlayerMotionStepContext {
  deltaSeconds: number;
  nowSeconds: number;
  isGrounded: boolean;
}

export interface KnockbackContext {
  sourceX: number;
  playerX: number;
  nowSeconds: number;
}

export function createPlayerMotionState(): PlayerMotionState {
  return {
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    lastGroundedAtSeconds: Number.NEGATIVE_INFINITY,
    jumpPressedAtSeconds: null,
    invulnerableUntilSeconds: 0,
  };
}

export function stepPlayerMotion(
  state: PlayerMotionState,
  input: PlayerMotionInput,
  context: PlayerMotionStepContext,
  config: PlayerMotionConfig,
): PlayerMotionState {
  const jumpPressedAtSeconds = input.jumpPressed ? context.nowSeconds : state.jumpPressedAtSeconds;
  const lastGroundedAtSeconds = context.isGrounded ? context.nowSeconds : state.lastGroundedAtSeconds;
  const canUseCoyoteJump = context.nowSeconds - lastGroundedAtSeconds <= config.coyoteTimeSeconds;
  const hasBufferedJump =
    jumpPressedAtSeconds !== null && context.nowSeconds - jumpPressedAtSeconds <= config.jumpBufferSeconds;

  const targetSpeed = input.moveX * (input.actionHeld ? config.runSpeed : config.walkSpeed);
  const acceleration = context.isGrounded ? config.groundAcceleration : config.airAcceleration;
  const deceleration = context.isGrounded ? config.groundDeceleration : config.airDeceleration;
  const velocityX = moveToward(
    state.velocityX,
    targetSpeed,
    (input.moveX === 0 ? deceleration : acceleration) * context.deltaSeconds,
  );

  let velocityY = state.velocityY + config.gravity * context.deltaSeconds;
  let nextJumpPressedAtSeconds = jumpPressedAtSeconds;

  if (hasBufferedJump && (context.isGrounded || canUseCoyoteJump)) {
    velocityY = config.jumpVelocity;
    nextJumpPressedAtSeconds = null;
  }

  return {
    velocityX,
    velocityY,
    onGround: context.isGrounded,
    lastGroundedAtSeconds,
    jumpPressedAtSeconds: nextJumpPressedAtSeconds,
    invulnerableUntilSeconds: state.invulnerableUntilSeconds,
  };
}

export function applyKnockback(
  state: PlayerMotionState,
  context: KnockbackContext,
  config: PlayerMotionConfig,
): PlayerMotionState {
  const horizontalDirection = context.playerX < context.sourceX ? -1 : 1;

  return {
    ...state,
    velocityX: horizontalDirection * config.knockbackVelocityX,
    velocityY: config.knockbackVelocityY,
    onGround: false,
    jumpPressedAtSeconds: null,
    invulnerableUntilSeconds: context.nowSeconds + config.invulnerabilitySeconds,
  };
}

function moveToward(current: number, target: number, maxDelta: number): number {
  if (current < target) {
    return Math.min(current + maxDelta, target);
  }

  if (current > target) {
    return Math.max(current - maxDelta, target);
  }

  return target;
}
