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
import { generateHeroName } from '@/data/heroes/heroNames'

// ── Rarity config ──────────────────────────────────────────────────────────

export interface HeroRarityConfig {
  id: HeroRarity
  label: string
  color: string       // Chakra color token or hex
  weight: number      // Relative spawn weight (higher = more common)
  bonusStatPoints: number  // Extra flat points distributed across 1-2 stats
  hireCostMultiplier: number
}

export const HERO_RARITY_CONFIG: Record<HeroRarity, HeroRarityConfig> = {
  common: {
    id: 'common',
    label: 'Common',
    color: 'gray.400',
    weight: 50,
    bonusStatPoints: 0,
    hireCostMultiplier: 1,
  },
  uncommon: {
    id: 'uncommon',
    label: 'Uncommon',
    color: 'green.400',
    weight: 28,
    bonusStatPoints: 3,
    hireCostMultiplier: 1.5,
  },
  rare: {
    id: 'rare',
    label: 'Rare',
    color: 'blue.400',
    weight: 14,
    bonusStatPoints: 6,
    hireCostMultiplier: 2.5,
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    color: 'purple.400',
    weight: 6,
    bonusStatPoints: 12,
    hireCostMultiplier: 5,
  },
  legendary: {
    id: 'legendary',
    label: 'Legendary',
    color: 'orange.400',
    weight: 2,
    bonusStatPoints: 20,
    hireCostMultiplier: 10,
  },
}

export const HERO_RARITY_ORDER: HeroRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']

// ── Base hire costs ────────────────────────────────────────────────────────

const BASE_HIRE_COST = 200

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
  return Math.round(BASE_HIRE_COST * cfg.hireCostMultiplier * (1 + (level - 1) * 0.2))
}

export function generateHireableHero(seed?: number): HireableHero {
  const rng = mulberry32(seed ?? Math.floor(Math.random() * 0x7fffffff))

  // Roll rarity
  const rarityItems = HERO_RARITY_ORDER.map(r => ({
    value: r,
    weight: HERO_RARITY_CONFIG[r].weight,
  }))
  const heroRarity = weightedRandom(rarityItems, rng)

  // Roll species
  const species = pick(ALL_SPECIES, rng).id as HeroSpecies

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
export function generateHeroBoard(count = 6, baseSeed?: number): HireableHero[] {
  const seed = baseSeed ?? Date.now()
  return Array.from({ length: count }, (_, i) => generateHireableHero(seed + i * 0x9e3779b9))
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
  }
}
