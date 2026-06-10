import type { PlayerEnemyCollisionResult, PlayerEnemyContact, RuntimeEnemy } from './types';

export function stepEnemyPatrol(enemy: RuntimeEnemy, deltaSeconds: number, nowSeconds = 0): RuntimeEnemy {
  const movedEnemy = moveHorizontally(enemy, deltaSeconds);

  if (movedEnemy.kind === 'hopper') {
    return stepHopper(movedEnemy, deltaSeconds, nowSeconds);
  }

  if (movedEnemy.kind === 'flyer') {
    return stepFlyer(movedEnemy, deltaSeconds);
  }

  return movedEnemy;
}

function moveHorizontally(enemy: RuntimeEnemy, deltaSeconds: number): RuntimeEnemy {
  const nextX = enemy.x + enemy.speed * enemy.direction * deltaSeconds;

  if (nextX >= enemy.patrolMaxX) {
    return {
      ...enemy,
      x: enemy.patrolMaxX,
      direction: -1,
    };
  }

  if (nextX <= enemy.patrolMinX) {
    return {
      ...enemy,
      x: enemy.patrolMinX,
      direction: 1,
    };
  }

  return {
    ...enemy,
    x: nextX,
  };
}

function stepHopper(enemy: RuntimeEnemy, deltaSeconds: number, nowSeconds: number): RuntimeEnemy {
  const baseY = enemy.baseY ?? enemy.y;
  const gravity = enemy.gravity ?? 1200;
  const jumpIntervalSeconds = enemy.jumpIntervalSeconds ?? 1.4;
  const jumpVelocity = enemy.jumpVelocity ?? -420;
  const lastJumpAtSeconds = enemy.lastJumpAtSeconds ?? 0;
  const isGrounded = enemy.y >= baseY && (enemy.velocityY ?? 0) >= 0;

  let velocityY = enemy.velocityY ?? 0;
  let y = enemy.y;
  let nextLastJumpAtSeconds = lastJumpAtSeconds;
  let jumpedThisStep = false;

  if (isGrounded && nowSeconds - lastJumpAtSeconds >= jumpIntervalSeconds) {
    velocityY = jumpVelocity;
    nextLastJumpAtSeconds = nowSeconds;
    jumpedThisStep = true;
  }

  if (!jumpedThisStep) {
    velocityY += gravity * deltaSeconds;
  }
  y += velocityY * deltaSeconds;

  if (y >= baseY) {
    y = baseY;
    velocityY = 0;
  }

  return {
    ...enemy,
    y,
    baseY,
    velocityY,
    jumpIntervalSeconds,
    jumpVelocity,
    gravity,
    lastJumpAtSeconds: nextLastJumpAtSeconds,
  };
}

function stepFlyer(enemy: RuntimeEnemy, deltaSeconds: number): RuntimeEnemy {
  const hoverMinY = enemy.hoverMinY ?? enemy.y - 24;
  const hoverMaxY = enemy.hoverMaxY ?? enemy.y + 24;
  const hoverSpeed = enemy.hoverSpeed ?? 40;
  const hoverDirection = enemy.hoverDirection ?? 1;
  const nextY = enemy.y + hoverSpeed * hoverDirection * deltaSeconds;

  if (nextY >= hoverMaxY) {
    return {
      ...enemy,
      y: hoverMaxY,
      hoverMinY,
      hoverMaxY,
      hoverSpeed,
      hoverDirection: -1,
    };
  }

  if (nextY <= hoverMinY) {
    return {
      ...enemy,
      y: hoverMinY,
      hoverMinY,
      hoverMaxY,
      hoverSpeed,
      hoverDirection: 1,
    };
  }

  return {
    ...enemy,
    y: nextY,
    hoverMinY,
    hoverMaxY,
    hoverSpeed,
    hoverDirection,
  };
}

export function resolvePlayerEnemyCollision(
  player: PlayerEnemyContact,
  enemy: RuntimeEnemy,
): PlayerEnemyCollisionResult {
  const stompMargin = 10;
  const isStomp = player.velocityY > 0 && player.bottom <= enemy.y + stompMargin;

  if (isStomp) {
    return {
      type: 'stomp',
      enemy: {
        ...enemy,
        defeated: true,
      },
    };
  }

  return {
    type: 'hurt',
    enemy,
  };
}
