export type PowerState = 'small' | 'big' | 'fire'

export type MarioBodyConfig = {
  width: number
  height: number
  offsetX: number
  offsetY: number
}

export type DuckTextureOffsets = {
  topOffsetY: number
  bottomOffsetY: number
}

type BodyRect = {
  x: number
  y: number
  width: number
  height: number
  bottom: number
}

const SMALL_BODY: MarioBodyConfig = {
  width: 12,
  height: 14,
  offsetX: 2,
  offsetY: 2,
}

const BIG_BODY: MarioBodyConfig = {
  width: 12,
  height: 30,
  offsetX: 2,
  offsetY: 2,
}

const BIG_CROUCH_BODY: MarioBodyConfig = {
  width: 12,
  height: 22,
  offsetX: 2,
  offsetY: 10,
}

const SIZE_OFFSET_FOR_DUCK_BOTTOM = 16

const BIG_DUCK_TEXTURE_OFFSETS: DuckTextureOffsets = {
  topOffsetY: BIG_CROUCH_BODY.offsetY,
  bottomOffsetY: BIG_CROUCH_BODY.offsetY + SIZE_OFFSET_FOR_DUCK_BOTTOM,
}

export function getMarioBodyConfig(powerState: PowerState, isCrouching: boolean): MarioBodyConfig {
  if (powerState === 'small') {
    return SMALL_BODY
  }

  return isCrouching ? BIG_CROUCH_BODY : BIG_BODY
}

export function getDuckTextureOffsets(powerState: PowerState): DuckTextureOffsets {
  if (powerState === 'small') {
    return {
      topOffsetY: 0,
      bottomOffsetY: 16,
    }
  }

  return BIG_DUCK_TEXTURE_OFFSETS
}

export function shouldStayCrouchedWithoutGroundLayer(powerState: PowerState): boolean {
  return powerState === 'big' || powerState === 'fire'
}

export function getStandUpProbeRect(body: BodyRect, targetConfig: MarioBodyConfig): Omit<BodyRect, 'bottom'> {
  const extraHeight = targetConfig.height - body.height

  return {
    x: body.x,
    y: body.y - extraHeight,
    width: Math.max(body.width, targetConfig.width),
    height: Math.max(extraHeight, 0),
  }
}
