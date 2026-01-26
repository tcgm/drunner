import type { Hero, EventOutcome, Item } from '@/types'
import { GAME_CONFIG } from '@/config/game'

export interface ResolvedOutcome {
  text: string
  effects: ResolvedEffect[]
}

export interface ResolvedEffect {
  type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status' | 'revive'
  target: string[] // Hero IDs affected
  value?: number
  item?: Item
  description: string
}

/**
 * Scale a value based on dungeon depth
 */
function scaleValue(baseValue: number, depth: number, scalingFactor: number = 0.1): number {
  return Math.floor(baseValue * (1 + (depth - 1) * scalingFactor))
}

/**
 * Apply event outcome effects to the party
 */
export function resolveEventOutcome(
  outcome: EventOutcome,
  party: Hero[],
  dungeon: { gold: number; depth: number }
): {
  updatedParty: Hero[]
  updatedGold: number
  resolvedOutcome: ResolvedOutcome
} {
  const updatedParty = party.map(h => ({ 
    ...h, 
    stats: { ...h.stats },
    equipment: { ...h.equipment },
    abilities: h.abilities.map(a => ({ ...a }))
  }))
  let updatedGold = dungeon.gold
  const resolvedEffects: ResolvedEffect[] = []
  const depth = dungeon.depth

  for (const effect of outcome.effects) {
    const targets = selectTargets(effect.target || 'all', updatedParty)
    
    switch (effect.type) {
      case 'damage': {
        const baseDamage = effect.value || 0
        const damage = scaleValue(baseDamage, depth, 0.1) // 10% per depth
        targets.forEach(hero => {
          const actualDamage = Math.max(1, damage - Math.floor(hero.stats.defense / 2))
          hero.stats.hp = Math.max(0, hero.stats.hp - actualDamage)
          if (hero.stats.hp === 0) {
            hero.isAlive = false
          }
        })
        resolvedEffects.push({
          type: 'damage',
          target: targets.map(h => h.id),
          value: damage,
          description: `${targets.map(h => h.name).join(', ')} took ${damage} damage`
        })
        break
      }
      
      case 'heal': {
        const baseHealing = effect.value || 0
        const healing = scaleValue(baseHealing, depth, 0.08) // 8% per depth (slightly less than damage)
        targets.forEach(hero => {
          hero.stats.hp = Math.min(hero.stats.maxHp, hero.stats.hp + healing)
        })
        resolvedEffects.push({
          type: 'heal',
          target: targets.map(h => h.id),
          value: healing,
          description: `${targets.map(h => h.name).join(', ')} restored ${healing} HP`
        })
        break
      }
      
      case 'xp': {
        const baseXp = effect.value || 0
        const xp = scaleValue(baseXp, depth, 0.15) // 15% per depth (rewards scale faster)
        targets.forEach(hero => {
          hero.xp += xp
          // Check for level up
          while (hero.xp >= hero.level * 100 && hero.level < GAME_CONFIG.levelUp.maxLevel) {
            hero.level++
            hero.xp -= (hero.level - 1) * 100
            // Increase stats on level up
            hero.stats.attack += GAME_CONFIG.statGains.attack
            hero.stats.defense += GAME_CONFIG.statGains.defense
            hero.stats.speed += GAME_CONFIG.statGains.speed
            hero.stats.luck += GAME_CONFIG.statGains.luck
            hero.stats.maxHp += GAME_CONFIG.statGains.maxHp
            if (GAME_CONFIG.levelUp.healToFull) {
              hero.stats.hp = hero.stats.maxHp
            }
          }
        })
        resolvedEffects.push({
          type: 'xp',
          target: targets.map(h => h.id),
          value: xp,
          description: `${targets.map(h => h.name).join(', ')} gained ${xp} XP`
        })
        break
      }
      
      case 'gold': {
        const baseGold = effect.value || 0
        const gold = scaleValue(baseGold, depth, 0.15) // 15% per depth (rewards scale faster)
        updatedGold += gold
        resolvedEffects.push({
          type: 'gold',
          target: [],
          value: gold,
          description: `Found ${gold} gold`
        })
        break
      }
      
      case 'item': {
        // Item handling - for now just log it
        // Will implement proper inventory/equipment system later
        if (effect.item) {
          resolvedEffects.push({
            type: 'item',
            target: [],
            item: effect.item,
            description: `Found ${effect.item.name}`
          })
        }
        break
      }
      
      case 'status': {
        // Status effects - placeholder for now
        resolvedEffects.push({
          type: 'status',
          target: targets.map(h => h.id),
          description: 'Status effect applied'
        })
        break
      }
      
      case 'revive': {
        // Revive dead heroes
        const deadHeroes = updatedParty.filter(h => !h.isAlive)
        const toRevive = effect.target === 'all' 
          ? deadHeroes 
          : deadHeroes.length > 0 
            ? [deadHeroes[Math.floor(Math.random() * deadHeroes.length)]]
            : []
        
        const healAmount = effect.value || 0
        const scaledHeal = scaleValue(healAmount, depth, 0.08)
        
        toRevive.forEach(hero => {
          hero.isAlive = true
          hero.stats.hp = scaledHeal > 0 ? Math.min(hero.stats.maxHp, scaledHeal) : Math.floor(hero.stats.maxHp * 0.5) // Default 50% HP if no value specified
        })
        
        if (toRevive.length > 0) {
          resolvedEffects.push({
            type: 'revive',
            target: toRevive.map(h => h.id),
            value: scaledHeal,
            description: `${toRevive.map(h => h.name).join(', ')} revived with ${toRevive[0].stats.hp} HP`
          })
        }
        break
      }
    }
  }

  return {
    updatedParty,
    updatedGold,
    resolvedOutcome: {
      text: outcome.text,
      effects: resolvedEffects
    }
  }
}

/**
 * Select target heroes based on targeting rule
 */
function selectTargets(
  targeting: 'random' | 'all' | 'weakest' | 'strongest' | undefined,
  party: Hero[]
): Hero[] {
  const aliveHeroes = party.filter(h => h.isAlive)
  
  if (aliveHeroes.length === 0) {
    return []
  }
  
  switch (targeting) {
    case 'random':
      return [aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)]]
    
    case 'weakest':
      return [aliveHeroes.reduce((weakest, hero) => 
        hero.stats.hp < weakest.stats.hp ? hero : weakest
      )]
    
    case 'strongest':
      return [aliveHeroes.reduce((strongest, hero) => 
        hero.stats.hp > strongest.stats.hp ? hero : strongest
      )]
    
    case 'all':
    default:
      return aliveHeroes
  }
}

/**
 * Check if a choice's requirements are met by the party
 */
export function checkRequirements(
  requirements: {
    class?: string
    stat?: string
    minValue?: number
    item?: string
    gold?: number
  } | undefined,
  party: Hero[],
  depth: number = 1,
  gold: number = 0
): boolean {
  if (!requirements) {
    return true
  }
  
  if (requirements.class) {
    const hasClass = party.some(h => h.isAlive && h.class.id.toLowerCase() === requirements.class!.toLowerCase())
    if (!hasClass) return false
  }
  
  if (requirements.stat && requirements.minValue !== undefined) {
    // Scale stat requirements with depth (5% per depth, slower than damage scaling)
    const scaledMinValue = scaleValue(requirements.minValue, depth, 0.05)
    const hasStat = party.some(h => {
      if (!h.isAlive) return false
      const statValue = h.stats[requirements.stat as keyof typeof h.stats]
      return typeof statValue === 'number' && statValue >= scaledMinValue
    })
    if (!hasStat) return false
  }
  
  if (requirements.gold !== undefined) {
    // Scale gold requirements with depth (same as rewards - 15% per depth)
    const scaledGold = scaleValue(requirements.gold, depth, 0.15)
    if (gold < scaledGold) return false
  }
  
  if (requirements.item) {
    // Item check - placeholder for now
    // Will implement when inventory system is complete
    return false
  }
  
  return true
}
