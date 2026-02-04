export * from './types'
export * from './diluted'
export * from './weak'
export * from './normal'
export * from './strong'
export * from './potent'
export * from './concentrated'
export * from './pure'

import { DILUTED } from './diluted'
import { WEAK } from './weak'
import { NORMAL } from './normal'
import { STRONG } from './strong'
import { POTENT } from './potent'
import { CONCENTRATED } from './concentrated'
import { PURE } from './pure'
import type { ConsumablePotency } from './types'

export const ALL_POTENCIES: ConsumablePotency[] = [
  DILUTED,
  WEAK,
  NORMAL,
  STRONG,
  POTENT,
  CONCENTRATED,
  PURE,
]

export function getPotencyById(id: string): ConsumablePotency | undefined {
  return ALL_POTENCIES.find(p => p.id === id)
}

export function getRandomPotency(): ConsumablePotency {
  // Weight towards normal/weak potencies
  const weights = [5, 15, 50, 20, 8, 1.5, 0.5] // diluted, weak, normal, strong, potent, concentrated, pure
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight
  
  for (let i = 0; i < ALL_POTENCIES.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return ALL_POTENCIES[i]
    }
  }
  
  return NORMAL
}
