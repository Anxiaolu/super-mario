// 敌人类型守卫，用于碰撞回调中的安全类型窄化

import { Goomba } from '../entities/Goomba'
import { Koopa } from '../entities/Koopa'
import { BuzzyBeetle } from '../entities/BuzzyBeetle'
import { HammerBro } from '../entities/HammerBro'

export type Enemy = Goomba | Koopa | BuzzyBeetle | HammerBro

export function isEnemy(obj: unknown): obj is Enemy {
  return obj instanceof Goomba
    || obj instanceof Koopa
    || obj instanceof BuzzyBeetle
    || obj instanceof HammerBro
}