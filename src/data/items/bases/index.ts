// Master index for all base item templates
import type { Item, ItemSlot } from '@/types'

export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory'

import { ALL_WEAPON_BASES } from './weapon'
import { ALL_ARMOR_BASES } from './armor'
import { ALL_HELMET_BASES } from './helmet'
import { ALL_BOOTS_BASES } from './boots'
import { ALL_ACCESSORY_BASES } from './accessory'

// All base templates
export const ALL_BASE_TEMPLATES = [
  ...ALL_WEAPON_BASES,
  ...ALL_ARMOR_BASES,
  ...ALL_HELMET_BASES,
  ...ALL_BOOTS_BASES,
  ...ALL_ACCESSORY_BASES,
]

// Base templates by type
export const BASE_TEMPLATES_BY_TYPE: Record<string, Array<Omit<Item, 'id' | 'name' | 'rarity' | 'value'>>> = {
  weapon: ALL_WEAPON_BASES,
  armor: ALL_ARMOR_BASES,
  helmet: ALL_HELMET_BASES,
  boots: ALL_BOOTS_BASES,
  accessory: ALL_ACCESSORY_BASES,
}

/**
 * Get base templates for a specific type
 */
export function getBasesByType(type: ItemSlot): Array<Omit<Item, 'id' | 'name' | 'rarity' | 'value'>> {
  // Normalize accessory types
  const normalizedType = (type === 'accessory1' || type === 'accessory2') ? 'accessory' : type
  return BASE_TEMPLATES_BY_TYPE[normalizedType] || []
}

/**
 * Get a random base template for a type
 */
export function getRandomBase(type: ItemSlot): Omit<Item, 'id' | 'name' | 'rarity' | 'value'> | undefined {
  const bases = getBasesByType(type)
  if (bases.length === 0) return undefined
  return bases[Math.floor(Math.random() * bases.length)]
}
