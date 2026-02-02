import type { Hero, TimedEffect, Stats } from '@/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Apply a timed effect to a hero
 */
export function applyEffect(hero: Hero, effect: Omit<TimedEffect, 'id' | 'appliedAtDepth' | 'expiresAtDepth'>, currentDepth: number): Hero {
  const timedEffect: TimedEffect = {
    ...effect,
    id: uuidv4(),
    appliedAtDepth: currentDepth,
    expiresAtDepth: effect.isPermanent ? 999999 : currentDepth + effect.duration,
  }

  return {
    ...hero,
    activeEffects: [...(hero.activeEffects || []), timedEffect],
  }
}

/**
 * Remove an effect from a hero by ID
 */
export function removeEffect(hero: Hero, effectId: string): Hero {
  return {
    ...hero,
    activeEffects: (hero.activeEffects || []).filter((e) => e.id !== effectId),
  }
}

/**
 * Remove all expired effects from a hero based on current depth
 */
export function removeExpiredEffects(hero: Hero, currentDepth: number): Hero {
  return {
    ...hero,
    activeEffects: (hero.activeEffects || []).filter(
      (effect) => effect.isPermanent || effect.expiresAtDepth > currentDepth
    ),
  }
}

/**
 * Calculate the total stat modifiers from all active effects
 */
export function calculateEffectModifiers(hero: Hero): Partial<Stats> {
  const modifiers: Partial<Stats> = {}

  for (const effect of (hero.activeEffects || [])) {
    if (effect.stat && effect.modifier) {
      modifiers[effect.stat] = (modifiers[effect.stat] || 0) + effect.modifier
    }
  }

  return modifiers
}

/**
 * Apply effect modifiers to hero stats (returns modified stats, doesn't mutate hero)
 */
export function applyEffectModifiersToStats(hero: Hero): Stats {
  const baseStats = { ...hero.stats }
  const modifiers = calculateEffectModifiers(hero)

  return {
    ...baseStats,
    attack: baseStats.attack + (modifiers.attack || 0),
    defense: baseStats.defense + (modifiers.defense || 0),
    speed: baseStats.speed + (modifiers.speed || 0),
    luck: baseStats.luck + (modifiers.luck || 0),
    maxHp: baseStats.maxHp + (modifiers.maxHp || 0),
    // HP is not affected by modifiers directly
    magicPower: baseStats.magicPower ? baseStats.magicPower + (modifiers.magicPower || 0) : undefined,
  }
}

/**
 * Get all active buffs on a hero
 */
export function getActiveBuffs(hero: Hero): TimedEffect[] {
  return hero.activeEffects.filter((e) => e.type === 'buff')
}

/**
 * Get all active debuffs on a hero
 */
export function getActiveDebuffs(hero: Hero): TimedEffect[] {
  return hero.activeEffects.filter((e) => e.type === 'debuff')
}

/**
 * Get all active status effects on a hero
 */
export function getActiveStatusEffects(hero: Hero): TimedEffect[] {
  return hero.activeEffects.filter((e) => e.type === 'status')
}

/**
 * Check if hero has a specific effect by name
 */
export function hasEffect(hero: Hero, effectName: string): boolean {
  return hero.activeEffects.some((e) => e.name === effectName)
}

/**
 * Update all heroes' effects when progressing (depth increment)
 */
export function tickEffectsForDepthProgression(heroes: (Hero | null)[], newDepth: number): (Hero | null)[] {
  return heroes.map((hero) => {
    if (!hero) return null
    return removeExpiredEffects(hero, newDepth)
  })
}
