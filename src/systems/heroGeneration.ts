/**
 * Hero generation system
 * Generates discrete heroes for the Guild Hall Hero Board.
 * Each hero has a name, species, rarity, and stat bonuses that compose on top of class base stats.
 */

import { v4 as uuidv4 } from 'uuid'
import type {
  HireableHero,
  HeroRarity,
  HeroSpecies,
  HeroStatBonus,
} from '@/types'
import { CORE_CLASSES } from '@/data/classes'
import { ALL_SPECIES } from '@/data/heroes/species'
import { generateHeroName } from '@/data/heroes/names'
import type { UniqueHeroDefinition } from '@/data/heroes/unique'
import { ALL_UNIQUE_HEROES } from '@/data/heroes/unique'
import { GUILD_HERO_CONFIG, HERO_RARITY_CONFIG } from '@/config/guildHeroConfig'
export type { HeroRarityConfig } from '@/config/guildHeroConfig'
export { HERO_RARITY_CONFIG } from '@/config/guildHeroConfig'

export const HERO_RARITY_ORDER: HeroRarity[] = [
  'junk', 'abundant', 'common', 'uncommon',
  'rare', 'veryRare', 'magical', 'elite',
  'epic', 'legendary', 'mythic', 'mythicc',
  'artifact', 'divine', 'celestial',
  'realityAnchor', 'structural', 'singularity', 'void', 'elder',
  'layer', 'plane', 'author',
]

// ── Seeded RNG ────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function weightedRandom<T>(items: { value: T; weight: number }[], rng: () => number): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  let roll = rng() * total
  for (const item of items) {
    roll -= item.weight
    if (roll <= 0) return item.value
  }
  return items[items.length - 1].value
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

// ── Bonus stat generation ─────────────────────────────────────────────────

const BONUS_STATS = ['attack', 'defense', 'speed', 'luck', 'wisdom', 'charisma', 'maxHp'] as const
type BonusStat = typeof BONUS_STATS[number]

function generateRarityBonuses(
  rarity: HeroRarity,
  rng: () => number,
): HeroStatBonus[] {
  const cfg = HERO_RARITY_CONFIG[rarity]
  if (cfg.bonusStatPoints === 0) return []

  // Distribute points across 1-2 stats, weighted toward primary rarity flavour
  const statCount = rarity === 'legendary' || rarity === 'epic' ? 2 : 1
  const bonuses: HeroStatBonus[] = []
  const pointsPerStat = Math.ceil(cfg.bonusStatPoints / statCount)
  const usedStats = new Set<BonusStat>()

  for (let i = 0; i < statCount; i++) {
    let stat: BonusStat
    do { stat = pick(BONUS_STATS as unknown as BonusStat[], rng) } while (usedStats.has(stat))
    usedStats.add(stat)
    bonuses.push({ stat, value: pointsPerStat, source: 'rarity' })
  }

  return bonuses
}

// ── Hero generation ───────────────────────────────────────────────────────

function generateHireCost(rarity: HeroRarity, level: number): number {
  const cfg = HERO_RARITY_CONFIG[rarity]
  return Math.round(GUILD_HERO_CONFIG.baseHireCost * cfg.hireCostMultiplier * (1 + (level - 1) * GUILD_HERO_CONFIG.hireCostLevelScale))
}

/**
 * Roll a species appropriate for the given rarity tier.
 * Species with spawnRarity > heroRarity are excluded.
 */
export function rollSpeciesForRarity(heroRarity: HeroRarity, rng: () => number): HeroSpecies {
  const rarityIndex = HERO_RARITY_ORDER.indexOf(heroRarity)
  const eligible = ALL_SPECIES.filter(
    s => HERO_RARITY_ORDER.indexOf(s.spawnRarity) <= rarityIndex
  )
  return pick(eligible.length > 0 ? eligible : ALL_SPECIES, rng).id as HeroSpecies
}

/**
 * Deterministically assign a species to an existing hero using their ID as seed.
 * Used during migration for heroes created before the species system existed.
 */
export function rollSpeciesForHero(heroId: string, heroRarity?: HeroRarity): HeroSpecies {
  // Hash the UUID into a 32-bit seed
  let seed = 0
  for (let i = 0; i < heroId.length; i++) {
    seed = (Math.imul(31, seed) + heroId.charCodeAt(i)) | 0
  }
  const rng = mulberry32(seed >>> 0)
  return rollSpeciesForRarity(heroRarity ?? 'common', rng)
}

export function generateHireableHero(seed?: number): HireableHero {
  const rng = mulberry32(seed ?? Math.floor(Math.random() * 0x7fffffff))

  // Roll rarity
  const rarityItems = HERO_RARITY_ORDER.map(r => ({
    value: r,
    weight: HERO_RARITY_CONFIG[r].weight,
  }))
  const heroRarity = weightedRandom(rarityItems, rng)

  // Roll species — only species whose spawnRarity <= heroRarity are eligible
  const species = rollSpeciesForRarity(heroRarity, rng)

  // Roll class
  const heroClass = pick(CORE_CLASSES, rng)

  // Level: common=1, uncommon=1-2, rare=1-3, epic=2-4, legendary=3-5
  const levelRanges: Record<HeroRarity, [number, number]> = {
    common:    [1, 1],
    uncommon:  [1, 2],
    rare:      [1, 3],
    epic:      [2, 4],
    legendary: [3, 5],
  }
  const [minLv, maxLv] = levelRanges[heroRarity]
  const level = minLv + Math.floor(rng() * (maxLv - minLv + 1))

  // Name
  const name = generateHeroName(species, rng)

  // Species stat bonuses
  const speciesDef = ALL_SPECIES.find(s => s.id === species)!
  const speciesBonuses: HeroStatBonus[] = speciesDef.statBonuses.map(b => ({
    ...b,
    source: 'species' as const,
  }))

  // Rarity stat bonuses
  const rarityBonuses = generateRarityBonuses(heroRarity, rng)

  const statBonuses = [...speciesBonuses, ...rarityBonuses]

  return {
    id: uuidv4(),
    name,
    heroClass,
    species,
    heroRarity,
    level,
    statBonuses,
    hireCost: generateHireCost(heroRarity, level),
  }
}

/** Generate a full board of hireable heroes (default 6 slots) */
export function generateHeroBoard(
  count = 6,
  baseSeed?: number,
  opts: { hiredUniqueIds?: string[]; dismissedUniqueIds?: string[] } = {},
): HireableHero[] {
  const seed = baseSeed ?? Date.now()
  const { hiredUniqueIds = [], dismissedUniqueIds = [] } = opts

  // Eligible uniques: not currently hired (can reappear after dismissal)
  const eligibleUniques = ALL_UNIQUE_HEROES.filter(
    u => !hiredUniqueIds.includes(u.id)
  )

  const board: HireableHero[] = []
  let uniqueInserted = false

  // Shuffle uniques with seeded RNG so order varies per board
  const uniqueRng = mulberry32(seed ^ 0xdeadbeef)
  const shuffledUniques = [...eligibleUniques].sort(() => uniqueRng() - 0.5)

  for (let i = 0; i < count; i++) {
    // Try to slot one unique hero per board (first eligible, not already on this board)
    if (!uniqueInserted && shuffledUniques.length > 0) {
      const unique = shuffledUniques[0]
      board.push(uniqueHeroToHireable(unique))
      uniqueInserted = true
      continue
    }
    board.push(generateHireableHero(seed + i * 0x9e3779b9))
  }

  return board
}

/** Convert a UniqueHeroDefinition to a HireableHero board card */
export function uniqueHeroToHireable(def: UniqueHeroDefinition): HireableHero {
  const heroClass = CORE_CLASSES.find(c => c.id === def.classId) ?? CORE_CLASSES[0]
  const speciesDef = ALL_SPECIES.find(s => s.id === def.species)!

  const speciesBonuses: HeroStatBonus[] = speciesDef.statBonuses.map(b => ({
    ...b,
    source: 'species' as const,
  }))
  const uniqueBonuses: HeroStatBonus[] = def.statBonuses.map(b => ({
    ...b,
    source: 'rarity' as const,
  }))

  const hireCost = def.hireCostOverride ?? generateHireCost(def.heroRarity, def.level)

  return {
    id: `unique_${def.id}`,
    name: def.name,
    heroClass,
    species: def.species,
    heroRarity: def.heroRarity,
    level: def.level,
    statBonuses: [...speciesBonuses, ...uniqueBonuses],
    hireCost,
    uniqueHeroId: def.id,
    lore: def.lore,
  }
}

/** Convert a HireableHero into a full Hero (for adding to roster after hire) */
import { createHero } from '@/utils/heroUtils'

export function hireableHeroToHero(h: HireableHero) {
  const hero = createHero(h.heroClass, h.name, h.level)

  // Apply stat bonuses on top of base stats
  let { stats } = hero
  for (const bonus of h.statBonuses) {
    if (bonus.stat === 'maxHp') {
      stats = { ...stats, maxHp: stats.maxHp + bonus.value, hp: stats.maxHp + bonus.value }
    } else {
      stats = { ...stats, [bonus.stat]: (stats[bonus.stat] ?? 0) + bonus.value }
    }
  }

  return {
    ...hero,
    stats,
    species: h.species,
    heroRarity: h.heroRarity,
    statBonuses: h.statBonuses,
    ...(h.uniqueHeroId ? { uniqueHeroId: h.uniqueHeroId } : {}),
  }
}
