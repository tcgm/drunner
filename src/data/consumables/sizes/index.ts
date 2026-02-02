/**
 * Consumable size - affects potency
 */
export interface ConsumableSize {
  id: string
  name: string
  prefix: string // Name prefix (e.g., "Small", "Greater")
  multiplier: number // Multiplier for base value
  valueMultiplier: number // Multiplier for gold value
}

export const TINY: ConsumableSize = {
  id: 'tiny',
  name: 'Tiny',
  prefix: 'Tiny',
  multiplier: 0.5,
  valueMultiplier: 0.4,
}

export const SMALL: ConsumableSize = {
  id: 'small',
  name: 'Small',
  prefix: 'Small',
  multiplier: 1.0,
  valueMultiplier: 1.0,
}

export const MEDIUM: ConsumableSize = {
  id: 'medium',
  name: 'Medium',
  prefix: 'Medium',
  multiplier: 1.5,
  valueMultiplier: 1.8,
}

export const LARGE: ConsumableSize = {
  id: 'large',
  name: 'Large',
  prefix: 'Large',
  multiplier: 2.0,
  valueMultiplier: 2.5,
}

export const GREATER: ConsumableSize = {
  id: 'greater',
  name: 'Greater',
  prefix: 'Greater',
  multiplier: 3.0,
  valueMultiplier: 4.0,
}

export const SUPERIOR: ConsumableSize = {
  id: 'superior',
  name: 'Superior',
  prefix: 'Superior',
  multiplier: 5.0,
  valueMultiplier: 8.0,
}

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
