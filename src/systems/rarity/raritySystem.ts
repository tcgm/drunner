/**
 * Extended rarity system for enhanced progression
 * Merged from external rarity library with dungeon runner's material system
 */

// Use const object instead of enum to avoid erasable syntax issues
export const ExtendedRarity = {
  // Low tier (Floors 1-10)
  Junk: 'junk' as const,           // Dungeon Runner original
  Abundant: 'abundant' as const,    // New
  Common: 'common' as const,
  Uncommon: 'uncommon' as const,
  
  // Mid tier (Floors 11-30)
  Rare: 'rare' as const,
  VeryRare: 'veryRare' as const,    // New
  Magical: 'magical' as const,      // New
  Elite: 'elite' as const,          // New
  
  // High tier (Floors 31-60)
  Epic: 'epic' as const,
  Legendary: 'legendary' as const,
  Mythic: 'mythic' as const,
  Mythicc: 'mythicc' as const,      // New - Enhanced Mythic
  
  // Ultra tier (Floors 61-85)
  Artifact: 'artifact' as const,
  Divine: 'divine' as const,
  Celestial: 'celestial' as const,
  
  // God tier (Floors 86-100)
  RealityAnchor: 'realityAnchor' as const,  // New
  Structural: 'structural' as const,         // New
  Singularity: 'singularity' as const,       // New
  Void: 'void' as const,
  Elder: 'elder' as const,                   // New
  
  // Meta tier (Beyond 100 / Special)
  Layer = 'layer',          // New
  Plane = 'plane',          // New
  Author = 'author',        // New
  
  // Special (non-scaling)
  Cursed = 'cursed',        // Dungeon Runner original
  Set = 'set',              // Dungeon Runner original
}

export interface RarityConfig {
  rarity: ExtendedRarity
  percentage: number        // Drop rate / occurrence
  color: string            // Text color
  backgroundColor: string  // Background color
  statMultiplierBase: number  // Base stat multiplier for materials
  minFloor: number         // Minimum floor for this rarity
}

export const RARITY_CONFIGS: Record<ExtendedRarity, RarityConfig> = {
  // Low tier
  [ExtendedRarity.Junk]: {
    rarity: ExtendedRarity.Junk,
    percentage: 1.0,
    color: '#8b7355',
    backgroundColor: '#4a3f35',
    statMultiplierBase: 0.5,
    minFloor: 0,
  },
  [ExtendedRarity.Abundant]: {
    rarity: ExtendedRarity.Abundant,
    percentage: 1.0,
    color: '#ffffff',
    backgroundColor: '#d9d9d9',
    statMultiplierBase: 0.8,
    minFloor: 0,
  },
  [ExtendedRarity.Common]: {
    rarity: ExtendedRarity.Common,
    percentage: 0.8,
    color: '#ffffff',
    backgroundColor: '#d9d9d9',
    statMultiplierBase: 1.0,
    minFloor: 1,
  },
  [ExtendedRarity.Uncommon]: {
    rarity: ExtendedRarity.Uncommon,
    percentage: 0.5,
    color: '#31aa3e',
    backgroundColor: '#206f28',
    statMultiplierBase: 1.5,
    minFloor: 5,
  },
  
  // Mid tier
  [ExtendedRarity.Rare]: {
    rarity: ExtendedRarity.Rare,
    percentage: 0.2,
    color: '#5888cf',
    backgroundColor: '#203f6f',
    statMultiplierBase: 2.0,
    minFloor: 10,
  },
  [ExtendedRarity.VeryRare]: {
    rarity: ExtendedRarity.VeryRare,
    percentage: 0.05,
    color: '#3e31aa',
    backgroundColor: '#6558cf',
    statMultiplierBase: 2.5,
    minFloor: 15,
  },
  [ExtendedRarity.Magical]: {
    rarity: ExtendedRarity.Magical,
    percentage: 0.01,
    color: '#9c93e0',
    backgroundColor: '#9c93e0',
    statMultiplierBase: 2.8,
    minFloor: 20,
  },
  [ExtendedRarity.Elite]: {
    rarity: ExtendedRarity.Elite,
    percentage: 0.005,
    color: '#8f3187',
    backgroundColor: '#561d51',
    statMultiplierBase: 3.0,
    minFloor: 25,
  },
  
  // High tier
  [ExtendedRarity.Epic]: {
    rarity: ExtendedRarity.Epic,
    percentage: 0.002,
    color: '#ffd700',
    backgroundColor: '#b39700',
    statMultiplierBase: 3.5,
    minFloor: 30,
  },
  [ExtendedRarity.Legendary]: {
    rarity: ExtendedRarity.Legendary,
    percentage: 0.001,
    color: '#ffa500',
    backgroundColor: '#b37400',
    statMultiplierBase: 4.0,
    minFloor: 40,
  },
  [ExtendedRarity.Mythic]: {
    rarity: ExtendedRarity.Mythic,
    percentage: 0.0005,
    color: '#ff005a',
    backgroundColor: '#b3003f',
    statMultiplierBase: 5.0,
    minFloor: 50,
  },
  [ExtendedRarity.Mythicc]: {
    rarity: ExtendedRarity.Mythicc,
    percentage: 0.0002,
    color: '#ff005a',
    backgroundColor: '#b3003f',
    statMultiplierBase: 5.5,
    minFloor: 55,
  },
  
  // Ultra tier
  [ExtendedRarity.Artifact]: {
    rarity: ExtendedRarity.Artifact,
    percentage: 0.0001,
    color: '#b8860b',
    backgroundColor: '#705107',
    statMultiplierBase: 6.0,
    minFloor: 60,
  },
  [ExtendedRarity.Divine]: {
    rarity: ExtendedRarity.Divine,
    percentage: 0.00005,
    color: '#ffe34d',
    backgroundColor: '#ffd700',
    statMultiplierBase: 7.0,
    minFloor: 65,
  },
  [ExtendedRarity.Celestial]: {
    rarity: ExtendedRarity.Celestial,
    percentage: 0.00002,
    color: '#210061',
    backgroundColor: '#fbd100',
    statMultiplierBase: 8.0,
    minFloor: 70,
  },
  
  // God tier
  [ExtendedRarity.RealityAnchor]: {
    rarity: ExtendedRarity.RealityAnchor,
    percentage: 0.00001,
    color: '#8b4513',
    backgroundColor: '#0a0f48',
    statMultiplierBase: 9.0,
    minFloor: 75,
  },
  [ExtendedRarity.Structural]: {
    rarity: ExtendedRarity.Structural,
    percentage: 0.000005,
    color: '#140007',
    backgroundColor: '#610022',
    statMultiplierBase: 10.0,
    minFloor: 80,
  },
  [ExtendedRarity.Singularity]: {
    rarity: ExtendedRarity.Singularity,
    percentage: 0.000002,
    color: '#000714',
    backgroundColor: '#000714',
    statMultiplierBase: 12.0,
    minFloor: 85,
  },
  [ExtendedRarity.Void]: {
    rarity: ExtendedRarity.Void,
    percentage: 0.000001,
    color: '#000000',
    backgroundColor: '#1b001b',
    statMultiplierBase: 15.0,
    minFloor: 90,
  },
  [ExtendedRarity.Elder]: {
    rarity: ExtendedRarity.Elder,
    percentage: 0.0000005,
    color: '#b0b0b0',
    backgroundColor: '#b0b0b0',
    statMultiplierBase: 18.0,
    minFloor: 93,
  },
  
  // Meta tier
  [ExtendedRarity.Layer]: {
    rarity: ExtendedRarity.Layer,
    percentage: 0.0000002,
    color: '#808080',
    backgroundColor: '#808080',
    statMultiplierBase: 20.0,
    minFloor: 96,
  },
  [ExtendedRarity.Plane]: {
    rarity: ExtendedRarity.Plane,
    percentage: 0.0000001,
    color: '#404040',
    backgroundColor: '#404040',
    statMultiplierBase: 25.0,
    minFloor: 98,
  },
  [ExtendedRarity.Author]: {
    rarity: ExtendedRarity.Author,
    percentage: 0.00000005,
    color: '#000000',
    backgroundColor: '#000000',
    statMultiplierBase: 30.0,
    minFloor: 100,
  },
  
  // Special
  [ExtendedRarity.Cursed]: {
    rarity: ExtendedRarity.Cursed,
    percentage: 0.01,
    color: '#8b008b',
    backgroundColor: '#4b0082',
    statMultiplierBase: 1.0, // Special modifier
    minFloor: 10,
  },
  [ExtendedRarity.Set]: {
    rarity: ExtendedRarity.Set,
    percentage: 0.01,
    color: '#00ced1',
    backgroundColor: '#008b8b',
    statMultiplierBase: 1.0, // Uses base material
    minFloor: 15,
  },
}

export function getRarityConfig(rarity: ExtendedRarity): RarityConfig {
  return RARITY_CONFIGS[rarity]
}

export function getRarityColor(rarity: ExtendedRarity): string {
  return RARITY_CONFIGS[rarity].color
}

export function getRarityBackgroundColor(rarity: ExtendedRarity): string {
  return RARITY_CONFIGS[rarity].backgroundColor
}

export function guessRarity(inputString: string): ExtendedRarity {
  if (!inputString) return ExtendedRarity.Abundant

  const normalized = inputString.replace(/[\s_-]/g, '').toLowerCase()
  
  for (const [key, value] of Object.entries(ExtendedRarity)) {
    const normalizedEnum = value.replace(/[\s_-]/g, '').toLowerCase()
    if (normalized === normalizedEnum) {
      return value as ExtendedRarity
    }
  }
  
  return ExtendedRarity.Abundant
}

export function getRaritiesForFloor(floor: number): ExtendedRarity[] {
  return Object.values(ExtendedRarity).filter(rarity => {
    const config = RARITY_CONFIGS[rarity]
    return config && floor >= config.minFloor
  }) as ExtendedRarity[]
}
