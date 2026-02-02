/**
 * Consumable potency - affects concentration/quality of the potion
 * This is separate from size (which is physical quantity)
 */
export interface ConsumablePotency {
  id: string
  name: string
  prefix: string // Name prefix (e.g., "Weak", "Potent")
  multiplier: number // Multiplier for effect value
  valueMultiplier: number // Multiplier for gold value
}

export const DILUTED: ConsumablePotency = {
  id: 'diluted',
  name: 'Diluted',
  prefix: 'Diluted',
  multiplier: 0.6,
  valueMultiplier: 0.5,
}

export const WEAK: ConsumablePotency = {
  id: 'weak',
  name: 'Weak',
  prefix: 'Weak',
  multiplier: 0.8,
  valueMultiplier: 0.7,
}

export const NORMAL: ConsumablePotency = {
  id: 'normal',
  name: 'Normal',
  prefix: '', // No prefix for normal
  multiplier: 1.0,
  valueMultiplier: 1.0,
}

export const STRONG: ConsumablePotency = {
  id: 'strong',
  name: 'Strong',
  prefix: 'Strong',
  multiplier: 1.4,
  valueMultiplier: 1.6,
}

export const POTENT: ConsumablePotency = {
  id: 'potent',
  name: 'Potent',
  prefix: 'Potent',
  multiplier: 2.0,
  valueMultiplier: 2.5,
}

export const CONCENTRATED: ConsumablePotency = {
  id: 'concentrated',
  name: 'Concentrated',
  prefix: 'Concentrated',
  multiplier: 3.0,
  valueMultiplier: 4.0,
}

export const PURE: ConsumablePotency = {
  id: 'pure',
  name: 'Pure',
  prefix: 'Pure',
  multiplier: 5.0,
  valueMultiplier: 7.0,
}

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
