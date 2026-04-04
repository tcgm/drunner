import type { Quest, QuestType, QuestDifficulty, ItemRarity } from '@/types/quests'
import type { Hero } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { QUEST_CONFIG } from '@/config/questConfig'
import { calcGoldXpReward, rollFragmentRewards } from '@/data/questRewards'

// ── Party power score ─────────────────────────────────────────────────────
//
// Computes a single 0..∞ value that represents how strong the active party is,
// combining both level and total gear stats.  Used to scale quest requirements
// and rewards proportionally so quests always feel achievable but meaningful.
//
//  Formula:
//    avgLevel  (1–20) contributes directly
//    avgTotalStat  = avg(attack + defense + speed) over party members
//    partyPower = avgLevel + avgTotalStat / 15   (≈1 extra power point per 15 stat)
//
// At level 1, bare hands (~10 total stat): power ≈ 1.7
// At level 10, mid tier gear (~80 total):  power ≈ 15.3
// At level 20, endgame gear (~200+ total): power ≈ 33+

export function calcPartyPower(party: (Hero | null)[]): number {
  const members = party.filter((h): h is Hero => h !== null && h.isAlive)
  if (members.length === 0) return 1

  let totalLevel = 0
  let totalStat  = 0
  for (const hero of members) {
    const s = calculateTotalStats(hero)
    totalLevel += hero.level
    totalStat  += s.attack + s.defense + s.speed
  }
  const avgLevel = totalLevel / members.length
  const avgStat  = totalStat  / members.length

  return Math.max(1, avgLevel + avgStat / QUEST_CONFIG.partyPowerStatDivisor)
}

// ── Quest templates ───────────────────────────────────────────────────────
//
// Requirements and rewards are expressed as *multipliers of partyPower* so
// that they grow naturally with both level and gear.
//
//   requirement = round(base * partyPower^exp)
//   reward gold = round(reqGoldRatio * requirement)
//   reward xp   = round(reqXpRatio   * requirement)
//
// Difficulty bands (applied to the scalar):
//   easy   × 1.0   – completable in 1–2 focused runs
//   medium × 2.0   – needs 2–4 runs
//   hard   × 4.0   – demands sustained effort

interface QuestTemplate {
  type: QuestType
  difficulty: QuestDifficulty
  title: string
  descriptionFn: (req: number) => string
  /** Base multiplier before difficulty/power scaling */
  base: number
  /** Exponent applied to partyPower */
  exp: number
  /** Gold per unit of requirement */
  goldPerReq: number
  /** Meta-XP per unit of requirement */
  xpPerReq: number
  /** Rarity tiers available for this quest, ordered low → high */
  rarityPool: ItemRarity[]
}

/**
 * Roll a rarity from `pool` biased by `power`.
 * At low power (≈1) you almost always get index 0 (base tier).
 * As power rises toward 30+ the distribution smoothly opens up
 * toward the top of the pool.
 *
 *   biased = lerp(rand², rand^0.4, t)
 * where t = clamp((power-1)/30, 0, 1)
 */
function rollRarity(pool: ItemRarity[], power: number): ItemRarity {
  const t    = Math.min(1, (power - 1) / QUEST_CONFIG.rarityRollPowerScale)
  const rand = Math.random()
  // t=0 → rand² (mean ≈0.33, favours index 0)
  // t=1 → rand^0.4 (mean ≈0.71, favours top)
  const biased = (1 - t) * rand * rand + t * Math.pow(rand, 0.4)
  const idx    = Math.min(pool.length - 1, Math.floor(biased * pool.length))
  return pool[idx]
}


const QUEST_TEMPLATES: QuestTemplate[] = [
  // Rarity pools: ordered lowest → highest for rollRarity().
  // Easy   → common .. rare
  // Medium → uncommon .. magical
  // Hard   → rare .. legendary

  // ── Kill enemies ──────────────────────────────────────────────────────────
  { type: 'kill_enemies', difficulty: 'easy',   title: 'Pest Control',           descriptionFn: req => `Defeat ${req} enemies in the dungeon.`,                              base: 4,   exp: 1.0, goldPerReq: 8,   xpPerReq: 1.5,  rarityPool: ['common', 'uncommon', 'rare'] },
  { type: 'kill_enemies', difficulty: 'medium',  title: 'Dungeon Cleanse',        descriptionFn: req => `Slay ${req} foul creatures lurking in the depths.`,                  base: 4,   exp: 1.0, goldPerReq: 10,  xpPerReq: 2.0,  rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
  { type: 'kill_enemies', difficulty: 'hard',   title: 'Extermination Order',    descriptionFn: req => `Eliminate ${req} monsters from the dungeon's cursed halls.`,          base: 4,   exp: 1.0, goldPerReq: 13,  xpPerReq: 2.5,  rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },

  // ── Complete runs ─────────────────────────────────────────────────────────
  { type: 'complete_runs', difficulty: 'easy',   title: 'First Expedition',      descriptionFn: req => `Complete ${req} dungeon run${req > 1 ? 's' : ''} (victory or retreat).`, base: 0.15, exp: 0.6, goldPerReq: 150, xpPerReq: 30,   rarityPool: ['common', 'uncommon', 'rare'] },
  { type: 'complete_runs', difficulty: 'medium',  title: 'Seasoned Delver',       descriptionFn: req => `Complete ${req} dungeon runs.`,                                       base: 0.15, exp: 0.6, goldPerReq: 180, xpPerReq: 40,   rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
  { type: 'complete_runs', difficulty: 'hard',   title: 'Veteran Adventurer',    descriptionFn: req => `Complete ${req} dungeon runs without retreating.`,                    base: 0.15, exp: 0.6, goldPerReq: 230, xpPerReq: 55,   rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },

  // ── Reach floor ───────────────────────────────────────────────────────────
  { type: 'reach_floor', difficulty: 'easy',   title: 'Into the Dark',          descriptionFn: req => `Reach Floor ${req} in a single run.`,                                base: 1.2, exp: 0.7, goldPerReq: 120, xpPerReq: 25,   rarityPool: ['common', 'uncommon', 'rare'] },
  { type: 'reach_floor', difficulty: 'medium',  title: 'Depth Diver',            descriptionFn: req => `Descend to Floor ${req} or deeper in a single run.`,                 base: 1.2, exp: 0.7, goldPerReq: 150, xpPerReq: 30,   rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
  { type: 'reach_floor', difficulty: 'hard',   title: 'Legend of the Deep',      descriptionFn: req => `Reach the treacherous Floor ${req} in a single run.`,                base: 1.2, exp: 0.7, goldPerReq: 200, xpPerReq: 40,   rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },

  // ── Defeat bosses ─────────────────────────────────────────────────────────
  { type: 'defeat_bosses', difficulty: 'easy',   title: 'Monster Hunter',        descriptionFn: req => `Defeat ${req} dungeon boss${req > 1 ? 'es' : ''}.`,                  base: 0.4, exp: 0.8, goldPerReq: 200, xpPerReq: 40,   rarityPool: ['common', 'uncommon', 'rare'] },
  { type: 'defeat_bosses', difficulty: 'medium',  title: 'Boss Slayer',           descriptionFn: req => `Bring down ${req} fearsome bosses in the dungeon depths.`,          base: 0.4, exp: 0.8, goldPerReq: 250, xpPerReq: 50,   rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
  { type: 'defeat_bosses', difficulty: 'hard',   title: 'Champion of the Realm',  descriptionFn: req => `Slay ${req} powerful bosses to prove your guild's legend.`,      base: 0.4, exp: 0.8, goldPerReq: 320, xpPerReq: 65,   rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },

  // ── Earn gold ─────────────────────────────────────────────────────────────
  { type: 'earn_gold', difficulty: 'easy',   title: 'Gold Rush',                descriptionFn: req => `Earn ${req.toLocaleString()} gold from dungeon runs.`,                base: 20, exp: 1.2, goldPerReq: 0.5, xpPerReq: 0.1,  rarityPool: ['common', 'uncommon', 'rare'] },
  { type: 'earn_gold', difficulty: 'medium',  title: 'Treasure Hunter',          descriptionFn: req => `Collect ${req.toLocaleString()} gold from dungeon expeditions.`,     base: 20, exp: 1.2, goldPerReq: 0.6, xpPerReq: 0.12, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
  { type: 'earn_gold', difficulty: 'hard',   title: 'Hoard of the Ages',         descriptionFn: req => `Amass ${req.toLocaleString()} gold from the dark dungeon vaults.`,   base: 20, exp: 1.2, goldPerReq: 0.8, xpPerReq: 0.15, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },
]

// ── Helpers ────────────────────────────────────────────────────────────────

/** Round to a "nice" integer – fewer digits look cleaner on the UI */
function niceRound(n: number, snap = 5): number {
  return Math.max(1, Math.round(n / snap) * snap)
}

function calcRequirement(template: QuestTemplate, power: number): number {
  const settings = QUEST_CONFIG.typeSettings[template.type]
  const max = settings.maxPerDifficulty?.[template.difficulty] ?? settings.max
  const raw = template.base * Math.pow(power, template.exp) * QUEST_CONFIG.difficultyReqMult[template.difficulty]
  const snapped = niceRound(raw, settings.snap)
  return Math.min(max, Math.max(1, snapped))
}

/**
 * Generate `count` fresh available quests scaled to the current party's power.
 * Types already held by `existingQuests` are excluded so the board stays varied.
 * Only rarities whose `minFloor` is ≤ `deepestFloor` are eligible for the roll.
 */
export function generateQuests(
  existingQuests: Quest[],
  party: (Hero | null)[],
  count: number = QUEST_CONFIG.boardSlots,
  deepestFloor: number = 0,
): Quest[] {
  const power = calcPartyPower(party)

  const activeTypes = new Set(
    existingQuests
      .filter(q => q.status === 'active' || q.status === 'available')
      .map(q => q.type)
  )

  const eligible = QUEST_TEMPLATES.filter(t => !activeTypes.has(t.type))
  const shuffled  = [...eligible].sort(() => Math.random() - 0.5)
  const picked    = shuffled.slice(0, count)

  const now = Date.now()
  return picked.map(template => {
    const requirement = calcRequirement(template, power)
    const { gold, metaXp } = calcGoldXpReward(template.goldPerReq, template.xpPerReq, requirement, template.difficulty)
    // Only roll from rarities the player has unlocked via deepestFloor
    const unlockedPool = template.rarityPool.filter(r => (RARITY_CONFIGS[r]?.minFloor ?? 0) <= deepestFloor)
    const pool = unlockedPool.length > 0 ? unlockedPool : [template.rarityPool[0]]
    const rarity = rollRarity(pool, power)
    const minFloor = RARITY_CONFIGS[rarity]?.minFloor ?? 0
    const items = rollFragmentRewards(rarity, template.difficulty, deepestFloor)
    return {
      id:          `quest-${now}-${Math.random().toString(36).slice(2, 8)}`,
      title:       template.title,
      description: template.descriptionFn(requirement),
      type:        template.type,
      difficulty:  template.difficulty,
      rarity,
      minFloor,
      requirement,
      progress:    0,
      reward:      { gold, metaXp, items },
      status:      'available' as const,
      generatedAt: now,
      expiresAt:   now + QUEST_CONFIG.expiryHours * QUEST_CONFIG.msPerHour,
    }
  })
}
