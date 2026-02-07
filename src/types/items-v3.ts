import type { IconType } from 'react-icons'
import type { ItemSlot, ItemRarity, Stats } from './index'

/**
 * V3 Item Format - ID-based with derived properties
 * More efficient, no data corruption, single source of truth
 */

export interface ItemV3Base {
  version: 3
  id: string
  modifiers?: string[]
}

export interface ProceduralItemV3 extends ItemV3Base {
  itemType: 'procedural'
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory'
  materialId: string
  baseTemplateId: string
  variantName: string     // Which variant was selected: "Axe", "Guitar", "Blade", "Staff", etc
  rarity: ItemRarity
  // itemSlot is derived from base.type at hydration, not stored
}

export interface UniqueItemV3 extends ItemV3Base {
  itemType: 'unique'
  templateId: string      // "EXCALIBUR", "SHADOWFANG", etc
}

export interface SetItemV3 extends ItemV3Base {
  itemType: 'set'
  templateId: string      // "TITANS_GUARD", "SHADOWS_EDGE", etc
  isUniqueRoll?: boolean  // If this set item rolled as unique (boosted stats)
}

export interface ConsumableV3 extends ItemV3Base {
  itemType: 'consumable'
  baseId: string          // Base effect type (healing, buff, etc)
  sizeId: string          // Size tier (small, medium, large, etc)
  potencyId: string       // Concentration/quality tier
  rarity: ItemRarity
  stackCount?: number     // For stackable consumables
}

export type ItemV3 = ProceduralItemV3 | UniqueItemV3 | SetItemV3 | ConsumableV3

/**
 * V2 Item Format - Legacy, still supported
 * Full data stored, can become inconsistent
 */
export interface ItemV2 {
  id: string
  name: string
  description: string
  type: ItemSlot
  rarity: ItemRarity
  stats: Partial<Omit<Stats, 'hp'>>
  value: number
  icon?: IconType
  setId?: string
  modifiers?: string[]
  materialId?: string
  baseTemplateId?: string
  isUnique?: boolean
  statVersion?: number
  version?: number  // Optional version field for runtime tracking (2 for V2, 3 for V3-derived)
  // Note: No version field in storage = V2 or V1
}

/**
 * Union type for item storage
 * Save files can contain either format
 */
export type ItemStorage = ItemV2 | ItemV3

/**
 * Runtime item type - V2 shape for now to minimize changes
 * Eventually this becomes computed/derived from V3
 */
export type Item = ItemV2

/**
 * Type guards
 */
export function isItemV3(item: unknown): item is ItemV3 {
  return typeof item === 'object' && item !== null && 'version' in item && (item as ItemV3Base).version === 3
}

export function isItemV2(item: unknown): item is ItemV2 {
  return typeof item === 'object' && item !== null && (
    !('version' in item) ||
    ('version' in item && (item as { version: number }).version === 2)
  )
}

export function isProceduralItemV3(item: ItemV3): item is ProceduralItemV3 {
  return item.itemType === 'procedural'
}

export function isUniqueItemV3(item: ItemV3): item is UniqueItemV3 {
  return item.itemType === 'unique'
}

export function isSetItemV3(item: ItemV3): item is SetItemV3 {
  return item.itemType === 'set'
}

export function isConsumableV3(item: ItemV3): item is ConsumableV3 {
  return item.itemType === 'consumable'
}
