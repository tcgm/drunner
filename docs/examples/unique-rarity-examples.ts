/**
 * Example: How to add rarity constraints to existing unique items
 * 
 * This shows various patterns for controlling unique item rarity ranges
 */

import { GiBroadsword, GiDaggers, GiCrossbow } from 'react-icons/gi'
import type { Item } from '../../src/types'

// PATTERN 1: Fixed Rarity (Original Behavior)
// No minRarity/maxRarity = always rolls at template rarity
export const SHADOWFANG: Omit<Item, 'id'> = {
    name: 'Shadowfang',
    description: 'A dark blade that drinks the souls of the fallen.',
    type: 'weapon',
    rarity: 'legendary',  // Always legendary
    icon: GiDaggers,
    stats: {
        attack: 120,
        speed: 25,
    },
    value: 8000,
}

// PATTERN 2: Early to Mid-Game Unique
// Can drop early but scales with progression
export const ADVENTURERS_BLADE: Omit<Item, 'id'> = {
    name: "Adventurer's Blade",
    description: 'A reliable sword that grows stronger with its wielder.',
    type: 'weapon',
    rarity: 'uncommon',       // Base rarity (template)
    minRarity: 'uncommon',    // Can find as uncommon
    maxRarity: 'epic',        // Scales up to epic
    icon: GiBroadsword,
    stats: {
        attack: 80,
        defense: 10,
    },
    value: 3000,
}

// PATTERN 3: Late-Game Only Unique
// Only drops at high depths with extreme power
export const WORLDENDER: Omit<Item, 'id'> = {
    name: 'Worldender',
    description: 'An artifact of unspeakable power. Reality bends in its presence.',
    type: 'weapon',
    rarity: 'legendary',      // Base rarity
    minRarity: 'legendary',   // Never drops below legendary
    maxRarity: 'artifact',    // Can reach artifact
    icon: GiBroadsword,
    stats: {
        attack: 200,
        maxHp: 50,
        luck: 15,
    },
    value: 20000,
}

// PATTERN 4: Wide Progression Range
// Useful throughout the entire game
export const MERCENARY_CROSSBOW: Omit<Item, 'id'> = {
    name: 'Mercenary Crossbow',
    description: 'A flexible weapon that adapts to any situation.',
    type: 'weapon',
    rarity: 'common',         // Can find very early
    minRarity: 'common',
    maxRarity: 'mythic',      // Scales all the way to end-game
    icon: GiCrossbow,
    stats: {
        attack: 60,
        speed: 15,
    },
    value: 1500,
}

// PATTERN 5: Narrow Elite Range
// High-end weapon with controlled variance
export const EXCALIBUR: Omit<Item, 'id'> = {
    name: 'Excalibur',
    description: 'The legendary blade of kings.',
    type: 'weapon',
    rarity: 'legendary',
    minRarity: 'legendary',   // Only legendary
    maxRarity: 'mythic',      // Or mythic
    icon: GiBroadsword,
    stats: {
        attack: 150,
        defense: 20,
        luck: 10,
    },
    value: 10000,
}

/**
 * Tips:
 * 
 * 1. No constraints = fixed rarity (existing behavior)
 * 2. Wide range = useful at many depths
 * 3. Narrow range = predictable power level
 * 4. High minimum = endgame exclusive
 * 5. Template rarity should typically match minRarity
 */
