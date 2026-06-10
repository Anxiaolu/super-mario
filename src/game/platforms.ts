import type { PlatformData, RuntimePlatform } from './types';

export function createRuntimePlatform(platform: PlatformData): RuntimePlatform {
  return {
    ...platform,
    kind: platform.kind ?? 'static',
    direction: platform.kind === 'moving' ? -1 : undefined,
  };
}

export function stepDynamicPlatform(platform: RuntimePlatform, deltaSeconds: number): RuntimePlatform {
  if (platform.kind !== 'moving' || !platform.moveAxis || !platform.moveMin || !platform.moveMax || !platform.moveSpeed) {
    return platform;
  }

  const direction = platform.direction ?? 1;
  const nextValue = platform[platform.moveAxis] + platform.moveSpeed * direction * deltaSeconds;

  if (nextValue >= platform.moveMax) {
    return {
      ...platform,
      [platform.moveAxis]: platform.moveMax,
      direction: -1,
    };
  }

  if (nextValue <= platform.moveMin) {
    return {
      ...platform,
      [platform.moveAxis]: platform.moveMin,
      direction: 1,
    };
  }

  return {
    ...platform,
    [platform.moveAxis]: nextValue,
    direction,
  };
}

export function getLandingVelocityY(platform: RuntimePlatform, defaultJumpVelocity: number): number {
  if (platform.kind === 'spring' && platform.bounceVelocity) {
    return platform.bounceVelocity;
  }

  return defaultJumpVelocity;
}
