import assert from 'node:assert/strict'
import {
  getDuckTextureOffsets,
  getMarioBodyConfig,
  getStandUpProbeRect,
  shouldStayCrouchedWithoutGroundLayer,
} from '../src/entities/marioBodyConfig.ts'

const crouchConfig = getMarioBodyConfig('big', true)

assert.deepEqual(crouchConfig, {
  width: 12,
  height: 22,
  offsetX: 2,
  offsetY: 10,
})
assert.equal(crouchConfig.offsetY + crouchConfig.height, 32)

const standUpProbe = getStandUpProbeRect(
  { x: 48, y: 128, width: 12, height: 22, bottom: 150 },
  getMarioBodyConfig('big', false),
)

assert.deepEqual(standUpProbe, {
  x: 48,
  y: 120,
  width: 12,
  height: 8,
})

assert.deepEqual(getDuckTextureOffsets('big'), {
  topOffsetY: 10,
  bottomOffsetY: 26,
})

assert.deepEqual(getDuckTextureOffsets('fire'), {
  topOffsetY: 10,
  bottomOffsetY: 26,
})

assert.equal(shouldStayCrouchedWithoutGroundLayer('big'), true)
assert.equal(shouldStayCrouchedWithoutGroundLayer('fire'), true)
assert.equal(shouldStayCrouchedWithoutGroundLayer('small'), false)
