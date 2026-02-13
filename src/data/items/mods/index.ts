import type { Item } from '@/types'
import type { IconType } from 'react-icons'
import * as GameIcons from 'react-icons/gi'

export interface ItemModifier {
  id: string
  name: string
  description: string
  color: string // Primary color (hex)
  colorLight?: string // Lighter shade for text
  backgroundColor?: string // Background color with opacity
  glow?: string // Glow effect color with opacity
  icon?: IconType // React icon component
  statMultipliers?: {
    attack?: number
    defense?: number
    speed?: number
    luck?: number
    magicPower?: number
    maxHp?: number
  }
  valueMultiplier?: number // Affects item value
  applyToItem?: (item: Item) => Item // Custom modifier logic
}

// Cursed modifier - high risk, high reward
export const CURSED: ItemModifier = {
  id: 'cursed',
  name: 'Cursed',
  description: 'A dark curse empowers this item at a terrible cost',
  color: '#7C3AED',
  colorLight: '#A78BFA',
  backgroundColor: 'rgba(124, 58, 237, 0.15)',
  glow: 'rgba(124, 58, 237, 0.6)',
  icon: GameIcons.GiCursedStar,
  statMultipliers: {
    attack: 1.3,
    defense: 0.7,
    luck: -5,
  },
  valueMultiplier: 1.5,
}

// Blessed modifier - divine protection
export const BLESSED: ItemModifier = {
  id: 'blessed',
  name: 'Blessed',
  description: 'Holy power imbues this item with divine grace',
  color: '#FBBF24',
  colorLight: '#FCD34D',
  backgroundColor: 'rgba(251, 191, 36, 0.15)',
  glow: 'rgba(251, 191, 36, 0.7)',
  icon: GameIcons.GiAngelOutfit,
  statMultipliers: {
    defense: 1.2,
    luck: 1.3,
    maxHp: 1.1,
  },
  valueMultiplier: 1.4,
}

// Quick modifier - speed focus
export const QUICK: ItemModifier = {
  id: 'quick',
  name: 'Quick',
  description: 'Lighter and more responsive than normal',
  color: '#60A5FA',
  colorLight: '#93C5FD',
  backgroundColor: 'rgba(96, 165, 250, 0.15)',
  glow: 'rgba(96, 165, 250, 0.6)',
  icon: GameIcons.GiLightningHelix,
  statMultipliers: {
    speed: 1.4,
    attack: 0.9,
  },
  valueMultiplier: 1.2,
}

// Fortified modifier - defensive focus
export const FORTIFIED: ItemModifier = {
  id: 'fortified',
  name: 'Fortified',
  description: 'Reinforced with superior craftsmanship',
  color: '#10B981',
  colorLight: '#34D399',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  glow: 'rgba(16, 185, 129, 0.6)',
  icon: GameIcons.GiShield,
  statMultipliers: {
    defense: 1.4,
    maxHp: 1.2,
    speed: 0.9,
  },
  valueMultiplier: 1.3,
}

// Lightweight modifier - mobility focus
export const LIGHTWEIGHT: ItemModifier = {
  id: 'lightweight',
  name: 'Lightweight',
  description: 'Remarkably light without sacrificing strength',
  color: '#A78BFA',
  colorLight: '#C4B5FD',
  backgroundColor: 'rgba(167, 139, 250, 0.15)',
  glow: 'rgba(167, 139, 250, 0.6)',
  icon: GameIcons.GiFeather,
  statMultipliers: {
    speed: 1.3,
    defense: 0.85,
  },
  valueMultiplier: 1.15,
}

// Masterwork modifier - all-around quality
export const MASTERWORK: ItemModifier = {
  id: 'masterwork',
  name: 'Masterwork',
  description: 'Crafted with exceptional skill and attention to detail',
  color: '#F59E0B',
  colorLight: '#FCD34D',
  backgroundColor: 'rgba(245, 158, 11, 0.15)',
  glow: 'rgba(245, 158, 11, 0.7)',
  icon: GameIcons.GiHammerNails,
  statMultipliers: {
    attack: 1.15,
    defense: 1.15,
    speed: 1.1,
  },
  valueMultiplier: 2.0,
}

// Brutal modifier - pure offense
export const BRUTAL: ItemModifier = {
  id: 'brutal',
  name: 'Brutal',
  description: 'Designed for maximum carnage',
  color: '#EF4444',
  colorLight: '#F87171',
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  glow: 'rgba(239, 68, 68, 0.6)',
  icon: GameIcons.GiBattleAxe,
  statMultipliers: {
    attack: 1.5,
    defense: 0.8,
    speed: 0.9,
  },
  valueMultiplier: 1.3,
}

// Export all modifiers
export const ALL_MODIFIERS: ItemModifier[] = [
  CURSED,
  BLESSED,
  QUICK,
  FORTIFIED,
  LIGHTWEIGHT,
  MASTERWORK,
  BRUTAL,
]

// Helper to get modifier by ID
export function getModifierById(id: string): ItemModifier | undefined {
  return ALL_MODIFIERS.find(mod => mod.id === id)
}

// Helper to apply modifiers to an item
export function applyModifiers(item: Item, modifiers: ItemModifier[]): Item {
  let modifiedItem = { ...item, stats: { ...item.stats } }
  
  for (const modifier of modifiers) {
    // Apply stat multipliers
    if (modifier.statMultipliers && modifiedItem.stats) {
      for (const [stat, multiplier] of Object.entries(modifier.statMultipliers)) {
        const statKey = stat as keyof typeof modifiedItem.stats
        const currentValue = modifiedItem.stats[statKey]
        
        if (typeof currentValue === 'number') {
          if (typeof multiplier === 'number' && multiplier < 1) {
            // For multipliers less than 1, it's a percentage
            (modifiedItem.stats[statKey] as number) = Math.floor(currentValue * multiplier)
          } else if (typeof multiplier === 'number' && multiplier >= 1) {
            // For multipliers >= 1, it's a percentage
            (modifiedItem.stats[statKey] as number) = Math.floor(currentValue * multiplier)
          } else if (typeof multiplier === 'number') {
            // For negative numbers, it's a flat addition
            (modifiedItem.stats[statKey] as number) = currentValue + multiplier
          }
        }
      }
    }
    
    // Apply value multiplier
    if (modifier.valueMultiplier) {
      modifiedItem.value = Math.floor(modifiedItem.value * modifier.valueMultiplier)
    }
    
    // Apply custom logic if provided
    if (modifier.applyToItem) {
      modifiedItem = modifier.applyToItem(modifiedItem)
    }
  }
  
  return modifiedItem
}
