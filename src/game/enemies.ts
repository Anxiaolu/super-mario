import type { PlayerEnemyCollisionResult, PlayerEnemyContact, RuntimeEnemy } from './types';

export function stepEnemyPatrol(enemy: RuntimeEnemy, deltaSeconds: number): RuntimeEnemy {
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
