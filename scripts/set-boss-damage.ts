#!/usr/bin/env tsx
/**
 * set-boss-damage.ts
 *
 * Calculates and optionally rewrites boss event damage values so that
 * scripted (non-combat) outcomes deal a sensible, configurable fraction
 * of hero HP after defense scaling is applied.
 *
 * All game constants (defense curve, hero HP formula, floor scaling factor,
 * hero stat gain, etc.) are read directly from the real game config files.
 * The boss event list is also imported from the real game data.
 *
 * Usage:
 *   npm run set-boss-damage              # dry-run: print table only
 *   npm run set-boss-damage:write        # write changes to source files
 *   npm run set-boss-damage -- --intro   # intro bosses only
 *   npm run set-boss-damage -- --normal  # normal (non-zone, non-final) bosses only
 *
 * ─── HOW THE MATH WORKS ──────────────────────────────────────────────────────
 *
 *  1. Floor scaling  (eventResolver.ts → scaleValue):
 *       scaledBase = baseValue × (1 + (floor − 1) × floorBossDamageScaling)
 *
 *  2. Defense reduction (defenseConfig.ts → calculateBlockPercent):
 *       Uses the real exported function — no formula duplication.
 *
 *  3. Net damage:
 *       netDmg = scaledBase × (1 − blockPct)
 *
 *  Solving for baseValue given a target net damage:
 *       baseValue = netTarget / (floorScaleMultiplier × (1 − blockPct))
 *
 * ─── TUNABLE TIER CONFIG ─────────────────────────────────────────────────────
 *  This is intentionally the only hardcoded section — it expresses design
 *  intent about how dangerous each tier of boss should feel.
 *
 *  targetNetHpPct     – fraction of a hero's max HP dealt AFTER defense.
 *  targetGearDefense  – typical gear-only defense at that tier.
 *                       Base stat defense is estimated automatically from
 *                       GAME_CONFIG.hero.statGainPerLevel and level projection.
 *  nonAllDmgMultiplier – scale factor for non-'all' targets (random / strongest
 *                        etc.); lower because fewer heroes are hit per cast.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GAME_CONFIG } from '../src/config/gameConfig'
import { DEFENSE_CONFIG, calculateBlockPercent } from '../src/config/defenseConfig'
import type { DungeonEvent } from '../src/types'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const _require = createRequire(import.meta.url)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─────────────────────────────────────────────────────────────────────────────
// TUNABLE TIER CONFIG  (edit these to shape the feel of each tier)
// ─────────────────────────────────────────────────────────────────────────────
interface Tier {
  label: string
  minFloor: number
  maxFloor: number
  /** Fraction of hero max HP dealt as net damage after defense */
  targetNetHpPct: number
  /**
   * Typical gear-only defense as a FRACTION of DEFENSE_CONFIG.maxDefense.
   * e.g. 0.27 = 27% of maxDefense. Resolved to raw defense at runtime so it
   * automatically adjusts when maxDefense is recalculated.
   */
  gearDefensePct: number
  /** Multiplier for single-target ('random', 'strongest', etc.) vs 'all' choices */
  nonAllDmgMultiplier: number
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOST MULTIPLIERS for special boss types (applied on top of tier targetNetHpPct)
// ─────────────────────────────────────────────────────────────────────────────
const ZONE_BOSS_BOOST  = 2.0   // zone bosses deal 2× the tier net HP target
const FINAL_BOSS_BOOST = 3.5   // final boss deals 3.5× the tier net HP target

const TIERS: Tier[] = [
  { label: 'F1-9',   minFloor:  1, maxFloor:  9, targetNetHpPct: 0.15, gearDefensePct: 0.000, nonAllDmgMultiplier: 0.75 },
  { label: 'F10-19', minFloor: 10, maxFloor: 19, targetNetHpPct: 0.18, gearDefensePct: 0.005, nonAllDmgMultiplier: 0.75 },
  { label: 'F20-29', minFloor: 20, maxFloor: 29, targetNetHpPct: 0.21, gearDefensePct: 0.015, nonAllDmgMultiplier: 0.75 },
  { label: 'F30-39', minFloor: 30, maxFloor: 39, targetNetHpPct: 0.24, gearDefensePct: 0.035, nonAllDmgMultiplier: 0.75 },
  { label: 'F40-49', minFloor: 40, maxFloor: 49, targetNetHpPct: 0.28, gearDefensePct: 0.070, nonAllDmgMultiplier: 0.75 },
  { label: 'F50-59', minFloor: 50, maxFloor: 59, targetNetHpPct: 0.32, gearDefensePct: 0.130, nonAllDmgMultiplier: 0.75 },
  { label: 'F60-69', minFloor: 60, maxFloor: 69, targetNetHpPct: 0.37, gearDefensePct: 0.230, nonAllDmgMultiplier: 0.75 },
  { label: 'F70-79', minFloor: 70, maxFloor: 79, targetNetHpPct: 0.42, gearDefensePct: 0.380, nonAllDmgMultiplier: 0.75 },
  { label: 'F80-89', minFloor: 80, maxFloor: 89, targetNetHpPct: 0.47, gearDefensePct: 0.620, nonAllDmgMultiplier: 0.75 },
  { label: 'F90-99', minFloor: 90, maxFloor: 99, targetNetHpPct: 0.52, gearDefensePct: 1.000, nonAllDmgMultiplier: 0.75 },
]

// ─────────────────────────────────────────────────────────────────────────────
// MATH — all constants pulled from game data
// ─────────────────────────────────────────────────────────────────────────────

const FLOOR_BOSS_SCALING = GAME_CONFIG.scaling.floorBossDamage
const BASE_HP            = GAME_CONFIG.hero.baseHp
const HP_PER_LEVEL       = GAME_CONFIG.hero.hpPerLevel
const STAT_PER_LEVEL     = GAME_CONFIG.hero.statGainPerLevel
const MAX_LEVEL          = GAME_CONFIG.levelUp.maxLevel
const MAX_FLOORS         = GAME_CONFIG.dungeon.maxFloors

/** Approximate hero level for a given floor (capped at maxLevel) */
function heroLevelAtFloor(floor: number): number {
  // Model: heroes gain a level every ~5 floors, starting at 1
  return Math.min(MAX_LEVEL, 1 + Math.floor(floor / 5))
}

function heroMaxHp(level: number): number {
  return BASE_HP + (level - 1) * HP_PER_LEVEL
}

/**
 * Approximate total defense at a floor:
 * stat-based (25% of stat gain goes to defense) + gear resolved from % of maxDefense
 */
function typicalDefenseAtFloor(floor: number, gearDefensePct: number): number {
  const level = heroLevelAtFloor(floor)
  const statDefense = (level - 1) * STAT_PER_LEVEL * 0.25
  const gearDefense = gearDefensePct * DEFENSE_CONFIG.maxDefense
  return Math.round(statDefense + gearDefense)
}

function floorScaleMultiplier(floor: number): number {
  return 1 + (floor - 1) * FLOOR_BOSS_SCALING
}

function tierForFloor(floor: number): Tier {
  return TIERS.find(t => floor >= t.minFloor && floor <= t.maxFloor) ?? TIERS[TIERS.length - 1]
}

/**
 * Return the baseValue to write for a given floor and target net HP fraction.
 * Uses the real calculateBlockPercent from defenseConfig.ts.
 */
function calcBaseValue(floor: number, targetNetHpPct: number, gearDefensePct: number): number {
  const level     = heroLevelAtFloor(floor)
  const hp        = heroMaxHp(level)
  const defense   = typicalDefenseAtFloor(floor, gearDefensePct)
  const block     = calculateBlockPercent(defense)
  const scale     = floorScaleMultiplier(floor)
  const netTarget = targetNetHpPct * hp
  return Math.round(netTarget / (scale * (1 - block)))
}

// Targets that spread damage to the whole party
const ALL_TARGETS  = ['all']
// Targets aimed at a single hero
const SINGLE_TARGETS = ['random', 'strongest', 'weakest', 'fastest']

// ─────────────────────────────────────────────────────────────────────────────
// FILE PARSING / REWRITING
// Rewriting still operates on source text because we need to produce valid TS.
// ─────────────────────────────────────────────────────────────────────────────

interface DamageHit {
  index: number
  fullMatch: string
  value: number
  target: string
}

function parseDamageEffects(src: string): DamageHit[] {
  const hits: DamageHit[] = []
  // Match single-line damage effect objects { type: 'damage', ..., value: N, ... }
  const re = /\{[^}]*type:\s*'damage'[^}]*\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const chunk = m[0]
    const valMatch = chunk.match(/value:\s*(\d+)/)
    const tgtMatch = chunk.match(/target:\s*'([^']+)'/)
    if (valMatch) {
      hits.push({
        index:     m.index,
        fullMatch: m[0],
        value:     parseInt(valMatch[1], 10),
        target:    tgtMatch ? tgtMatch[1] : 'all',
      })
    }
  }
  return hits
}

interface Change { old: number; new: number; target: string }

function rewriteDamageValues(src: string, allBase: number, singleBase: number): { newSrc: string; changes: Change[] } {
  const effects = parseDamageEffects(src)
  const changes: Change[] = []
  let newSrc = src

  // Work backwards so string indices stay valid
  for (let i = effects.length - 1; i >= 0; i--) {
    const eff = effects[i]
    if (eff.value === 0) continue  // intentional zero (success / dodge) — leave alone

    const proposed = ALL_TARGETS.includes(eff.target) ? allBase : singleBase
    if (proposed === eff.value) continue

    const newChunk = eff.fullMatch.replace(/value:\s*\d+/, `value: ${proposed}`)
    newSrc = newSrc.slice(0, eff.index) + newChunk + newSrc.slice(eff.index + eff.fullMatch.length)
    changes.push({ old: eff.value, new: proposed, target: eff.target })
  }
  return { newSrc, changes }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAD ALL BOSS FILES
// Uses createRequire so tsx's patched loader handles .ts files directly.
// Bypasses index.ts (which uses import.meta.glob, a Vite-only API).
// ─────────────────────────────────────────────────────────────────────────────

interface BossData {
  idToFile: Map<string, string>
  events: DungeonEvent[]
}

function loadBossFiles(): BossData {
  const dirs = [
    path.join(ROOT, 'src/data/events/boss/normal'),
    path.join(ROOT, 'src/data/events/boss/intro'),
    path.join(ROOT, 'src/data/events/boss/zone'),
  ]
  const idToFile = new Map<string, string>()
  const events: DungeonEvent[] = []

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.ts') || f === 'index.ts') continue
      const filePath = path.join(dir, f)
      const mod = _require(filePath) as Record<string, unknown>
      for (const exp of Object.values(mod)) {
        if (
          exp !== null &&
          typeof exp === 'object' &&
          'id' in exp &&
          'type' in exp &&
          (exp as DungeonEvent).type === 'boss'
        ) {
          const event = exp as DungeonEvent
          idToFile.set(event.id, filePath)
          events.push(event)
        }
      }
    }
  }
  return { idToFile, events }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

const args       = process.argv.slice(2)
const doWrite    = args.includes('--write')
const introOnly  = args.includes('--intro')
const normalOnly = args.includes('--normal')

const { idToFile, events: ALL_BOSS_EVENTS } = loadBossFiles()

type BossKind = 'intro' | 'normal' | 'zone' | 'final'

interface Row {
  kind:       BossKind
  file:       string
  title:      string
  floor:      number
  label:      string
  allBase:    number
  singleBase: number
  /** Floor scale multiplier at this floor: 1 + (floor-1) * floorBossDamageScaling */
  scale:      number
  /** allBase × scale (before defense) */
  scaledAll:  number
  /** Net damage (all targets) after floor scaling + estimated defense */
  netDmgAll:  number
  /** netDmgAll as fraction of typical hero HP at this floor */
  netHpPct:   number
  changes:    Change[]
}

function computeRow(event: DungeonEvent, kind: BossKind): Row | null {
  const floor    = event.depth ?? 100
  const filePath = idToFile.get(event.id)
  if (!filePath) { console.warn(`  ⚠  No source file for event id: ${event.id}`); return null }

  const tier   = tierForFloor(floor)
  const boost  = kind === 'final' ? FINAL_BOSS_BOOST : kind === 'zone' ? ZONE_BOSS_BOOST : 1.0
  const allBase    = calcBaseValue(floor, tier.targetNetHpPct * boost, tier.gearDefensePct)
  const singleBase = calcBaseValue(floor, tier.targetNetHpPct * boost * tier.nonAllDmgMultiplier, tier.gearDefensePct)

  // Simulate: what net damage does allBase actually deal once scaled + blocked?
  const defense   = typicalDefenseAtFloor(floor, tier.gearDefensePct)
  const block     = calculateBlockPercent(defense)
  const scale     = floorScaleMultiplier(floor)
  const netDmgAll = Math.round(allBase * scale * (1 - block))
  const hp        = heroMaxHp(heroLevelAtFloor(floor))
  const netHpPct  = netDmgAll / hp

  const scaledAll = Math.round(allBase * scale)

  const src = fs.readFileSync(filePath, 'utf8')
  const { newSrc, changes } = rewriteDamageValues(src, allBase, singleBase)
  const label = changes.length > 0 ? (doWrite ? 'WRITE' : 'CHANGE') : 'ok'

  if (doWrite && changes.length > 0) fs.writeFileSync(filePath, newSrc, 'utf8')

  return {
    kind, floor, label, allBase, singleBase, scale, scaledAll, netDmgAll, netHpPct, changes,
    file:  path.relative(ROOT, filePath),
    title: (Array.isArray(event.title) ? event.title[0] : event.title).slice(0, 28),
  }
}

// ─── Tier config summary ───────────────────────────────────────────────────
console.log('\n═══ Tier Configuration (from game data) ══════════════════════════════════════════')
console.log(`Defense curve: ${DEFENSE_CONFIG.curveType}  maxDefense: ${DEFENSE_CONFIG.maxDefense}  midpointRatio: ${DEFENSE_CONFIG.midpointDefenseRatio}`)
console.log(`Floor boss damage scaling: ${FLOOR_BOSS_SCALING}  Hero maxLevel: ${MAX_LEVEL}  maxFloors: ${MAX_FLOORS}`)
console.log(`Zone boss boost: ${ZONE_BOSS_BOOST}×   Final boss boost: ${FINAL_BOSS_BOOST}×`)
console.log()
console.log('Tier      Floors    TargetHP  GearDef%  EstDef  Block%  ScaleMin ScaleMid ScaleMax  AllBase SingBase')
for (const t of TIERS) {
  const mid     = Math.round((t.minFloor + t.maxFloor) / 2)
  const def     = typicalDefenseAtFloor(mid, t.gearDefensePct)
  const blk     = (calculateBlockPercent(def) * 100).toFixed(1)
  const all     = calcBaseValue(mid, t.targetNetHpPct, t.gearDefensePct)
  const sing    = calcBaseValue(mid, t.targetNetHpPct * t.nonAllDmgMultiplier, t.gearDefensePct)
  const sMin    = floorScaleMultiplier(t.minFloor).toFixed(1)
  const sMid    = floorScaleMultiplier(mid).toFixed(1)
  const sMax    = floorScaleMultiplier(t.maxFloor).toFixed(1)
  console.log(
    `${t.label.padEnd(10)} ${String(t.minFloor).padStart(2)}-${String(t.maxFloor).padEnd(2)}` +
    `     ${(t.targetNetHpPct * 100).toFixed(0).padStart(4)}%` +
    `     ${(t.gearDefensePct * 100).toFixed(1).padStart(5)}%  ${String(def).padStart(6)}` +
    `  ${blk.padStart(5)}%  ${(sMin + 'x').padStart(8)} ${(sMid + 'x').padStart(8)} ${(sMax + 'x').padStart(8)}` +
    `  ${String(all).padStart(7)} ${String(sing).padStart(8)}`
  )
}
console.log()

// ─── Process all bosses into typed rows ────────────────────────────────────
const introRows:  Row[] = []
const normalRows: Row[] = []
const zoneRows:   Row[] = []
const finalRows:  Row[] = []

for (const event of ALL_BOSS_EVENTS.sort((a, b) => (a.depth ?? 100) - (b.depth ?? 100))) {
  let kind: BossKind
  if      (event.isFinalBoss) kind = 'final'
  else if (event.isZoneBoss)  kind = 'zone'
  else if (event.isIntroBoss) kind = 'intro'
  else                         kind = 'normal'

  if (introOnly  && kind !== 'intro')  continue
  if (normalOnly && kind !== 'normal') continue

  const row = computeRow(event, kind)
  if (!row) continue
  if      (kind === 'final')  finalRows.push(row)
  else if (kind === 'zone')   zoneRows.push(row)
  else if (kind === 'intro')  introRows.push(row)
  else                        normalRows.push(row)
}

const allRows   = [...introRows, ...normalRows, ...zoneRows, ...finalRows]
const written   = allRows.filter(r => r.label === 'WRITE').length
const needChange = allRows.filter(r => r.label !== 'ok').length

// ─── Console output helpers ────────────────────────────────────────────────
const COL_HDR = 'File'.padEnd(50) + 'Title'.padEnd(30) + 'Fl'.padStart(3) +
  '  Status'.padEnd(9) + 'AllBase'.padStart(8) + ' SingBase' +
  ' Scale×'.padStart(8) + ' Scaled'.padStart(8) + ' NetDmg'.padStart(8) + ' NetHP%'.padStart(8)
const COL_SEP = '─'.repeat(138)

function printRows(rows: Row[]): void {
  console.log(COL_HDR)
  console.log(COL_SEP)
  for (const r of rows) {
    const changeStr = r.changes.length
      ? r.changes.slice(0, 3).map(c => `${c.old}->${c.new}(${c.target})`).join(', ')
      : ''
    console.log(
      r.file.slice(-50).padEnd(50) +
      r.title.padEnd(30) +
      String(r.floor).padStart(3) +
      `  ${r.label}`.padEnd(9) +
      String(r.allBase).padStart(8) +
      `  ${String(r.singleBase).padStart(7)}` +
      `${r.scale.toFixed(1)}×`.padStart(8) +
      String(r.scaledAll).padStart(8) +
      String(r.netDmgAll).padStart(8) +
      `${(r.netHpPct * 100).toFixed(1)}%`.padStart(8) +
      (changeStr ? `   [${changeStr}]` : '')
    )
  }
  console.log()
}

if (introRows.length)  { console.log('─── Intro Bosses ─────────────────────────────────────────────────────────────────────────────────────────────────────────────');  printRows(introRows)  }
if (normalRows.length) { console.log('─── Normal Bosses ────────────────────────────────────────────────────────────────────────────────────────────────────────────'); printRows(normalRows) }
if (zoneRows.length)   { console.log(`─── Zone Bosses (${ZONE_BOSS_BOOST}× boost) ──────────────────────────────────────────────────────────────────────────────────────────────`);  printRows(zoneRows)   }
if (finalRows.length)  { console.log(`─── Final Boss (${FINAL_BOSS_BOOST}× boost) ──────────────────────────────────────────────────────────────────────────────────────────────`);  printRows(finalRows)  }

console.log(`${allRows.length} bosses total (${needChange} need changes).`)
if (!doWrite) {
  console.log('Dry run — no files written. Re-run with --write to apply changes.')
} else {
  console.log(`${written} files updated.`)
}

// ─── Write markdown report ─────────────────────────────────────────────────
const rl: string[] = []
const now  = new Date().toISOString().replace('T', ' ').slice(0, 19)
const mode = doWrite ? 'WRITE' : 'DRY RUN'

rl.push(`# Boss Damage Report`)
rl.push(``)
rl.push(`Generated: ${now}  |  Mode: **${mode}**`)
rl.push(``)
rl.push(`## Config`)
rl.push(``)
rl.push(`| Setting | Value |`)
rl.push(`|---------|-------|`)
rl.push(`| Defense curve | ${DEFENSE_CONFIG.curveType} |`)
rl.push(`| maxDefense | ${DEFENSE_CONFIG.maxDefense} |`)
rl.push(`| midpointDefenseRatio | ${DEFENSE_CONFIG.midpointDefenseRatio} |`)
rl.push(`| floorBossDamageScaling | ${FLOOR_BOSS_SCALING} |`)
rl.push(`| Hero maxLevel | ${MAX_LEVEL} |`)
rl.push(`| maxFloors | ${MAX_FLOORS} |`)
rl.push(`| Zone boss boost | ${ZONE_BOSS_BOOST}× |`)
rl.push(`| Final boss boost | ${FINAL_BOSS_BOOST}× |`)
rl.push(``)
rl.push(`## Tiers`)
rl.push(``)
rl.push(`| Tier | Floors | TargetHP% | GearDef% | GearRaw | EstDef | Block% | Scale@Min | Scale@Mid | Scale@Max | AllBase | SingBase |`)
rl.push(`|------|--------|-----------|----------|---------|--------|--------|-----------|-----------|-----------|---------|----------|`)
for (const t of TIERS) {
  const mid     = Math.round((t.minFloor + t.maxFloor) / 2)
  const gearRaw = Math.round(t.gearDefensePct * DEFENSE_CONFIG.maxDefense)
  const def     = typicalDefenseAtFloor(mid, t.gearDefensePct)
  const blk     = (calculateBlockPercent(def) * 100).toFixed(1)
  const all     = calcBaseValue(mid, t.targetNetHpPct, t.gearDefensePct)
  const sing    = calcBaseValue(mid, t.targetNetHpPct * t.nonAllDmgMultiplier, t.gearDefensePct)
  const sMin    = floorScaleMultiplier(t.minFloor).toFixed(1)
  const sMid    = floorScaleMultiplier(mid).toFixed(1)
  const sMax    = floorScaleMultiplier(t.maxFloor).toFixed(1)
  rl.push(`| ${t.label} | ${t.minFloor}-${t.maxFloor} | ${(t.targetNetHpPct * 100).toFixed(0)}% | ${(t.gearDefensePct * 100).toFixed(1)}% | ${gearRaw} | ${def} | ${blk}% | ${sMin}× | ${sMid}× | ${sMax}× | ${all} | ${sing} |`)
}
rl.push(``)

function reportSection(title: string, rows: Row[], boost = 1.0): void {
  if (!rows.length) return
  rl.push(`## ${title}`)
  rl.push(boost > 1 ? `> Boost: **${boost}×** applied on top of tier targetNetHpPct` : '')
  rl.push(``)
  rl.push(`| File | Title | Floor | Status | AllBase | SingBase | Scale× | Scaled | NetDmg | NetHP% | Changes |`)
  rl.push(`|------|-------|-------|--------|---------|----------|--------|--------|--------|--------|---------|`)
  for (const r of rows) {
    const changeStr = r.changes.map(c => `${c.old}→${c.new}(${c.target})`).join(', ')
    rl.push(`| ${r.file.replace(/\\/g, '/')} | ${r.title} | ${r.floor} | ${r.label} | ${r.allBase} | ${r.singleBase} | ${r.scale.toFixed(1)}× | ${r.scaledAll} | ${r.netDmgAll} | ${(r.netHpPct * 100).toFixed(1)}% | ${changeStr} |`)
  }
  rl.push(``)
}

reportSection('Intro Bosses (floors 1-9)', introRows)
reportSection('Normal Floor Bosses', normalRows)
reportSection(`Zone Bosses (${ZONE_BOSS_BOOST}× boost)`, zoneRows, ZONE_BOSS_BOOST)
reportSection(`Final Boss (${FINAL_BOSS_BOOST}× boost)`, finalRows, FINAL_BOSS_BOOST)

rl.push(`---`)
rl.push(`**${allRows.length}** bosses total — **${needChange}** needed changes${doWrite ? ` — **${written}** files updated` : ''}.`)
rl.push(``)

const reportPath = path.join(ROOT, 'scripts', 'boss-damage-report.md')
fs.writeFileSync(reportPath, rl.join('\n'), 'utf8')
console.log(`Report written -> scripts/boss-damage-report.md`)
