import type { Hero, EventOutcome, Item, Material, BaseTemplate, EventChoice, ItemRarity, ItemSlot } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { generateItem } from '@/systems/loot/lootGenerator'
import { upgradeItemRarity, findLowestRarityItem } from '@/systems/loot/itemUpgrader'
import { v4 as uuidv4 } from 'uuid'

export interface ResolvedOutcome {
  text: string
  effects: ResolvedEffect[]
  items: Item[] // Items that should be added to inventory
}

export interface ResolvedEffect {
  type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status' | 'revive' | 'upgradeItem'
  target: string[] // Hero IDs affected
  value?: number
  originalValue?: number // For damage: the pre-defense value
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
    const baseChance = choice.successChance || GAME_CONFIG.chances.defaultSuccess
    let finalChance = baseChance
    
    // Apply stat modifier if specified
    if (choice.statModifier) {
      const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
      if (aliveHeroes.length > 0) {
        // Use the highest stat value among alive heroes (not average)
        const maxStat = Math.max(...aliveHeroes.map(h => h.stats[choice.statModifier!] || 0))
        // Each point in the stat adds to success chance (capped at max)
        finalChance = Math.min(
          GAME_CONFIG.chances.maxSuccess, 
          Math.max(
            GAME_CONFIG.chances.minSuccess,
            baseChance + (maxStat * GAME_CONFIG.chances.statBonusPerPoint)
          )
        )
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
  itemType?: 'random' | ItemSlot
  uniqueItem?: string | Omit<Item, 'id'>
  material?: string | Material
  baseTemplate?: string | BaseTemplate
  minRarity?: ItemRarity
  maxRarity?: ItemRarity
  rarityBoost?: number
  itemChoices?: Array<{ weight: number; itemType?: 'random' | ItemSlot; minRarity?: ItemRarity; maxRarity?: ItemRarity; rarityBoost?: number }>
}, depth: number): Item | null {
  // Handle weighted item choices
  if ('itemChoices' in spec && Array.isArray(spec.itemChoices)) {
    const choice = selectWeightedChoice(spec.itemChoices)
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
  dungeon: { gold: number; depth: number; floor: number }
): {
  updatedParty: (Hero | null)[]
  updatedGold: number
  metaXpGained: number
  xpMentored: number
  resolvedOutcome: ResolvedOutcome
} {
  const updatedParty = party.map(h => h ? ({ 
    ...h, 
    stats: { ...h.stats },
    equipment: { ...h.equipment },
    abilities: h.abilities.map(a => ({ ...a }))
  }) : null)
  let updatedGold = dungeon.gold
  let metaXpGained = 0
  let xpMentored = 0
  const resolvedEffects: ResolvedEffect[] = []
  const foundItems: Item[] = []
  const depth = dungeon.floor // Use floor for difficulty scaling, not total events

  for (const effect of outcome.effects) {
    const targets = selectTargets(effect.target || 'all', updatedParty)
    
    switch (effect.type) {
      case 'damage': {
        const baseDamage = effect.value || 0
        const scaledDamage = scaleValue(baseDamage, depth, GAME_CONFIG.scaling.damage)
        const damage = Math.floor(scaledDamage * GAME_CONFIG.multipliers.damage)
        
        // Calculate actual damage for each hero and create individual effects
        targets.forEach(hero => {
          const actualDamage = Math.max(1, damage - Math.floor(hero.stats.defense * GAME_CONFIG.combat.defenseReduction))
          hero.stats.hp = Math.max(0, hero.stats.hp - actualDamage)
          if (hero.stats.hp === 0) {
            hero.isAlive = false
          }
          
          // Create individual effect for each hero showing actual vs original damage
          resolvedEffects.push({
            type: 'damage',
            target: [hero.id],
            value: actualDamage,
            originalValue: damage,
            description: `${hero.name} took ${actualDamage} (${damage}) damage`
          })
        })
        break
      }
      
      case 'heal': {
        const baseHealing = effect.value || 0
        const scaledHealing = scaleValue(baseHealing, depth, GAME_CONFIG.scaling.healing)
        const healing = Math.floor(scaledHealing * GAME_CONFIG.multipliers.healing)
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
        const scaledXp = scaleValue(baseXp, depth, 0.15) // 15% per depth (rewards scale faster)
        const xp = Math.floor(scaledXp * GAME_CONFIG.multipliers.xp)
        let totalOverflowXp = 0
        
        // First, capture any existing overflow XP from max-level heroes
        updatedParty.forEach(hero => {
          if (hero && hero.level >= GAME_CONFIG.levelUp.maxLevel && hero.xp > 0) {
            const maxXpForLevel = hero.level * 100
            if (hero.xp > maxXpForLevel) {
              totalOverflowXp += (hero.xp - maxXpForLevel)
              hero.xp = maxXpForLevel
            }
          }
        })
        
        targets.forEach(hero => {
          const xpToGain = xp
          
          // If hero is already max level, fill bar first, then overflow
          if (hero.level >= GAME_CONFIG.levelUp.maxLevel) {
            const maxXpForLevel = hero.level * 100
            const spaceRemaining = maxXpForLevel - hero.xp
            
            if (spaceRemaining > 0) {
              // Fill the bar first
              const xpToApply = Math.min(xpToGain, spaceRemaining)
              hero.xp += xpToApply
              const overflow = xpToGain - xpToApply
              if (overflow > 0) {
                totalOverflowXp += overflow
              }
            } else {
              // Bar already full, all XP overflows
              totalOverflowXp += xpToGain
            }
          } else {
            hero.xp += xpToGain
            
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
            
            // After level-ups, check if hero is at max level with remaining XP
            if (hero.level >= GAME_CONFIG.levelUp.maxLevel && hero.xp > 0) {
              const maxXpForLevel = hero.level * 100
              if (hero.xp > maxXpForLevel) {
                totalOverflowXp += (hero.xp - maxXpForLevel)
                hero.xp = maxXpForLevel
              }
            }
          }
        })
        
        // Mentor System: Distribute overflow to lower-level party members
        if (totalOverflowXp > 0) {
          const lowerLevelHeroes = updatedParty.filter(
            (h): h is Hero => h !== null && h.isAlive && h.level < GAME_CONFIG.levelUp.maxLevel
          )
          
          if (lowerLevelHeroes.length > 0) {
            // Distribute 50% of overflow evenly to lower level heroes
            const mentorXpPerHero = Math.floor((totalOverflowXp * 0.5) / lowerLevelHeroes.length)
            const mentorXpDistributed = mentorXpPerHero * lowerLevelHeroes.length
            
            // Track mentored XP
            xpMentored += mentorXpDistributed
            
            lowerLevelHeroes.forEach(hero => {
              hero.xp += mentorXpPerHero
              
              // Check for level up from mentored XP
              while (hero.xp >= hero.level * 100 && hero.level < GAME_CONFIG.levelUp.maxLevel) {
                hero.level++
                hero.xp -= (hero.level - 1) * 100
                hero.stats.attack += GAME_CONFIG.statGains.attack
                hero.stats.defense += GAME_CONFIG.statGains.defense
                hero.stats.speed += GAME_CONFIG.statGains.speed
                hero.stats.luck += GAME_CONFIG.statGains.luck
                hero.stats.maxHp += GAME_CONFIG.statGains.maxHp
                if (GAME_CONFIG.levelUp.healToFull) {
                  hero.stats.hp = hero.stats.maxHp
                }
              }
              
              // After mentored level-ups, check if hero hit max level with remaining XP
              if (hero.level >= GAME_CONFIG.levelUp.maxLevel && hero.xp > 0) {
                const maxXpForLevel = hero.level * 100
                if (hero.xp > maxXpForLevel) {
                  totalOverflowXp += (hero.xp - maxXpForLevel)
                  hero.xp = maxXpForLevel
                }
              }
            })
            
            // Remaining overflow goes to meta XP
            totalOverflowXp -= mentorXpDistributed
          }
        }
        
        // Add remaining overflow to meta XP pool
        if (totalOverflowXp > 0) {
          metaXpGained += totalOverflowXp
        }
        
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
        const scaledGold = scaleValue(baseGold, depth, 0.15) // 15% per depth (rewards scale faster)
        const gold = Math.floor(scaledGold * GAME_CONFIG.multipliers.gold)
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
        const deadHeroes = updatedParty.filter((h): h is Hero => h !== null && !h.isAlive)
        const toRevive = effect.target === 'all' 
          ? deadHeroes 
          : deadHeroes.length > 0 
            ? [deadHeroes[Math.floor(Math.random() * deadHeroes.length)]]
            : []
        
        const healAmount = effect.value || 0
        const scaledHeal = scaleValue(healAmount, depth, 0.08)
        
        toRevive.forEach(hero => {
          if (hero) {
            hero.isAlive = true
            hero.stats.hp = scaledHeal > 0 ? Math.min(hero.stats.maxHp, scaledHeal) : Math.floor(hero.stats.maxHp * GAME_CONFIG.combat.defaultHealPercent) // Default heal if no value specified
          }
        })
        
        if (toRevive.length > 0) {
          const firstHero = toRevive[0]
          if (firstHero) {
            resolvedEffects.push({
              type: 'revive',
              target: toRevive.map(h => h.id),
              value: scaledHeal,
              description: `${toRevive.map(h => h.name).join(', ')} revived with ${firstHero.stats.hp} HP`
            })
          }
        }
        break
      }
      
      case 'upgradeItem': {
        // Upgrade an equipped item to the next rarity tier
        // Find a hero with equipped items, prioritizing lowest rarity
        const aliveHeroes = updatedParty.filter((h): h is Hero => h !== null && h.isAlive)
        
        if (aliveHeroes.length === 0) {
          resolvedEffects.push({
            type: 'upgradeItem',
            target: [],
            description: 'No heroes available to upgrade equipment'
          })
          break
        }
        
        // Find the lowest rarity item across all heroes
        let lowestItemData: { hero: Hero; item: Item; slot: string } | null = null
        let lowestRarityIndex = 999
        
        const rarityOrder: ItemRarity[] = ['junk', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
        
        for (const hero of aliveHeroes) {
          if (hero) {
            const itemData = findLowestRarityItem(hero)
            if (itemData) {
              const rarityIndex = rarityOrder.indexOf(itemData.item.rarity)
              if (rarityIndex !== -1 && rarityIndex < lowestRarityIndex) {
                lowestRarityIndex = rarityIndex
                lowestItemData = { hero, ...itemData }
              }
            }
          }
        }
        
        if (!lowestItemData) {
          resolvedEffects.push({
            type: 'upgradeItem',
            target: [],
            description: 'No equipment available to upgrade'
          })
          break
        }
        
        const { hero, item, slot } = lowestItemData
        const rarityBoost = effect.rarityBoost || 0
        const upgradedItem = upgradeItemRarity(item, depth, rarityBoost)
        
        if (!upgradedItem) {
          resolvedEffects.push({
            type: 'upgradeItem',
            target: [hero.id],
            description: `${hero.name}'s ${item.name} is already at maximum rarity`
          })
          break
        }
        
        // Replace the old item with the upgraded one
        hero.equipment[slot as keyof typeof hero.equipment] = upgradedItem
        
        resolvedEffects.push({
          type: 'upgradeItem',
          target: [hero.id],
          item: upgradedItem,
          description: `${hero.name}'s ${item.name} was upgraded to ${upgradedItem.name}!`
        })
        break
      }
    }
  }

  return {
    updatedParty,
    updatedGold,
    metaXpGained,
    xpMentored,
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
    // Scale stat requirements with depth (15% per depth to match stat growth)
    const scaledMinValue = scaleValue(requirements.minValue, depth, GAME_CONFIG.scaling.statRequirements)
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
