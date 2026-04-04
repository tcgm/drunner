/**
 * Guild Hall configuration
 * All tunable values for the Hero Board and hiring system.
 */

import { JUNK }           from '@/systems/rarity/rarities/010junk'
import { ABUNDANT }       from '@/systems/rarity/rarities/020abundant'
import { COMMON }         from '@/systems/rarity/rarities/030common'
import { UNCOMMON }       from '@/systems/rarity/rarities/040uncommon'
import { RARE }           from '@/systems/rarity/rarities/050rare'
import { VERY_RARE }      from '@/systems/rarity/rarities/060veryRare'
import { MAGICAL }        from '@/systems/rarity/rarities/070magical'
import { ELITE }          from '@/systems/rarity/rarities/080elite'
import { EPIC }           from '@/systems/rarity/rarities/090epic'
import { LEGENDARY }      from '@/systems/rarity/rarities/100legendary'
import { MYTHIC }         from '@/systems/rarity/rarities/110mythic'
import { MYTHICC }        from '@/systems/rarity/rarities/120mythicc'
import { ARTIFACT }       from '@/systems/rarity/rarities/130artifact'
import { DIVINE }         from '@/systems/rarity/rarities/140divine'
import { CELESTIAL }      from '@/systems/rarity/rarities/150celestial'
import { REALITY_ANCHOR } from '@/systems/rarity/rarities/160realityAnchor'
import { STRUCTURAL }     from '@/systems/rarity/rarities/170structural'
import { SINGULARITY }    from '@/systems/rarity/rarities/180singularity'
import { VOID }           from '@/systems/rarity/rarities/190void'
import { ELDER }          from '@/systems/rarity/rarities/200elder'
import { LAYER }          from '@/systems/rarity/rarities/210layer'
import { PLANE }          from '@/systems/rarity/rarities/220plane'
import { AUTHOR }         from '@/systems/rarity/rarities/230author'

export interface HeroRarityConfig {
  id: string
  label: string
  /** Bright display hex colour sourced from the rarity file's gem field */
  color: string
  /** Spawn weight derived from the rarity file's percentage field */
  weight: number
  bonusStatPoints: number
  hireCostMultiplier: number
}

export const HERO_RARITY_CONFIG = {
  // Low tier (Floors 1-10)
  junk:          { id: 'junk',          label: JUNK.name,           color: JUNK.gem          ?? JUNK.color,           weight: JUNK.percentage,          bonusStatPoints: 0,   hireCostMultiplier: 0.4   },
  abundant:      { id: 'abundant',      label: ABUNDANT.name,       color: ABUNDANT.gem      ?? ABUNDANT.color,       weight: ABUNDANT.percentage,      bonusStatPoints: 0,   hireCostMultiplier: 0.7   },
  common:        { id: 'common',        label: COMMON.name,         color: COMMON.gem        ?? COMMON.color,         weight: COMMON.percentage,        bonusStatPoints: 0,   hireCostMultiplier: 1     },
  uncommon:      { id: 'uncommon',      label: UNCOMMON.name,       color: UNCOMMON.gem      ?? UNCOMMON.color,       weight: UNCOMMON.percentage,      bonusStatPoints: 3,   hireCostMultiplier: 1.5   },
  // Mid tier (Floors 11-30)
  rare:          { id: 'rare',          label: RARE.name,           color: RARE.gem          ?? RARE.color,           weight: RARE.percentage,          bonusStatPoints: 6,   hireCostMultiplier: 2.5   },
  veryRare:      { id: 'veryRare',      label: VERY_RARE.name,      color: VERY_RARE.gem     ?? VERY_RARE.color,      weight: VERY_RARE.percentage,     bonusStatPoints: 9,   hireCostMultiplier: 4     },
  magical:       { id: 'magical',       label: MAGICAL.name,        color: MAGICAL.gem       ?? MAGICAL.color,        weight: MAGICAL.percentage,       bonusStatPoints: 10,  hireCostMultiplier: 5     },
  elite:         { id: 'elite',         label: ELITE.name,          color: ELITE.gem         ?? ELITE.color,          weight: ELITE.percentage,         bonusStatPoints: 11,  hireCostMultiplier: 6     },
  // High tier (Floors 31-60)
  epic:          { id: 'epic',          label: EPIC.name,           color: EPIC.gem          ?? EPIC.color,           weight: EPIC.percentage,          bonusStatPoints: 12,  hireCostMultiplier: 8     },
  legendary:     { id: 'legendary',     label: LEGENDARY.name,      color: LEGENDARY.gem     ?? LEGENDARY.color,      weight: LEGENDARY.percentage,     bonusStatPoints: 20,  hireCostMultiplier: 15    },
  mythic:        { id: 'mythic',        label: MYTHIC.name,         color: MYTHIC.gem        ?? MYTHIC.color,         weight: MYTHIC.percentage,        bonusStatPoints: 30,  hireCostMultiplier: 30    },
  mythicc:       { id: 'mythicc',       label: MYTHICC.name,        color: MYTHICC.gem       ?? MYTHICC.color,        weight: MYTHICC.percentage,       bonusStatPoints: 40,  hireCostMultiplier: 50    },
  // Ultra tier (Floors 61-85)
  artifact:      { id: 'artifact',      label: ARTIFACT.name,       color: ARTIFACT.gem      ?? ARTIFACT.color,       weight: ARTIFACT.percentage,      bonusStatPoints: 55,  hireCostMultiplier: 80    },
  divine:        { id: 'divine',        label: DIVINE.name,         color: DIVINE.gem        ?? DIVINE.color,         weight: DIVINE.percentage,        bonusStatPoints: 70,  hireCostMultiplier: 130   },
  celestial:     { id: 'celestial',     label: CELESTIAL.name,      color: CELESTIAL.gem     ?? CELESTIAL.color,      weight: CELESTIAL.percentage,     bonusStatPoints: 90,  hireCostMultiplier: 200   },
  // God tier (Floors 86-100)
  realityAnchor: { id: 'realityAnchor', label: REALITY_ANCHOR.name, color: REALITY_ANCHOR.gem ?? REALITY_ANCHOR.color, weight: REALITY_ANCHOR.percentage, bonusStatPoints: 110, hireCostMultiplier: 300   },
  structural:    { id: 'structural',    label: STRUCTURAL.name,     color: STRUCTURAL.gem    ?? STRUCTURAL.color,     weight: STRUCTURAL.percentage,    bonusStatPoints: 130, hireCostMultiplier: 450   },
  singularity:   { id: 'singularity',   label: SINGULARITY.name,    color: SINGULARITY.gem   ?? SINGULARITY.color,    weight: SINGULARITY.percentage,   bonusStatPoints: 160, hireCostMultiplier: 700   },
  void:          { id: 'void',          label: VOID.name,           color: VOID.gem          ?? VOID.color,           weight: VOID.percentage,          bonusStatPoints: 210, hireCostMultiplier: 1200  },
  elder:         { id: 'elder',         label: ELDER.name,          color: ELDER.gem         ?? ELDER.color,          weight: ELDER.percentage,         bonusStatPoints: 270, hireCostMultiplier: 2000  },
  // Meta tier (Beyond 100)
  layer:         { id: 'layer',         label: LAYER.name,          color: LAYER.gem         ?? LAYER.color,          weight: LAYER.percentage,         bonusStatPoints: 320, hireCostMultiplier: 3500  },
  plane:         { id: 'plane',         label: PLANE.name,          color: PLANE.gem         ?? PLANE.color,          weight: PLANE.percentage,         bonusStatPoints: 430, hireCostMultiplier: 6000  },
  author:        { id: 'author',        label: AUTHOR.name,         color: AUTHOR.gem        ?? AUTHOR.color,         weight: AUTHOR.percentage,        bonusStatPoints: 550, hireCostMultiplier: 15000 },
} satisfies Record<string, HeroRarityConfig>

/** Derived from config keys — add or remove entries above to change which rarities heroes can have */
export type HeroRarity = keyof typeof HERO_RARITY_CONFIG

export const GUILD_HERO_CONFIG = {
  /** Conversion formula: multiply any hour value by this to get milliseconds */
  msPerHour: 60 * 60 * 1000,

  /** How often a single new hero trickles onto the board (hours). Default: 0.1 (6 min) */
  heroArrivalIntervalHours: 0.1,

  /** How long a hero card stays on the board before leaving (hours). Default: 2 */
  heroExpiryHours: 2,

  /** Maximum heroes on the board at once */
  boardSize: 6,

  /** Number of heroes added by "Call for Adventurers" */
  callHeroCount: 2,

  /** Cooldown for "Call for Adventurers" (hours). Default: 0.5 */
  callCooldownHours: 0.5,

  /** Base gold cost to hire a common level-1 hero */
  baseHireCost: 200,

  /** Gold cost scales up per level: cost *= (1 + (level - 1) * levelCostScale) */
  hireCostLevelScale: 0.2,

} as const
