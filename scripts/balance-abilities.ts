#!/usr/bin/env tsx
/**
 * balance-abilities.ts
 *
 * Analyzes hero ability DPT at key floor/level milestones against scaled zone
 * boss defense, flagging outliers (overtuned, underperforming, scaling-dominated).
 *
 * All class and ability data is read directly from the real source files.
 * Boss scaling formulas mirror those in bossStats.ts / dangerCalculation.ts.
 *
 * Usage:
 *   npm run balance-abilities
 */

import { WARRIOR }     from '@/data/classes/warrior'
import { MAGE }        from '@/data/classes/mage'
import { ROGUE }       from '@/data/classes/rogue'
import { CLERIC }      from '@/data/classes/cleric'
import { RANGER }      from '@/data/classes/ranger'
import { PALADIN }     from '@/data/classes/paladin'
import { NECROMANCER } from '@/data/classes/necromancer'
import { DRUID }       from '@/data/classes/druid'
import { SHAMAN }      from '@/data/classes/shaman'
import { BARD }        from '@/data/classes/bard'

import { GAME_CONFIG }                              from '@/config/gameConfig'
import { calculateBlockPercent }                    from '@/config/defenseConfig'
import { RARITY_CONFIGS }                           from '@/systems/rarity/raritySystem'
import { MATERIALS_BY_RARITY }                      from '@/data/items/materials/index'
// ALL_BASE_TEMPLATES is NOT imported — crown.ts / wizardhat.ts contain SVG asset
// imports that tsx cannot handle. Base stats are inlined below from source files.
import type { HeroClass, Ability, ItemRarity }      from '@/types'
import type { Material }                            from '@/data/items/materials/index'

// ─── Config shorthand ────────────────────────────────────────────────────────

const tb = GAME_CONFIG.combat.turnBased

// ─── Boss-scaling helpers (mirrors bossStats.ts / dangerCalculation.ts) ──────

function calcDanger(floor: number): number {
  const w = tb.dangerWeights
  return floor * w.floor  // depth=0, combatDepth=0 at combat start
}

function applyEarlyScaling(danger: number, floor: number): number {
  const cfg = tb.earlyBossScaling
  if (!cfg.enabled || floor > cfg.maxFloor) return danger
  const reduction = Math.max(0, cfg.baseReduction - (floor - 1) * cfg.taperPerFloor)
  return danger * (1 - reduction)
}

function scaledStat(base: number, danger: number, factor: number): number {
  return Math.round(base * (1 + (danger - 1) * factor))
}

// ─── Hero-stat helpers ────────────────────────────────────────────────────────

function heroStatAtLevel(cls: HeroClass, stat: string, level: number): number {
  const base  = (cls.baseStats  as unknown as Record<string, number | undefined>)[stat] ?? 0
  const gain  = (cls.statGains  as unknown as Record<string, number | undefined>)[stat] ?? 0
  return base + (level - 1) * gain
}

// ─── Gear stat model ─────────────────────────────────────────────────────────
//
// Formula (mirrors lootGenerator.applyMaterialToStats):
//   final_stat = base_template.stats[stat] * material.statMultiplier * rarity.statMultiplierBase
//
// Rarity + material multipliers imported live from real source files.
// Per-slot base stat averages inlined from src/data/items/bases/*/*.ts
// (mean across ALL templates in that slot including zeros — 6 slots total:
//  weapon, armor, helmet, boots, accessory1, accessory2)
//
//  attack     [wep:7.56, arm:0, helm:0, boots:0, acc:0.75, acc:0.75]
//    weapon: (sword10+axe12+mace11+bow9+dagger6+staff8+wand5+book3+instrument4)/9=7.56
//    accessory: talisman(3)/4 templates = 0.75
//  magicPower [wep:3.78, arm:1.25, helm:1.20, boots:0, acc:0.75, acc:0.75]
//    weapon: (staff5+book12+wand7+instrument10)/9=3.78
//    armor: robe(5)/4 templates=1.25  helmet: wizardhat(6)/5=1.20  acc: talisman(3)/4=0.75
//  wisdom     [wep:0.89, arm:0, helm:1.60, boots:0, acc:0, acc:0]
//    weapon: book(8)/9=0.89  helmet: (wizardhat4+wreath4)/5=1.60
//  speed      [wep:0, arm:0, helm:0, boots:3.0, acc:0, acc:0]
//    boots: (boots3+sandals5+greaves1)/3=3.0
//  luck       [wep:0, arm:0, helm:0, boots:0, acc:1.5, acc:1.5]
//    accessory: (charm4+ring2)/4=1.5

// Best-in-slot base stats per slot (what a well-geared player has at a zone boss).
// Uses max base stat value for each slot+stat combo, not averages.
//   weapon   : axe(atk=12), mace(def=2), book(mp=12,wis=8)
//   armor    : plate(def=15,hp=20), robe(mp=5)
//   helmet   : helmet(def=5,hp=5), wizardhat(mp=6,wis=4)
//   boots    : sandals(spd=5), greaves(def=5,hp=5)
//   acc×2    : talisman(atk=3,mp=3), charm(luck=4), amulet(def=3,hp=5)
const BASE_STAT_SLOTS: Record<string, number[]> = {
  //                    weapon  armor  helmet boots  acc1   acc2
  attack:             [ 12,    0,     0,     0,     3,     3    ],
  magicPower:         [ 12,    5,     6,     0,     3,     3    ],
  wisdom:             [ 8,     0,     4,     0,     0,     0    ],
  speed:              [ 0,     0,     0,     5,     0,     0    ],
  luck:               [ 0,     0,     0,     0,     4,     4    ],
  charisma:           [ 0,     0,     0,     0,     0,     0    ],
  defense:            [ 2,     15,    5,     5,     3,     3    ],
  maxHp:              [ 0,     20,    5,     5,     5,     5    ],
}

const EXCLUDED_RARITIES = new Set<string>(GAME_CONFIG.loot.excludedFromLoot)

/** Sorted (ascending minFloor) list of droppable rarities */
const DROPPABLE_RARITIES: ItemRarity[] = (
  Object.entries(RARITY_CONFIGS) as [ItemRarity, { minFloor: number }][]
)
  .filter(([r]) => !EXCLUDED_RARITIES.has(r))
  .sort(([, a], [, b]) => a.minFloor - b.minFloor)
  .map(([r]) => r)

/** Best available rarity at a floor: highest tier unlocked (zone boss fight = best gear equipped) */
function typicalRarityAtFloor(floor: number): ItemRarity {
  const available = DROPPABLE_RARITIES.filter(r => RARITY_CONFIGS[r].minFloor <= floor)
  return available[available.length - 1] ?? 'common'
}

/** Max material statMultiplier available for a rarity tier (falls back to adjacent tiers if empty) */
function avgMaterialMul(rarity: ItemRarity): number {
  const mats: Material[] = (MATERIALS_BY_RARITY as Record<string, Material[]>)[rarity] ?? []
  if (mats.length === 0) {
    const idx = DROPPABLE_RARITIES.indexOf(rarity)
    for (let i = idx - 1; i >= 0; i--) {
      const fb = (MATERIALS_BY_RARITY as Record<string, Material[]>)[DROPPABLE_RARITIES[i]] ?? []
      if (fb.length) return Math.max(...fb.map(m => m.statMultiplier))
    }
    return 1.0
  }
  return Math.max(...mats.map(m => m.statMultiplier))
}

/** Total typical gear bonus for a given stat at a given floor (all 6 slots combined) */
function gearStatBonus(stat: string, floor: number): number {
  const slots       = BASE_STAT_SLOTS[stat] ?? []
  const rarity      = typicalRarityAtFloor(floor)
  const rarityMul   = RARITY_CONFIGS[rarity].statMultiplierBase
  const materialMul = avgMaterialMul(rarity)
  return slots.reduce((total, base) => total + Math.floor(base * materialMul * rarityMul), 0)
}

// ─── Ability-damage helpers ───────────────────────────────────────────────────

function isDamageAbility(ability: Ability): boolean {
  const e = ability.effect
  return (e.type === 'damage' || e.type === 'special') && e.targeting?.side === 'enemy'
}

/** Effective damage per use: direct hit + full DoT over its duration, pre-defense */
function rawTotalDamage(ability: Ability, cls: HeroClass, floor: number, level: number): number {
  const e = ability.effect

  // Direct hit
  const mainStat    = e.scaling?.stat
  const mainStatVal = mainStat ? heroStatAtLevel(cls, mainStat, level) + gearStatBonus(mainStat, floor) : 0
  const rawHit      = e.value + (e.scaling ? Math.round(mainStatVal * e.scaling.ratio) : 0)

  // DoT (summed over the full duration)
  const dot         = e.dot
  let dotTotal      = 0
  if (dot) {
    const dotStat    = dot.scaling?.stat
    const dotStatVal = dotStat ? heroStatAtLevel(cls, dotStat, level) + gearStatBonus(dotStat, floor) : 0
    const dotPerTurn = dot.damage + (dot.scaling ? Math.floor(dotStatVal * dot.scaling.ratio) : 0)
    dotTotal         = dotPerTurn * dot.duration
  }

  return rawHit + dotTotal
}

/** DPT against zone boss at this floor/level */
function dpt(ability: Ability, cls: HeroClass, floor: number, level: number): number {
  const raw     = rawTotalDamage(ability, cls, floor, level)
  const danger  = applyEarlyScaling(calcDanger(floor), floor)
  const bossDef = scaledStat(tb.bossStats.zoneBoss.baseDefense, danger, tb.bossScaling.defense)
  const block   = calculateBlockPercent(bossDef)
  return (raw * (1 - block)) / Math.max(1, ability.cooldown)
}

// ─── Milestones ───────────────────────────────────────────────────────────────

const MILESTONES = [
  { label: 'F1/L1',    floor:   1, level:  1 },
  { label: 'F10/L3',   floor:  10, level:  3 },
  { label: 'F20/L5',   floor:  20, level:  5 },
  { label: 'F40/L9',   floor:  40, level:  9 },
  { label: 'F60/L13',  floor:  60, level: 13 },
  { label: 'F80/L17',  floor:  80, level: 17 },
  { label: 'F100/L20', floor: 100, level: 20 },
] as const

// ─── Run analysis ─────────────────────────────────────────────────────────────

const CLASSES: HeroClass[] = [
  WARRIOR, MAGE, ROGUE, CLERIC, RANGER, PALADIN, NECROMANCER, DRUID, SHAMAN, BARD,
]

interface AbilityRow {
  name: string
  cooldown: number
  dpts: number[]
}

interface ClassBlock {
  name: string
  rows: AbilityRow[]
}

const blocks: ClassBlock[] = CLASSES.map(cls => ({
  name: cls.name,
  rows: cls.abilities
    .filter(isDamageAbility)
    .map(ab => ({
      name:     ab.name,
      cooldown: ab.cooldown,
      dpts:     MILESTONES.map(m => dpt(ab, cls, m.floor, m.level)),
    })),
}))

// ─── Print per-class detail ───────────────────────────────────────────────────

const COL_W = 10
const LABEL_W = 22
const CD_W = 4

const header = [
  'Ability'.padEnd(LABEL_W),
  'Cd'.padStart(CD_W),
  ...MILESTONES.map(m => m.label.padStart(COL_W)),
].join(' | ')

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log('  ABILITY BALANCE ANALYSIS — DPT vs Zone Boss (post-defense, per turn)')
console.log('══════════════════════════════════════════════════════════════════════\n')

// ─── Combat model helpers ────────────────────────────────────────────────────

/** Base hero HP (class formula, no gear) */
function heroBaseHp(cls: HeroClass, level: number): number {
  const cfg = GAME_CONFIG.hero
  return cfg.baseHp + (level * cfg.hpPerLevel) + (cls.baseStats.defense * cfg.hpPerDefense)
}

/** Total hero HP including gear maxHp bonus */
function heroTotalHp(cls: HeroClass, floor: number, level: number): number {
  return heroBaseHp(cls, level) + gearStatBonus('maxHp', floor)
}

/** Total hero defense including gear */
function heroTotalDefense(cls: HeroClass, floor: number, level: number): number {
  const base = heroStatAtLevel(cls, 'defense', level)
  return base + gearStatBonus('defense', floor)
}

/** Zone boss HP at a given floor */
function bossHp(floor: number): number {
  const danger = applyEarlyScaling(calcDanger(floor), floor)
  return scaledStat(tb.bossStats.zoneBoss.baseHp, danger, tb.bossScaling.hp)
}

/** Zone boss attack damage vs a hero (after hero DR) */
function bossDamageToHero(cls: HeroClass, floor: number, level: number): number {
  const danger    = applyEarlyScaling(calcDanger(floor), floor)
  const bossAtk   = scaledStat(tb.bossStats.zoneBoss.baseAttack, danger, tb.bossScaling.attack)
  const heroDef   = heroTotalDefense(cls, floor, level)
  const heroBlock = calculateBlockPercent(heroDef)
  return Math.max(1, Math.round(bossAtk * (1 - heroBlock)))
}

// Print gear model assumptions per milestone
console.log('  Gear model (real rarity+material+base data):')
for (const m of MILESTONES) {
  const r   = typicalRarityAtFloor(m.floor)
  const rc  = RARITY_CONFIGS[r]
  const mm  = avgMaterialMul(r)
  const atkGear = gearStatBonus('attack', m.floor)
  const mpGear  = gearStatBonus('magicPower', m.floor)
  const hpGear  = gearStatBonus('maxHp', m.floor)
  const defGear = gearStatBonus('defense', m.floor)
  console.log(`    ${m.label.padEnd(10)} rarity=${r.padEnd(12)} statMul=${rc.statMultiplierBase.toFixed(1)}  matMul=${mm.toFixed(2)}  gear[atk]=${atkGear}  gear[mp]=${mpGear}  gear[def]=${defGear}  gear[hp]=${hpGear}`)
}
console.log()

// Print combat model: survivability vs boss
console.log('══════════════════════════════════════════════════════════════════════')
console.log('  COMBAT MODEL — Hero survivability vs Zone Boss')
console.log('══════════════════════════════════════════════════════════════════════')
console.log('  (Warrior ref for HP/def/atk; TTD = boss hits to kill warrior; TTK = best-class DPT vs boss HP)\n')

const cmHeader = [
  'Floor'.padEnd(10),
  'Boss HP'.padStart(9),
  'BossAtk'.padStart(8),
  'Hero HP'.padStart(8),
  'HeroDef'.padStart(8),
  'DR%'.padStart(6),
  'Dmg/hit'.padStart(8),
  'TTD'.padStart(5),
  'HeroAtk'.padStart(8),
  'HeroMP'.padStart(7),
  'TTK'.padStart(5),
].join(' | ')
console.log('  ' + cmHeader)
console.log('  ' + '─'.repeat(cmHeader.length))

for (const m of MILESTONES) {
  const mi        = MILESTONES.indexOf(m)
  const danger    = applyEarlyScaling(calcDanger(m.floor), m.floor)
  const bossAtk   = scaledStat(tb.bossStats.zoneBoss.baseAttack, danger, tb.bossScaling.attack)
  const bHP       = bossHp(m.floor)
  const hHP       = heroTotalHp(WARRIOR, m.floor, m.level)
  const hDef      = heroTotalDefense(WARRIOR, m.floor, m.level)
  const dr        = calculateBlockPercent(hDef)
  const dmgPerHit = bossDamageToHero(WARRIOR, m.floor, m.level)
  const ttd       = hHP / dmgPerHit
  const hAtk      = heroStatAtLevel(WARRIOR, 'attack', m.level) + gearStatBonus('attack', m.floor)
  const hMp       = heroStatAtLevel(WARRIOR, 'magicPower', m.level) + gearStatBonus('magicPower', m.floor)
  const bestDpt   = Math.max(...blocks.flatMap(b => b.rows.map(r => r.dpts[mi])), 0.01)
  const ttk       = bHP / bestDpt
  const line = [
    m.label.padEnd(10),
    bHP.toFixed(0).padStart(9),
    bossAtk.toFixed(0).padStart(8),
    hHP.toFixed(0).padStart(8),
    hDef.toFixed(0).padStart(8),
    ((dr * 100).toFixed(1) + '%').padStart(6),
    dmgPerHit.toFixed(0).padStart(8),
    ttd.toFixed(1).padStart(5),
    hAtk.toFixed(0).padStart(8),
    hMp.toFixed(0).padStart(7),
    ttk.toFixed(0).padStart(5),
  ].join(' | ')
  console.log('  ' + line)
}
console.log()

for (const cls of blocks) {
  console.log(`── ${cls.name} ${'─'.repeat(Math.max(0, 68 - cls.name.length - 4))}`)
  if (cls.rows.length === 0) {
    console.log('   (no damage abilities)\n')
    continue
  }
  console.log('  ' + header)
  console.log('  ' + '─'.repeat(header.length))
  for (const row of cls.rows) {
    const line = [
      row.name.padEnd(LABEL_W),
      String(row.cooldown).padStart(CD_W),
      ...row.dpts.map(v => v.toFixed(1).padStart(COL_W)),
    ].join(' | ')
    console.log('  ' + line)
  }
  console.log()
}

// ─── DPT Summary: best ability per class ─────────────────────────────────────

console.log('══════════════════════════════════════════════════════════════════════')
console.log('  DPT SUMMARY — best damage ability per class')
console.log('══════════════════════════════════════════════════════════════════════\n')

const summaryHeader = [
  'Class'.padEnd(14),
  'Best Ability'.padEnd(LABEL_W),
  ...MILESTONES.map(m => m.label.padStart(COL_W)),
].join(' | ')

console.log('  ' + summaryHeader)
console.log('  ' + '─'.repeat(summaryHeader.length))

interface BestEntry { className: string; row: AbilityRow | null }
const best: BestEntry[] = blocks.map(cls => {
  const row = cls.rows.reduce<AbilityRow | null>((b, r) => {
    const rMax = Math.max(...r.dpts)
    return b === null || rMax > Math.max(...b.dpts) ? r : b
  }, null)
  return { className: cls.name, row }
})

for (const { className, row } of best) {
  if (!row) {
    console.log('  ' + [className.padEnd(14), '—'.padEnd(LABEL_W), '(none)'].join(' | '))
    continue
  }
  const line = [
    className.padEnd(14),
    row.name.padEnd(LABEL_W),
    ...row.dpts.map(v => v.toFixed(1).padStart(COL_W)),
  ].join(' | ')
  console.log('  ' + line)
}

// ─── Flags ────────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log('  FLAGS')
console.log('══════════════════════════════════════════════════════════════════════\n')

const issues: string[] = []

// Per-ability scaling dominance (L1 → L20 growth > 20×) and undertuned scaling (< 2×)
for (const cls of blocks) {
  for (const row of cls.rows) {
    const first = row.dpts[0]
    const last  = row.dpts[row.dpts.length - 1]
    const ratio = last / Math.max(first, 0.01)
    if (ratio > 20) {
      issues.push(`SCALING_DOMINANCE  ${cls.name} / ${row.name}: DPT grows ${ratio.toFixed(0)}× from L1→L20 (stat scaling overwhelms base)`)
    }
    if (ratio < 2.0 && last > 1) {
      issues.push(`SCALING_UNDERTUNED ${cls.name} / ${row.name}: DPT only grows ${ratio.toFixed(1)}× from L1→L20 (stat scaling may be too low)`)
    }
    if (last < 5) {
      issues.push(`UNDERPERFORMING    ${cls.name} / ${row.name}: endgame DPT ${last.toFixed(1)} (very low at max level)`)
    }
  }
}

// Cross-class median check at each milestone
for (let i = 0; i < MILESTONES.length; i++) {
  const m = MILESTONES[i]
  const pts = best
    .filter(e => e.row !== null)
    .map(e => ({ className: e.className, dpt: e.row!.dpts[i] }))
    .sort((a, b) => a.dpt - b.dpt)

  if (pts.length === 0) continue
  const median = pts[Math.floor(pts.length / 2)].dpt

  for (const { className, dpt: d } of pts) {
    if (d < median * 0.5) {
      issues.push(`DPT_UNDERPERFORMING ${className} at ${m.label}: ${d.toFixed(1)} < 50% of median ${median.toFixed(1)}`)
    }
    if (d > median * 2.0) {
      issues.push(`DPT_OVERTUNED       ${className} at ${m.label}: ${d.toFixed(1)} > 200% of median ${median.toFixed(1)}`)
    }
  }
}

if (issues.length === 0) {
  console.log('  No issues found.\n')
} else {
  console.log(`  Total issues: ${issues.length}\n`)
  for (const issue of issues) console.log('  ' + issue)
  console.log()
}
