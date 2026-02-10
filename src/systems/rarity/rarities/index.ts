/**
 * Individual rarity configurations
 * Each rarity is in its own file following the Individual File Principle
 */

import type { ItemRarity } from '@/types'
import type { RarityConfig } from '../types'

// Low tier (Floors 1-10)
export { JUNK } from './010junk'
export { ABUNDANT } from './020abundant'
export { COMMON } from './030common'
export { UNCOMMON } from './040uncommon'

// Mid tier (Floors 11-30)
export { RARE } from './050rare'
export { VERY_RARE } from './060veryRare'
export { MAGICAL } from './070magical'
export { ELITE } from './080elite'

// High tier (Floors 31-60)
export { EPIC } from './090epic'
export { LEGENDARY } from './100legendary'
export { MYTHIC } from './110mythic'
export { MYTHICC } from './120mythicc'

// Ultra tier (Floors 61-85)
export { ARTIFACT } from './130artifact'
export { DIVINE } from './140divine'
export { CELESTIAL } from './150celestial'

// God tier (Floors 86-100)
export { REALITY_ANCHOR } from './160realityAnchor'
export { STRUCTURAL } from './170structural'
export { SINGULARITY } from './180singularity'
export { VOID } from './190void'
export { ELDER } from './200elder'

// Meta tier (Beyond 100 / Special)
export { LAYER } from './210layer'
export { PLANE } from './220plane'
export { AUTHOR } from './230author'

// Import all rarities
import { JUNK } from './010junk'
import { ABUNDANT } from './020abundant'
import { COMMON } from './030common'
import { UNCOMMON } from './040uncommon'
import { RARE } from './050rare'
import { VERY_RARE } from './060veryRare'
import { MAGICAL } from './070magical'
import { ELITE } from './080elite'
import { EPIC } from './090epic'
import { LEGENDARY } from './100legendary'
import { MYTHIC } from './110mythic'
import { MYTHICC } from './120mythicc'
import { ARTIFACT } from './130artifact'
import { DIVINE } from './140divine'
import { CELESTIAL } from './150celestial'
import { REALITY_ANCHOR } from './160realityAnchor'
import { STRUCTURAL } from './170structural'
import { SINGULARITY } from './180singularity'
import { VOID } from './190void'
import { ELDER } from './200elder'
import { LAYER } from './210layer'
import { PLANE } from './220plane'
import { AUTHOR } from './230author'

// Map of all rarities by ID for easy lookup
export const ALL_RARITIES: Record<ItemRarity, RarityConfig> = {
    junk: JUNK,
    abundant: ABUNDANT,
    common: COMMON,
    uncommon: UNCOMMON,
    rare: RARE,
    veryRare: VERY_RARE,
    magical: MAGICAL,
    elite: ELITE,
    epic: EPIC,
    legendary: LEGENDARY,
    mythic: MYTHIC,
    mythicc: MYTHICC,
    artifact: ARTIFACT,
    divine: DIVINE,
    celestial: CELESTIAL,
    realityAnchor: REALITY_ANCHOR,
    structural: STRUCTURAL,
    singularity: SINGULARITY,
    void: VOID,
    elder: ELDER,
    layer: LAYER,
    plane: PLANE,
    author: AUTHOR,
}

// Helper function to get rarity config by ID
export function getRarityConfig(id: ItemRarity): RarityConfig {
    return ALL_RARITIES[id]
}

// Helper function to convert rarity config to color theme format used in components
export function getRarityColors(rarity: ItemRarity) {
    const config = ALL_RARITIES[rarity]
    if (!config) {
        // Fallback for missing rarity configs
        return {
            border: '#9CA3AF',
            glow: 'rgba(156, 163, 175, 0.5)',
            text: '#9CA3AF',
            textLight: '#D1D5DB',
            bg: 'rgba(156, 163, 175, 0.1)',
            gem: '#9CA3AF',
        }
    }
    return {
        border: config.border || config.color,
        glow: config.glow || `rgba(255, 255, 255, 0.5)`,
        text: config.text || config.color,
        textLight: config.textLight || config.color,
        bg: config.bg || `rgba(255, 255, 255, 0.1)`,
        gem: config.gem || config.color,
    }
}
