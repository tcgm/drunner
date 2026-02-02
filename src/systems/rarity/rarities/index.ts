/**
 * Individual rarity configurations
 * Each rarity is in its own file following the Individual File Principle
 */

import type { ItemRarity } from '@/types'
import type { RarityConfig } from '../types'

// Low tier (Floors 1-10)
export { JUNK } from './junk'
export { ABUNDANT } from './abundant'
export { COMMON } from './common'
export { UNCOMMON } from './uncommon'

// Mid tier (Floors 11-30)
export { RARE } from './rare'
export { VERY_RARE } from './veryRare'
export { MAGICAL } from './magical'
export { ELITE } from './elite'

// High tier (Floors 31-60)
export { EPIC } from './epic'
export { LEGENDARY } from './legendary'
export { MYTHIC } from './mythic'
export { MYTHICC } from './mythicc'

// Ultra tier (Floors 61-85)
export { ARTIFACT } from './artifact'
export { DIVINE } from './divine'
export { CELESTIAL } from './celestial'

// God tier (Floors 86-100)
export { REALITY_ANCHOR } from './realityAnchor'
export { STRUCTURAL } from './structural'
export { SINGULARITY } from './singularity'
export { VOID } from './void'
export { ELDER } from './elder'

// Meta tier (Beyond 100 / Special)
export { LAYER } from './layer'
export { PLANE } from './plane'
export { AUTHOR } from './author'

// Import all rarities
import { JUNK } from './junk'
import { ABUNDANT } from './abundant'
import { COMMON } from './common'
import { UNCOMMON } from './uncommon'
import { RARE } from './rare'
import { VERY_RARE } from './veryRare'
import { MAGICAL } from './magical'
import { ELITE } from './elite'
import { EPIC } from './epic'
import { LEGENDARY } from './legendary'
import { MYTHIC } from './mythic'
import { MYTHICC } from './mythicc'
import { ARTIFACT } from './artifact'
import { DIVINE } from './divine'
import { CELESTIAL } from './celestial'
import { REALITY_ANCHOR } from './realityAnchor'
import { STRUCTURAL } from './structural'
import { SINGULARITY } from './singularity'
import { VOID } from './void'
import { ELDER } from './elder'
import { LAYER } from './layer'
import { PLANE } from './plane'
import { AUTHOR } from './author'

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
        border: config.color,
        glow: config.glow || `rgba(255, 255, 255, 0.5)`,
        text: config.text || config.color,
        textLight: config.textLight || config.color,
        bg: config.bg || `rgba(255, 255, 255, 0.1)`,
        gem: config.gem || config.color,
    }
}
