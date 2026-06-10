import type { PlatformData, RuntimePlatform } from './types';

export function createRuntimePlatform(platform: PlatformData): RuntimePlatform {
  return {
    ...platform,
    kind: platform.kind ?? 'static',
    direction: platform.kind === 'moving' ? -1 : undefined,
    visible: platform.kind !== 'hidden',
    collapseAtSeconds: undefined,
    consumed: false,
  };
}

export function stepDynamicPlatform(platform: RuntimePlatform, deltaSeconds: number, nowSeconds = 0): RuntimePlatform {
  if (platform.kind === 'fragile' && platform.collapseAtSeconds !== undefined && nowSeconds >= platform.collapseAtSeconds) {
    return {
      ...platform,
      consumed: true,
      visible: false,
    };
  }

  if (
    platform.kind !== 'moving' ||
    platform.moveAxis === undefined ||
    platform.moveMin === undefined ||
    platform.moveMax === undefined ||
    platform.moveSpeed === undefined
  ) {
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

export function revealHiddenPlatform(platform: RuntimePlatform): RuntimePlatform {
  if (platform.kind !== 'hidden') {
    return platform;
  }

  return {
    ...platform,
    visible: true,
  };
}

export function armFragilePlatform(platform: RuntimePlatform, nowSeconds: number): RuntimePlatform {
  if (platform.kind !== 'fragile' || platform.collapseAtSeconds !== undefined) {
    return platform;
  }

  return {
    ...platform,
    collapseAtSeconds: nowSeconds + (platform.collapseDelaySeconds ?? 0.35),
  };
}
