import type { Hero, EventOutcome, Item, Material, BaseTemplate, EventChoice, ItemRarity } from '@/types'
import { GAME_CONFIG } from '@/config/game'
import { generateItem } from '@/systems/loot/lootGenerator'
import { v4 as uuidv4 } from 'uuid'

export interface ResolvedOutcome {
  text: string
  effects: ResolvedEffect[]
  items: Item[] // Items that should be added to inventory
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
 * Select weighted choice from array
 */
function selectWeightedChoice<T extends { weight: number }>(choices: T[]): T {
  const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0)
  let roll = Math.random() * totalWeight
  
  for (const choice of choices) {
    roll -= choice.weight
    if (roll <= 0) {
      return choice
    }
  }
  
  return choices[choices.length - 1] // Fallback to last choice
}

/**
 * Resolve which outcome should occur based on choice configuration
 * Handles: single outcome, weighted outcomes, and success/failure checks
 */
export function resolveChoiceOutcome(
  choice: EventChoice,
  party: (Hero | null)[]
): EventOutcome {
  // Success/Failure check (skill check)
  if (choice.successOutcome && choice.failureOutcome) {
    const baseChance = choice.successChance || 0.5
    let finalChance = baseChance
    
    // Apply stat modifier if specified
    if (choice.statModifier) {
      const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
      if (aliveHeroes.length > 0) {
        // Use the average stat value of all alive heroes
        const avgStat = aliveHeroes.reduce((sum, h) => sum + (h.stats[choice.statModifier!] || 0), 0) / aliveHeroes.length
        // Each point in the stat adds 2% to success chance (capped at 95%)
        finalChance = Math.min(0.95, baseChance + (avgStat * 0.02))
      }
    }
    
    const roll = Math.random()
    return roll < finalChance ? choice.successOutcome : choice.failureOutcome
  }
  
  // Weighted random outcomes
  if (choice.possibleOutcomes && choice.possibleOutcomes.length > 0) {
    const selected = selectWeightedChoice(choice.possibleOutcomes)
    return selected.outcome
  }
  
  // Single guaranteed outcome (original behavior)
  if (choice.outcome) {
    return choice.outcome
  }
  
  // Fallback - should not happen if events are properly configured
  return {
    text: 'Nothing happens.',
    effects: []
  }
}

/**
 * Generate item from specification with literal imports support
 */
function generateItemFromSpec(spec: {
  itemType?: 'random' | any
  uniqueItem?: string | Omit<Item, 'id'>
  material?: string | Material
  baseTemplate?: string | BaseTemplate
  minRarity?: ItemRarity
  maxRarity?: ItemRarity
  rarityBoost?: number
}, depth: number): Item | null {
  // Handle weighted item choices
  if ('itemChoices' in spec && Array.isArray(spec.itemChoices)) {
    const choice = selectWeightedChoice(spec.itemChoices as any[])
    return generateItemFromSpec(choice, depth)
  }

  // Handle literal unique item import
  if (spec.uniqueItem && typeof spec.uniqueItem === 'object') {
    return {
      ...spec.uniqueItem,
      id: uuidv4(),
    }
  }

  // For all other cases, use the centralized generateItem function
  // This ensures consistent name generation, repair logic, and alkahest fallback
  if (spec.itemType) {
    return generateItem(
      depth, 
      spec.itemType === 'random' ? undefined : spec.itemType,
      spec.minRarity,
      spec.maxRarity,
      spec.rarityBoost || 0
    )
  }

  // Default case: generate random item
  return generateItem(depth, undefined, spec.minRarity, spec.maxRarity, spec.rarityBoost || 0)
}

/**
 * Apply event outcome effects to the party
 */
export function resolveEventOutcome(
  outcome: EventOutcome,
  party: (Hero | null)[],
  dungeon: { gold: number; depth: number }
): {
  updatedParty: (Hero | null)[]
  updatedGold: number
  resolvedOutcome: ResolvedOutcome
} {
  const updatedParty = party.map(h => h ? ({ 
    ...h, 
    stats: { ...h.stats },
    equipment: { ...h.equipment },
    abilities: h.abilities.map(a => ({ ...a }))
  }) : null)
  let updatedGold = dungeon.gold
  const resolvedEffects: ResolvedEffect[] = []
  const foundItems: Item[] = []
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
          description: gold >= 0 ? `Found ${gold} gold` : `-${Math.abs(gold)} gold lost`
        })
        break
      }
      
      case 'item': {
        // Item handling - generate items based on specifications
        let generatedItem: Item | null = null
        
        if (effect.item) {
          // Backward compatibility: use pre-generated item
          generatedItem = effect.item
        } else if (effect.itemChoices) {
          // Handle weighted item choices
          const choice = selectWeightedChoice(effect.itemChoices)
          generatedItem = generateItemFromSpec(choice, depth)
        } else {
          // Handle single item specification
          generatedItem = generateItemFromSpec(effect, depth)
        }
        
        if (generatedItem) {
          foundItems.push(generatedItem)
          resolvedEffects.push({
            type: 'item',
            target: [],
            item: generatedItem,
            description: `Found ${generatedItem.name}`
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
      effects: resolvedEffects,
      items: foundItems
    }
  }
}

/**
 * Select target heroes based on targeting rule
 */
function selectTargets(
  targeting: 'random' | 'all' | 'weakest' | 'strongest' | undefined,
  party: (Hero | null)[]
): Hero[] {
  const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
  
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
  party: (Hero | null)[],
  depth: number = 1,
  gold: number = 0
): boolean {
  if (!requirements) {
    return true
  }
  
  if (requirements.class) {
    const hasClass = party.some(h => h !== null && h.isAlive && h.class.id.toLowerCase() === requirements.class!.toLowerCase())
    if (!hasClass) return false
  }
  
  if (requirements.stat && requirements.minValue !== undefined) {
    // Scale stat requirements with depth (5% per depth, slower than damage scaling)
    const scaledMinValue = scaleValue(requirements.minValue, depth, 0.05)
    const hasStat = party.some(h => {
      if (!h || !h.isAlive) return false
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
