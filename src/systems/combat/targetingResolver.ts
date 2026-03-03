/**
 * Ability Targeting Resolver
 *
 * Resolves a TargetingSpec into a concrete list of Hero targets
 * and a flag indicating whether the boss is being targeted.
 */

import type { Hero, TargetingSpec, TargetPriorityStat, Stats } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'

export interface ResolvedTargets {
  /** Heroes to apply the effect to (empty when targeting the boss) */
  heroes: Hero[]
  /** True when the ability targets the enemy (boss) */
  targetsBoss: boolean
}

/**
 * Read a numeric value off a hero for priority comparisons.
 */
function getStatValue(hero: Hero, stat: TargetPriorityStat): number {
  if (stat === 'currentHp') return hero.stats.hp
  if (stat === 'hpPercent') {
    const maxHp = calculateTotalStats(hero).maxHp
    return maxHp > 0 ? hero.stats.hp / maxHp : 0
  }
  const totals = calculateTotalStats(hero)
  if (stat === 'maxHp') return totals.maxHp
  return (totals[stat as keyof Stats] as number) || 0
}

/**
 * Resolve a TargetingSpec into concrete targets.
 *
 * @param targeting - The spec describing who to hit
 * @param caster    - The hero performing the ability
 * @param party     - Full party array (may contain nulls for empty slots)
 */
export function resolveAbilityTargets(
  targeting: TargetingSpec,
  caster: Hero,
  party: (Hero | null)[]
): ResolvedTargets {
  const {
    side,
    breadth,
    priority = 'random',
    priorityStat = 'currentHp',
    position = 'any',
    includesSelf = false,
  } = targeting

  // ── Enemy / Boss targeting ────────────────────────────────────────────────
  if (side === 'enemy') {
    return { heroes: [], targetsBoss: true }
  }

  // ── Self targeting ────────────────────────────────────────────────────────
  if (side === 'self') {
    return { heroes: [caster], targetsBoss: false }
  }

  // ── Build alive-hero candidate pool ──────────────────────────────────────
  let candidates = party.filter((h): h is Hero => h !== null && h.isAlive)

  // Position filter (uses Hero.position set at combat init)
  if (position === 'frontline') {
    const front = candidates.filter(h => h.position === 'frontline')
    if (front.length > 0) candidates = front
  } else if (position === 'backline') {
    const back = candidates.filter(h => h.position === 'backline')
    if (back.length > 0) candidates = back
  }

  // Side filter ──────────────────────────────────────────────────────────────
  // 'party'  → all alive (including caster)
  // 'ally'   → exclude caster, unless includesSelf=true
  if (side === 'ally' && !includesSelf) {
    const others = candidates.filter(h => h.id !== caster.id)
    candidates = others.length > 0 ? others : [caster] // fallback to self if alone
  }

  if (candidates.length === 0) return { heroes: [], targetsBoss: false }

  // ── Breadth: 'all' → return entire pool ──────────────────────────────────
  if (breadth === 'all') {
    return { heroes: candidates, targetsBoss: false }
  }

  // ── Breadth: 'single' → pick one using priority ───────────────────────────
  let chosen: Hero

  switch (priority) {
    case 'lowest':
      chosen = candidates.reduce((best, h) =>
        getStatValue(h, priorityStat) < getStatValue(best, priorityStat) ? h : best
      )
      break

    case 'highest':
      chosen = candidates.reduce((best, h) =>
        getStatValue(h, priorityStat) > getStatValue(best, priorityStat) ? h : best
      )
      break

    case 'first':
      chosen = candidates.reduce((best, h) => {
        const hIdx = party.findIndex(p => p?.id === h.id)
        const bestIdx = party.findIndex(p => p?.id === best.id)
        return hIdx < bestIdx ? h : best
      })
      break

    case 'last':
      chosen = candidates.reduce((best, h) => {
        const hIdx = party.findIndex(p => p?.id === h.id)
        const bestIdx = party.findIndex(p => p?.id === best.id)
        return hIdx > bestIdx ? h : best
      })
      break

    case 'random':
    default:
      chosen = candidates[Math.floor(Math.random() * candidates.length)]
      break
  }

  return { heroes: [chosen], targetsBoss: false }
}
