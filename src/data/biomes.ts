import type { Biome, MapNodeType } from '@/types'
import { TAGS, type EventTag } from './tags'

/**
 * All biome definitions.
 *
 * Each biome carries:
 *  - `allowedTags`       — tags from TAGS registry; events matching any tag get a selection bonus
 *  - `floorRange`        — the floor band where this biome is most common (can still appear outside)
 *  - `nodeTypeWeights`   — optional overrides to the default map node distribution
 *  - `color`             — hex tint for the floor map UI
 */
export const BIOMES: Biome[] = [
  {
    id: 'dungeon',
    name: 'Stone Dungeon',
    description: 'The classic torch-lit dungeon: damp corridors, iron doors, and things lurking in the dark.',
    allowedTags: [TAGS.DUNGEON, TAGS.CAVE, TAGS.UNDERGROUND, TAGS.GOBLIN, TAGS.ORC, TAGS.TROLL, TAGS.SKELETON, TAGS.UNDEAD],
    floorRange: [1, 10],
    color: '#6b7280',
  },
  {
    id: 'cave',
    name: 'Deep Caverns',
    description: 'Winding natural tunnels riddled with crystals, subterranean beasts, and oozing passages.',
    allowedTags: [TAGS.CAVE, TAGS.UNDERGROUND, TAGS.BEAST, TAGS.OOZE, TAGS.INSECT, TAGS.BAT, TAGS.SPIDER, TAGS.FUNGUS, TAGS.EARTH],
    floorRange: [5, 25],
    nodeTypeWeights: { mining: 10, trap: 7 },
    color: '#78716c',
  },
  {
    id: 'ruins',
    name: 'Ancient Ruins',
    description: 'Crumbled temples and forgotten vaults haunted by the echoes of long-dead civilisations.',
    allowedTags: [TAGS.RUINS, TAGS.ARCANE, TAGS.UNDEAD, TAGS.SKELETON, TAGS.GHOST, TAGS.CONSTRUCT, TAGS.GOLEM, TAGS.HUMANOID],
    floorRange: [10, 35],
    nodeTypeWeights: { treasure: 18, choice: 26 },
    color: '#a16207',
  },
  {
    id: 'swamp',
    name: 'Festering Swamp',
    description: 'A rotting bog thick with poisonous miasma, plague-carriers, and hungry plant-horrors.',
    allowedTags: [TAGS.SWAMP, TAGS.POISON, TAGS.ACID, TAGS.PLANT, TAGS.BEAST, TAGS.OOZE, TAGS.ZOMBIE, TAGS.UNDEAD, TAGS.FUNGUS, TAGS.PLAGUE, TAGS.SNAKE],
    floorRange: [15, 40],
    nodeTypeWeights: { trap: 8, combat: 38 },
    color: '#4d7c0f',
  },
  {
    id: 'forest',
    name: 'Cursed Forest',
    description: 'A primeval wood where nature itself has turned hostile — wolves, druids, and fae creatures lurk between gnarled trees.',
    allowedTags: [TAGS.FOREST, TAGS.BEAST, TAGS.WOLF, TAGS.PLANT, TAGS.SPIRIT, TAGS.FAE, TAGS.HUMANOID, TAGS.INSECT, TAGS.SPIDER],
    floorRange: [10, 30],
    nodeTypeWeights: { choice: 25, rest: 14 },
    color: '#15803d',
  },
  {
    id: 'arctic',
    name: 'Frozen Wastes',
    description: 'A blizzard-blasted tundra of cracking ice, frost revenants, and creatures adapted to killing cold.',
    allowedTags: [TAGS.ARCTIC, TAGS.ICE, TAGS.BEAST, TAGS.WOLF, TAGS.ELEMENTAL, TAGS.SPIRIT, TAGS.UNDEAD, TAGS.WRAITH],
    floorRange: [20, 50],
    nodeTypeWeights: { combat: 38, trap: 7 },
    color: '#93c5fd',
  },
  {
    id: 'volcanic',
    name: 'Volcanic Depths',
    description: 'Rivers of magma carve through obsidian halls. Fire elementals and drake-spawn thrive in the searing heat.',
    allowedTags: [TAGS.VOLCANIC, TAGS.FIRE, TAGS.ELEMENTAL, TAGS.BEAST, TAGS.DRAKE, TAGS.DRAGON, TAGS.UNDERGROUND],
    floorRange: [25, 55],
    nodeTypeWeights: { combat: 40, mining: 8, rest: 9 },
    color: '#dc2626',
  },
  {
    id: 'abyss',
    name: 'The Abyss',
    description: 'A lightless realm where void entities and shadow predators hunt between tears in reality.',
    allowedTags: [TAGS.ABYSS, TAGS.VOID, TAGS.SHADOW, TAGS.COSMIC, TAGS.ABERRATION, TAGS.ELEMENTAL, TAGS.WRAITH],
    floorRange: [40, 70],
    nodeTypeWeights: { combat: 42, choice: 18, rest: 10 },
    color: '#4c1d95',
  },
  {
    id: 'infernal',
    name: 'Infernal Wastes',
    description: 'A plane of hellfire and sulphur lorded over by demons, devils, and fallen paladins damned to eternal servitude.',
    allowedTags: [TAGS.INFERNAL, TAGS.FIRE, TAGS.DEMON, TAGS.DEVIL, TAGS.UNDEAD, TAGS.HUMANOID, TAGS.BLOOD],
    floorRange: [50, 80],
    nodeTypeWeights: { combat: 45, merchant: 6 },
    color: '#b91c1c',
  },
  {
    id: 'ethereal',
    name: 'Ethereal Plane',
    description: 'A shimmering dimension where spirits drift, celestial beings judge the living, and reality bends to will.',
    allowedTags: [TAGS.ETHEREAL, TAGS.CELESTIAL, TAGS.SPIRIT, TAGS.GHOST, TAGS.ARCANE, TAGS.COSMIC, TAGS.UNDEAD, TAGS.FAE],
    floorRange: [60, 90],
    nodeTypeWeights: { choice: 28, treasure: 16, rest: 13 },
    color: '#7c3aed',
  },
  {
    id: 'mechanical',
    name: 'The Iron Forge',
    description: 'Vast automated halls of grinding gears and arcane machinery, tended by constructs that no longer remember their makers.',
    allowedTags: [TAGS.MECHANICAL, TAGS.CONSTRUCT, TAGS.GOLEM, TAGS.AUTOMATON, TAGS.ARCANE, TAGS.LIGHTNING, TAGS.EARTH],
    floorRange: [35, 65],
    nodeTypeWeights: { combat: 36, trap: 9, mining: 7 },
    color: '#374151',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Void',
    description: 'The outermost dark — where star-spawn, reality-eaters, and things without name drift between the dying lights.',
    allowedTags: [TAGS.COSMIC, TAGS.VOID, TAGS.ABYSS, TAGS.ABERRATION, TAGS.ELEMENTAL, TAGS.SHADOW, TAGS.COSMIC_ENV],
    floorRange: [75, 100],
    nodeTypeWeights: { combat: 44, choice: 20 },
    color: '#1e1b4b',
  },
]

/** Quick lookup map */
export const BIOME_MAP: Readonly<Record<string, Biome>> = Object.fromEntries(
  BIOMES.map((b) => [b.id, b]),
)

/**
 * Pick a biome for the given floor number.
 *
 * Strategy:
 *  1. Collect all biomes whose `floorRange` includes the floor.
 *  2. If none match, fall back to all biomes (no floor restriction).
 *  3. Return a uniformly random pick from the candidates.
 */
export function pickBiomeForFloor(floor: number): Biome {
  const candidates = BIOMES.filter(
    (b) => !b.floorRange || (floor >= b.floorRange[0] && floor <= b.floorRange[1]),
  )
  const pool = candidates.length > 0 ? candidates : BIOMES
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Return the weight multiplier for an event given the active biome's allowed tags.
 *
 * Events that share at least one tag with the biome's allowedTags get a 3× bonus.
 * Events with no tags at all (untagged) are neutral (1×).
 */
export function biomeBonusMultiplier(
  eventTags: EventTag[] | undefined,
  biomeAllowedTags: EventTag[],
): number {
  if (!eventTags || eventTags.length === 0) return 1
  const hasOverlap = eventTags.some((t) => (biomeAllowedTags as string[]).includes(t))
  return hasOverlap ? 3 : 1
}
