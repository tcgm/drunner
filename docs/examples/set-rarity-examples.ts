/**
 * Example: How to add rarity constraints to set items
 * 
 * This shows the three levels of control:
 * 1. Set-wide default
 * 2. Per-item override
 * 3. No constraints (fixed)
 */

import { GiShield, GiHelmet, GiWarhammer } from 'react-icons/gi'
import type { Item, ItemRarity } from '../../src/types'
import type { SetDefinition, SetBonus } from '../../src/data/items/sets'

// LEVEL 1: Set-Wide Constraints
// These apply to ALL items in the set unless overridden

export const GUARDIAN_SET_BONUSES: Record<number, SetBonus> = {
    2: {
        description: '+20 defense',
        stats: { defense: 20 }
    },
    4: {
        description: '+40 defense, +50 max HP',
        stats: { defense: 40, maxHp: 50 }
    }
}

// Set definition with set-wide rarity constraints
export const GUARDIAN_SET: SetDefinition = {
    name: 'Guardian',
    items: [], // Will be filled below
    bonuses: GUARDIAN_SET_BONUSES,
    minRarity: 'rare',        // All Guardian items: rare minimum
    maxRarity: 'legendary',   // All Guardian items: legendary maximum
}

// LEVEL 2: Items with No Override (Use Set Default)
// These will use the set-wide rare-to-legendary range

export const GUARDIAN_SHIELD: Omit<Item, 'id'> = {
    name: "Guardian's Shield",
    description: 'An impenetrable barrier.',
    type: 'armor',
    rarity: 'rare',  // Template/base rarity
    // No minRarity/maxRarity = uses set default (rare to legendary)
    icon: GiShield,
    stats: {
        defense: 60,
        maxHp: 30,
    },
    value: 5000,
}

export const GUARDIAN_HELMET: Omit<Item, 'id'> = {
    name: "Guardian's Helmet",
    description: 'Protects the mind as well as the body.',
    type: 'helmet',
    rarity: 'rare',
    // No override = uses set default
    icon: GiHelmet,
    stats: {
        defense: 40,
        maxHp: 20,
    },
    value: 4000,
}

// LEVEL 3: Item with Per-Item Override
// This item has its own constraints that override the set default

export const GUARDIAN_HAMMER: Omit<Item, 'id'> = {
    name: "Guardian's Hammer",
    description: 'The signature weapon of the order. Legendary craftsmanship.',
    type: 'weapon',
    rarity: 'legendary',      // Template rarity
    minRarity: 'legendary',   // OVERRIDE: This specific item is legendary+
    maxRarity: 'mythic',      // OVERRIDE: Can reach mythic (beyond set max)
    icon: GiWarhammer,
    stats: {
        attack: 100,
        defense: 30,
        maxHp: 25,
    },
    value: 12000,
}

// Another example set with NO constraints (fixed rarities)

export const SHADOW_SET_BONUSES: Record<number, SetBonus> = {
    2: {
        description: '+15% speed',
        stats: { speed: 15 }
    },
}

export const SHADOW_SET: SetDefinition = {
    name: 'Shadow',
    items: [], // Will be filled
    bonuses: SHADOW_SET_BONUSES,
    // No minRarity/maxRarity = all items use their template rarity (fixed)
}

export const SHADOW_CLOAK: Omit<Item, 'id'> = {
    name: "Shadow's Cloak",
    description: 'Blends with darkness.',
    type: 'armor',
    rarity: 'epic',  // Always epic (no constraints)
    icon: GiShield,
    stats: {
        defense: 45,
        speed: 20,
    },
    value: 7000,
}

/**
 * Summary of Patterns:
 * 
 * SET-WIDE CONSTRAINTS:
 * - Add minRarity/maxRarity to SetDefinition
 * - Applies to all items unless they have their own constraints
 * - Good for sets with consistent theming
 * 
 * PER-ITEM OVERRIDE:
 * - Add minRarity/maxRarity to individual item
 * - Takes precedence over set-wide constraints
 * - Good for signature pieces that should be more powerful
 * 
 * NO CONSTRAINTS:
 * - Don't add any rarity constraints
 * - Items always roll at their template rarity
 * - Good for fixed-power sets
 * 
 * PRIORITY:
 * 1. Per-item constraints (highest)
 * 2. Set-wide constraints
 * 3. Template rarity (default)
 */
