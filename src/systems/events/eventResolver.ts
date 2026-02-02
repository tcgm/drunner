import type { Hero, EventOutcome, Item, Material, BaseTemplate, EventChoice, ItemRarity, ItemSlot, Consumable } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { generateItem } from '@/systems/loot/lootGenerator'
import { upgradeItemRarity, findLowestRarityItem } from '@/systems/loot/itemUpgrader'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { getConsumableById } from '@/data/consumables'
import { getMaterialById } from '@/data/items/materials'
import { applyDefenseReduction } from '@/utils/defenseUtils'
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
  damageBreakdown?: { 
    heroId: string
    heroName: string
    damage: number
    originalDamage: number
    isCrit?: boolean
    isDodge?: boolean
  }[] // For grouped damage effects with crit/dodge info
}

/**
 * Format a list of names with proper grammar (e.g., "A, B, and C")
 */
function formatNameList(names: string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

/**
 * Scale a value based on dungeon floor
 */
function scaleValue(baseValue: number, floor: number, scalingFactor: number = 0.1): number {
  return Math.floor(baseValue * (1 + (floor - 1) * scalingFactor))
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
 * Select text from string or weighted text variations
 */
function selectText(text: string | Array<{ weight: number; text: string }>): string {
  if (typeof text === 'string') {
    return text
  }
  return selectWeightedChoice(text).text
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
  modifiers?: string[]
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

  // Handle string reference - try to look up by name in set items
  if (spec.uniqueItem && typeof spec.uniqueItem === 'string') {
    const matchedItem = ALL_SET_ITEMS.find(item => 
      item.name.toLowerCase() === spec.uniqueItem.toLowerCase()
    )
    if (matchedItem) {
      return {
        ...matchedItem,
        id: uuidv4(),
      }
    }
    // If no match found, log warning and fall through to normal generation
    console.warn(`[Item Generation] uniqueItem string "${spec.uniqueItem}" not found in set items catalog. Generating random item instead.`)
  }

  // For all other cases, use the centralized generateItem function
  // This ensures consistent name generation, repair logic, and alkahest fallback
  if (spec.itemType || spec.material || spec.baseTemplate) {
    // If both material and baseTemplate are provided, we need to handle it specially
    // by generating with the baseTemplate and then forcing the material
    if (spec.baseTemplate && spec.material) {
      const item = generateItem(
        depth, 
        spec.itemType === 'random' ? undefined : spec.itemType,
        spec.minRarity,
        spec.maxRarity,
        spec.rarityBoost || 0,
        spec.baseTemplate,
        spec.modifiers || []
      )
      
      // If material was also specified, override it
      if (item) {
        const materialObj = typeof spec.material === 'string' 
          ? getMaterialById(spec.material) 
          : spec.material
        
        if (materialObj) {
          item.materialId = materialObj.id
          const baseTemplate = spec.baseTemplate as BaseTemplate
          
          // Generate proper name using material prefix
          const materialPrefix = materialObj.prefix || materialObj.name
          if ('baseNames' in baseTemplate && baseTemplate.baseNames && baseTemplate.baseNames.length > 0) {
            const randomName = baseTemplate.baseNames[Math.floor(Math.random() * baseTemplate.baseNames.length)]
            item.name = `${materialPrefix} ${randomName}`
          } else {
            // Fallback to description parsing or type name
            const description = (baseTemplate.description || '').toLowerCase()
            if (description.includes('chainmail') || description.includes('interlocking') || description.includes('metal rings')) {
              item.name = `${materialPrefix} Chainmail`
            } else if (description.includes('plate')) {
              item.name = `${materialPrefix} Plate Armor`
            } else {
              item.name = `${materialPrefix} ${baseTemplate.type.charAt(0).toUpperCase() + baseTemplate.type.slice(1)}`
            }
          }
          
          // Recalculate stats with the specified material
          item.attack = Math.floor((baseTemplate.stats.attack || 0) * materialObj.statMultiplier)
          item.defense = Math.floor((baseTemplate.stats.defense || 0) * materialObj.statMultiplier)
          item.speed = Math.floor((baseTemplate.stats.speed || 0) * materialObj.statMultiplier)
          item.luck = Math.floor((baseTemplate.stats.luck || 0) * materialObj.statMultiplier)
          item.maxHp = Math.floor((baseTemplate.stats.maxHp || 0) * materialObj.statMultiplier)
          item.value = Math.floor((baseTemplate.baseValue || 0) * materialObj.valueMultiplier)
        }
      }
      
      return item
    }
    
    // Standard case: pass whichever is provided
    return generateItem(
      depth, 
      spec.itemType === 'random' ? undefined : spec.itemType,
      spec.minRarity,
      spec.maxRarity,
      spec.rarityBoost || 0,
      spec.material || spec.baseTemplate,
      spec.modifiers || []
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
  dungeon: { gold: number; depth: number; floor: number },
  currentEvent?: { type: string; isZoneBoss?: boolean; isFinalBoss?: boolean } | null
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
  const floor = dungeon.floor // Use floor for difficulty scaling, not total events
  let goldCostThisOutcome = 0 // Track gold spent in this outcome for potential refunds

  // Determine damage scaling based on event type
  const isBoss = currentEvent?.type === 'boss'
  const isZoneBoss = currentEvent?.isZoneBoss || currentEvent?.isFinalBoss
  const damageScaling = isZoneBoss
    ? GAME_CONFIG.scaling.zoneBossDamage
    : isBoss
      ? GAME_CONFIG.scaling.floorBossDamage
      : GAME_CONFIG.scaling.damage

  for (const effect of outcome.effects) {
    const targets = selectTargets(effect.target || 'all', updatedParty)
    
    switch (effect.type) {
      case 'damage': {
        const baseDamage = effect.value || 0
        const isTrueDamage = effect.isTrueDamage || false
        // True damage uses its own scaling factor since it bypasses defense
        const effectiveScaling = isTrueDamage ? GAME_CONFIG.scaling.trueDamage : damageScaling
        const scaledDamage = scaleValue(baseDamage, floor, effectiveScaling)
        const damage = Math.floor(scaledDamage * GAME_CONFIG.multipliers.damage)
        
        // Calculate actual damage for each hero and track breakdown
        const damageBreakdown: { 
          heroId: string
          heroName: string
          damage: number
          originalDamage: number
          isCrit?: boolean
          isDodge?: boolean
        }[] = []
        
        targets.forEach(hero => {
          // Dodge check: speed gives chance to dodge (0.1% per speed point, max 50%)
          const dodgeChance = Math.min(0.50, (hero.stats.speed || 0) * 0.001)
          const isDodge = Math.random() < dodgeChance
          
          if (isDodge) {
            damageBreakdown.push({
              heroId: hero.id,
              heroName: hero.name,
              damage: 0,
              originalDamage: damage,
              isDodge: true
            })
            return
          }
          
          // Critical hit check: luck gives chance for enemy to crit (0.1% per floor, increased by -luck)
          const enemyBaseCrit = floor * 0.001 // 0.1% per floor
          const luckReduction = (hero.stats.luck || 0) * 0.001 // Luck reduces enemy crit chance
          const enemyCritChance = Math.max(0.01, Math.min(0.30, enemyBaseCrit - luckReduction))
          const isCrit = Math.random() < enemyCritChance
          
          // Apply defense reduction using configured formula
          let finalDamage = isTrueDamage 
            ? damage 
            : applyDefenseReduction(damage, hero.stats.defense)
          
          // Critical hits deal 2x damage
          if (isCrit) {
            finalDamage = Math.floor(finalDamage * 2)
          }
          
          hero.stats.hp = Math.max(0, hero.stats.hp - finalDamage)
          if (hero.stats.hp === 0) {
            hero.isAlive = false
          }
          
          damageBreakdown.push({
            heroId: hero.id,
            heroName: hero.name,
            damage: finalDamage,
            originalDamage: damage,
            isCrit,
            isDodge: false
          })
        })
        
        // Create detailed damage descriptions with crit/dodge
        const damageDescriptions: string[] = []
        const dodgedHeroes: string[] = []
        const normalHits: { name: string, dmg: number, origDmg: number }[] = []
        const critHits: { name: string, dmg: number, origDmg: number }[] = []
        
        damageBreakdown.forEach(d => {
          if (d.isDodge) {
            dodgedHeroes.push(d.heroName)
          } else if (d.isCrit) {
            critHits.push({ name: d.heroName, dmg: d.damage, origDmg: d.originalDamage })
          } else {
            normalHits.push({ name: d.heroName, dmg: d.damage, origDmg: d.originalDamage })
          }
        })
        
        if (dodgedHeroes.length > 0) {
          damageDescriptions.push(`${formatNameList(dodgedHeroes)} dodged!`)
        }
        
        if (critHits.length > 0) {
          const critDesc = critHits.map(h => 
            isTrueDamage ? `${h.name} took ${h.dmg}` : `${h.name} took ${h.dmg} (${h.origDmg})`
          ).join(', ')
          damageDescriptions.push(`💥 CRITICAL HIT! ${critDesc} damage`)
        }
        
        if (normalHits.length > 0) {
          const normalDesc = isTrueDamage
            ? `${formatNameList(normalHits.map(h => h.name))} took ${normalHits[0].dmg} damage`
            : `${formatNameList(normalHits.map(h => h.name))} took ${normalHits[0].dmg} (${normalHits[0].origDmg}) damage`
          damageDescriptions.push(normalDesc)
        }
        
        const damageDesc = damageDescriptions.join('; ')
        
        resolvedEffects.push({
          type: 'damage',
          target: targets.map(h => h.id),
          value: damageBreakdown.reduce((sum, d) => sum + d.damage, 0),
          originalValue: damage,
          description: damageDesc,
          damageBreakdown
        })
        break
      }
      
      case 'heal': {
        const baseHealing = effect.value || 0
        const scaledHealing = scaleValue(baseHealing, floor, GAME_CONFIG.scaling.healing)
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
        const scaledXp = scaleValue(baseXp, floor, 0.15) // 15% per floor (rewards scale faster)
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
        const scaledGold = scaleValue(baseGold, floor, 0.15) // 15% per floor (rewards scale faster)
        const gold = Math.floor(scaledGold * GAME_CONFIG.multipliers.gold)
        updatedGold += gold
        // Track negative gold (costs) for potential refunds
        if (gold < 0) {
          goldCostThisOutcome += Math.abs(gold)
        }
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
          generatedItem = generateItemFromSpec(choice, floor)
        } else {
          // Handle single item specification
          generatedItem = generateItemFromSpec(effect, floor)
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
      
      case 'consumable': {
        // Give consumable item
        if (effect.consumableId) {
          const consumable = getConsumableById(effect.consumableId)
          if (consumable) {
            const consumableWithId: Consumable = {
              ...consumable,
              id: uuidv4(),
            }
            foundItems.push(consumableWithId as any) // Consumables can go in dungeon inventory
            resolvedEffects.push({
              type: 'item',
              target: [],
              item: consumableWithId as any,
              description: `Found ${consumable.name}`
            })
          }
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
        
        // Skip if no one is dead
        if (deadHeroes.length === 0) {
          break
        }
        
        const toRevive = effect.target === 'all' 
          ? deadHeroes 
          : deadHeroes.length > 0 
            ? [deadHeroes[Math.floor(Math.random() * deadHeroes.length)]]
            : []
        
        const healAmount = effect.value || 0
        const scaledHeal = scaleValue(healAmount, floor, 0.08)
        
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
        
        // Use the same rarity order as the upgrade system
        const rarityOrder: ItemRarity[] = [
          'junk', 'abundant', 'common', 'uncommon',
          'rare', 'veryRare', 'magical', 'elite',
          'epic', 'legendary', 'mythic', 'mythicc',
          'artifact', 'divine', 'celestial',
          'realityAnchor', 'structural', 'singularity', 'void', 'elder',
          'layer', 'plane', 'author'
        ]
        
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
          // Refund any gold cost from this outcome
          if (goldCostThisOutcome > 0) {
            updatedGold += goldCostThisOutcome
            resolvedEffects.push({
              type: 'gold',
              target: [],
              value: goldCostThisOutcome,
              description: `${goldCostThisOutcome} gold refunded`
            })
          }
          resolvedEffects.push({
            type: 'upgradeItem',
            target: [],
            description: 'All equipment is already at maximum rarity or cannot be upgraded'
          })
          break
        }
        
        const { hero, item, slot } = lowestItemData
        const rarityBoost = effect.rarityBoost || 0
        const upgradedItem = upgradeItemRarity(item, floor, rarityBoost)
        
        if (!upgradedItem) {
          // Refund any gold cost from this outcome
          if (goldCostThisOutcome > 0) {
            updatedGold += goldCostThisOutcome
            resolvedEffects.push({
              type: 'gold',
              target: [],
              value: goldCostThisOutcome,
              description: `${goldCostThisOutcome} gold refunded`
            })
          }
          resolvedEffects.push({
            type: 'upgradeItem',
            target: [hero.id],
            description: `${hero.name}'s ${item.name} cannot be upgraded further (maximum rarity and material)`
          })
          break
        }
        
        // Check if this was a rarity upgrade or material upgrade
        const isRarityUpgrade = upgradedItem.rarity !== item.rarity
        const isMaterialUpgrade = !isRarityUpgrade

        // Replace the old item with the upgraded one in hero's slots
        hero.slots[slot] = upgradedItem
        
        const upgradeDescription = isMaterialUpgrade
          ? `${hero.name}'s ${item.name} was upgraded to superior material: ${upgradedItem.name}!`
          : `${hero.name}'s ${item.name} was upgraded to ${upgradedItem.name}!`

        resolvedEffects.push({
          type: 'upgradeItem',
          target: [hero.id],
          item: upgradedItem,
          description: upgradeDescription
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
      text: selectText(outcome.text),
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
    hasDeadHero?: boolean
  } | undefined,
  party: (Hero | null)[],
  depth: number = 1,
  gold: number = 0
): boolean {
  if (!requirements) {
    return true
  }
  
  if (requirements.hasDeadHero !== undefined) {
    const hasDeadHero = party.some(h => h !== null && !h.isAlive)
    if (requirements.hasDeadHero && !hasDeadHero) return false
    if (!requirements.hasDeadHero && hasDeadHero) return false
  }
  
  if (requirements.class) {
    const hasClass = party.some(h => h !== null && h.isAlive && h.class.id.toLowerCase() === requirements.class!.toLowerCase())
    if (!hasClass) return false
  }
  
  if (requirements.stat && requirements.minValue !== undefined) {
    // Scale stat requirements with floor (25% per floor to match stat growth)
    const scaledMinValue = scaleValue(requirements.minValue, depth, GAME_CONFIG.scaling.statRequirements)
    const hasStat = party.some(h => {
      if (!h || !h.isAlive) return false
      const statValue = h.stats[requirements.stat as keyof typeof h.stats]
      return typeof statValue === 'number' && statValue >= scaledMinValue
    })
    if (!hasStat) return false
  }
  
  if (requirements.gold !== undefined) {
    // Scale gold requirements with floor (same as rewards - 15% per floor)
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
