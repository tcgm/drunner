export * from './types'
export * from './tiny'
export * from './small'
export * from './medium'
export * from './large'
export * from './greater'
export * from './superior'

import { TINY } from './tiny'
import { SMALL } from './small'
import { MEDIUM } from './medium'
import { LARGE } from './large'
import { GREATER } from './greater'
import { SUPERIOR } from './superior'
import type { ConsumableSize } from './types'

export const ALL_SIZES: ConsumableSize[] = [
  TINY,
  SMALL,
  MEDIUM,
  LARGE,
  GREATER,
  SUPERIOR,
]

export function getSizeById(id: string): ConsumableSize | undefined {
  return ALL_SIZES.find(s => s.id === id)
}

export function getRandomSize(): ConsumableSize {
  // Weight towards smaller sizes
  const weights = [5, 35, 30, 20, 8, 2] // tiny, small, medium, large, greater, superior
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight
  
  for (let i = 0; i < ALL_SIZES.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return ALL_SIZES[i]
    }
  }
  
  return SMALL
}
