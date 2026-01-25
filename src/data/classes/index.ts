import type { HeroClass } from '@/types'

// Import core classes
import { WARRIOR } from './warrior'
import { MAGE } from './mage'
import { ROGUE } from './rogue'
import { CLERIC } from './cleric'
import { RANGER } from './ranger'
import { PALADIN } from './paladin'
import { NECROMANCER } from './necromancer'
import { BARD } from './bard'

// Core classes (MVP)
export const CORE_CLASSES: HeroClass[] = [
  WARRIOR,
  MAGE,
  ROGUE,
  CLERIC,
  RANGER,
  PALADIN,
  NECROMANCER,
  BARD,
]

// Stretch goal classes (to be added later)
export const STRETCH_CLASSES: HeroClass[] = [
  // Artificer, Sorcerer, Barbarian, Druid, Monk, Warlock, Assassin, Shaman, Knight, Witch, Berserker, Alchemist
]

// All classes
export const ALL_CLASSES: HeroClass[] = [
  ...CORE_CLASSES,
  ...STRETCH_CLASSES,
]

// Helper function to get a class by ID
export function getClassById(id: string): HeroClass | undefined {
  return ALL_CLASSES.find(c => c.id === id)
}

// Helper function to get a random class
export function getRandomClass(): HeroClass {
  return ALL_CLASSES[Math.floor(Math.random() * ALL_CLASSES.length)]
}

// Re-export individual classes for direct import
export { WARRIOR, MAGE, ROGUE, CLERIC, RANGER, PALADIN, NECROMANCER, BARD }
