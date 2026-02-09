/**
 * Unique Item Effects System
 * 
 * This system handles special effects that trigger from unique items and set pieces.
 * 
 * EFFECT DEFINITION APPROACHES:
 * 
 * 1. INLINE in Item Definition (Recommended for set items):
 *    Define `uniqueEffect` property directly in the set item file (e.g., kitsune/weapon.ts)
 *    Example:
 *    ```
 *    export const KITSUNE_BITE: Omit<Item, 'id'> & { uniqueEffect?: UniqueEffectDefinition } = {
 *      name: "Kitsune's Bite",
 *      // ... stats ...
 *      uniqueEffect: {
 *        triggers: ['onCombatStart'],
 *        description: 'Fox Fury: +20% Attack at battle start',
 *        handler: (context) => { ... }
 *      }
 *    }
 *    ```
 * 
 * 2. CENTRALIZED in UNIQUE_ITEM_EFFECTS (For standalone uniques):
 *    Define in this file keyed by exact item name
 *    Example: 'Heart of the Phoenix': { ... }
 * 
 * 3. SET-WIDE in effects.ts (Default for all set pieces):
 *    Define in sets/[setname]/effects.ts as SET_UNIQUE_EFFECT
 *    Applies to ANY piece from that set when it rolls as unique
 * 
 * PRIORITY: item.uniqueEffect > UNIQUE_ITEM_EFFECTS[name] > UNIQUE_SET_EFFECTS[setId]
 * 
 * EACH SET'S effects.ts FILE CONTAINS:
 * - SET_BONUSES: Passive stat boosts for equipping multiple pieces (2, 4, 6-piece bonuses)
 * - SET_UNIQUE_EFFECT: Triggered effect when any piece rolls as unique (15% chance)
 */

import type { Hero, Item, Consumable } from '@/types'
import type { ResolvedOutcome } from '@/systems/events/eventResolver'
import { KITSUNE_SET_UNIQUE_EFFECT } from '@/data/items/sets/kitsune/effects'
import { TITAN_SET_UNIQUE_EFFECT } from '@/data/items/sets/titan/effects'
import { ARCANE_SET_UNIQUE_EFFECT } from '@/data/items/sets/arcane/effects'
import { DRACONIC_SET_UNIQUE_EFFECT } from '@/data/items/sets/draconic/effects'
import { SHADOW_SET_UNIQUE_EFFECT } from '@/data/items/sets/shadow/effects'

export type UniqueEffectTrigger =
  | 'onBossDefeat'        // After defeating a boss (before wipe check)
  | 'onCombatStart'       // At the start of any combat
  | 'onCombatEnd'         // After any combat (victory or defeat)
  | 'onDeath'             // When the hero wearing this dies
  | 'onHeroRevive'        // When any hero is revived
  | 'onDamageTaken'       // When the wearer takes damage
  | 'onDamageDealt'       // When the wearer deals damage
  | 'onDepthAdvance'      // When advancing depth (every event)
  | 'onFloorAdvance'      // When advancing to a new floor
  | 'onEventStart'        // At the start of any event
  | 'onEventEnd'          // At the end of any event
  | 'onItemFound'         // When any item is found
  | 'onGoldGained'        // When gold is gained
  | 'onHeal'              // When the wearer is healed

export interface UniqueEffectContext {
  party: (Hero | null)[]
  trigger: UniqueEffectTrigger
  eventType?: string
  resolvedOutcome?: ResolvedOutcome
  floor?: number
  // Additional context based on trigger
  sourceHero?: Hero       // The hero wearing the item
  targetHero?: Hero       // Target of an effect
  damageAmount?: number
  healAmount?: number
}

export interface UniqueEffectResult {
  party: (Hero | null)[]  // Modified party
  message?: string         // Message to display
  additionalEffects?: Array<{
    type: 'heal' | 'damage' | 'revive' | 'status'
    target: string[]
    value?: number
    description: string
  }>
}

export type UniqueEffectHandler = (
  context: UniqueEffectContext
) => UniqueEffectResult | null

export interface UniqueEffectDefinition {
  triggers: UniqueEffectTrigger[]
  handler: UniqueEffectHandler
  description: string
}

/**
 * Registry of unique item effects - keyed by item name (exact match)
 * Use this for standalone unique items.
 * Set items can define uniqueEffect directly in their item definition files.
 */
export const UNIQUE_ITEM_EFFECTS: Record<string, UniqueEffectDefinition> = {
  'Heart of the Phoenix': {
    triggers: ['onBossDefeat'],
    description: 'Resurrects a random dead party member with 50% HP after defeating a boss',
    handler: (context) => {
      const { party, sourceHero } = context
      
      // Must have an alive hero wearing it
      if (!sourceHero || !sourceHero.isAlive) {
        return null
      }
      
      // Find dead heroes
      const deadHeroes = party.filter((h): h is Hero => h !== null && !h.isAlive)
      
      if (deadHeroes.length === 0) {
        return null // No one to resurrect
      }
      
      // Pick a random dead hero
      const randomDead = deadHeroes[Math.floor(Math.random() * deadHeroes.length)]
      const resurrectionHp = Math.floor(randomDead.stats.maxHp * 0.5)
      
      // Resurrect them
      randomDead.isAlive = true
      randomDead.stats.hp = resurrectionHp
      
      return {
        party,
        message: `Heart of the Phoenix resurrects ${randomDead.name}!`,
        additionalEffects: [{
          type: 'revive',
          target: [randomDead.id],
          value: resurrectionHp,
          description: `Heart of the Phoenix resurrects ${randomDead.name} with ${resurrectionHp} HP!`
        }]
      }
    }
  },
  
  'Demon Coreflail': {
    triggers: ['onCombatStart', 'onDepthAdvance'],
    description: 'Lethal Radiation: Deals 8 damage to entire party at combat start and every depth advance',
    handler: (context) => {
      const { party } = context
      const radiationDamage = 8
      const deathMessages: string[] = []
      const affectedHeroes: string[] = []
      let totalDamage = 0
      
      // Damage all alive heroes
      party.forEach(hero => {
        if (hero && hero.isAlive) {
          const actualDamage = Math.min(radiationDamage, hero.stats.hp)
          hero.stats.hp = Math.max(0, hero.stats.hp - radiationDamage)
          totalDamage += actualDamage
          affectedHeroes.push(hero.id)
          
          if (hero.stats.hp <= 0) {
            hero.isAlive = false
            deathMessages.push(`${hero.name} succumbs to radiation poisoning!`)
          }
        }
      })
      
      if (affectedHeroes.length === 0) {
        return null
      }
      
      return {
        party,
        message: undefined,
        additionalEffects: [{
          type: 'damage' as const,
          target: affectedHeroes,
          value: radiationDamage,
          description: `⚛️ The Demon Coreflail bathes the party in lethal radiation! ${radiationDamage} damage to all party members. ${deathMessages.join(' ')}`
        }]
      }
    }
  },
  
  // Example of other unique effects that could be added:
  // 'Amulet of Last Stand': {
  //   triggers: ['onDeath'],
  //   description: 'When wearer would die, survive with 1 HP (once per run)',
  //   handler: (context) => {
  //     // Implementation here
  //     return null
  //   }
  // },
}

/**
 * Registry of set-wide unique effects - keyed by set ID (e.g., "Kitsune", "Titan")
 * These effects trigger when ANY piece from the set rolls as unique
 * Individual set pieces can override this by defining an effect in UNIQUE_ITEM_EFFECTS
 */
export const UNIQUE_SET_EFFECTS: Record<string, UniqueEffectDefinition> = {
  // Kitsune set effect
  'Kitsune': KITSUNE_SET_UNIQUE_EFFECT,
  
  // Titan set effect
  'Titan': TITAN_SET_UNIQUE_EFFECT,
  
  // Arcane set effect
  'Arcane': ARCANE_SET_UNIQUE_EFFECT,
  
  // Draconic set effect
  'Draconic': DRACONIC_SET_UNIQUE_EFFECT,
  
  // Shadow set effect
  'Shadow': SHADOW_SET_UNIQUE_EFFECT,
}

/**
 * Process unique item effects for a given trigger
 * Checks all equipped items on all heroes and triggers matching effects
 * Priority: Individual item effects > Set-wide effects
 */
export function processUniqueEffects(
  party: (Hero | null)[],
  trigger: UniqueEffectTrigger,
  context: Partial<UniqueEffectContext> = {}
): UniqueEffectResult | null {
  let modifiedParty = [...party]
  const allEffects: UniqueEffectResult['additionalEffects'] = []
  const messages: string[] = []
  
  // Find all unique items equipped by alive heroes
  const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
  
  for (const hero of aliveHeroes) {
    // Check all equipment slots
    for (const item of Object.values(hero.slots)) {
      if (!item || 'consumableType' in item) continue // Skip consumables
      
      const itemData = item as Item & { uniqueEffect?: UniqueEffectDefinition }
      
      // Priority 1: Check for item-specific uniqueEffect defined in the item file
      // Skip if handler is not a function (corrupted by save/load serialization)
      let effectDef = (itemData.uniqueEffect && typeof itemData.uniqueEffect.handler === 'function')
        ? itemData.uniqueEffect
        : undefined
      
      // Priority 2: Check for individual item effect by exact name in UNIQUE_ITEM_EFFECTS
      if (!effectDef) {
        effectDef = UNIQUE_ITEM_EFFECTS[itemData.name]
      }
      
      // Priority 3: If item is a unique-rolled set piece, check set-wide effects
      if (!effectDef && itemData.isUnique && itemData.setId) {
        effectDef = UNIQUE_SET_EFFECTS[itemData.setId]
      }
      
      if (!effectDef) continue
      
      // Final safety check: ensure handler is a function
      if (typeof effectDef.handler !== 'function') {
        console.warn(`UniqueEffect handler for ${itemData.name} is not a function, skipping`)
        continue
      }
      
      // Check if this trigger matches
      if (!effectDef.triggers.includes(trigger)) continue
      
      // Execute the effect
      const result = effectDef.handler({
        party: modifiedParty,
        trigger,
        sourceHero: hero,
        ...context
      })
      
      if (result) {
        modifiedParty = result.party
        if (result.message) messages.push(result.message)
        if (result.additionalEffects) allEffects.push(...result.additionalEffects)
      }
    }
  }
  
  // Return combined results
  if (messages.length === 0 && allEffects.length === 0) {
    return null
  }
  
  return {
    party: modifiedParty,
    message: messages.join(' '),
    additionalEffects: allEffects
  }
}

/**
 * Check if any hero has a specific unique item equipped
 */
export function hasUniqueItemEquipped(
  party: (Hero | null)[],
  itemName: string
): boolean {
  return party.some(hero => 
    hero && hero.isAlive && Object.values(hero.slots).some(item =>
      item && 'name' in item && item.name === itemName
    )
  )
}

/**
 * Get all unique items currently equipped by the party
 * Includes standalone uniques, set items with unique rolls, and items with defined uniqueEffect
 */
export function getEquippedUniqueItems(
  party: (Hero | null)[]
): Array<{ hero: Hero; item: Item; slotId: string }> {
  const equipped: Array<{ hero: Hero; item: Item; slotId: string }> = []
  
  for (const hero of party) {
    if (!hero) continue
    
    for (const [slotId, item] of Object.entries(hero.slots)) {
      if (!item || 'consumableType' in item) continue
      
      const itemData = item as Item & { uniqueEffect?: UniqueEffectDefinition }
      
      // Check if item has an effect defined (by property, by name, or by setId)
      const hasEffect = 
        itemData.uniqueEffect ||
        (itemData.isUnique && UNIQUE_ITEM_EFFECTS[itemData.name]) ||
        (itemData.isUnique && itemData.setId && UNIQUE_SET_EFFECTS[itemData.setId])
      
      if (hasEffect) {
        equipped.push({ hero, item: itemData, slotId })
      }
    }
  }
  
  return equipped
}

/**
 * Get the unique effect definition for a specific item (for display purposes)
 * Returns null if the item has no unique effect
 * 
 * Priority order (same as processUniqueEffects):
 * 1. item.uniqueEffect (defined inline in item definition)
 * 2. UNIQUE_ITEM_EFFECTS[item.name] (centralized by item name)
 * 3. UNIQUE_SET_EFFECTS[item.setId] (set-wide effect for unique-rolled set pieces)
 */
export function getUniqueEffectForItem(
  item: Item | null | undefined
): UniqueEffectDefinition | null {
  // Safety checks
  if (!item) return null
  if ('consumableType' in item) return null
  
  const itemData = item as Item & { uniqueEffect?: UniqueEffectDefinition }
  
  // Priority 1: Check for item-specific uniqueEffect defined in the item file
  // Skip if handler is not a function (corrupted by save/load serialization)
  if (itemData.uniqueEffect && typeof itemData.uniqueEffect.handler === 'function') {
    return itemData.uniqueEffect
  }
  
  // Priority 2: Check for individual item effect by exact name in UNIQUE_ITEM_EFFECTS
  if (itemData.name && UNIQUE_ITEM_EFFECTS[itemData.name]) {
    return UNIQUE_ITEM_EFFECTS[itemData.name]
  }
  
  // Priority 3: If item is a unique-rolled set piece, check set-wide effects
  if (itemData.isUnique && itemData.setId && UNIQUE_SET_EFFECTS[itemData.setId]) {
    return UNIQUE_SET_EFFECTS[itemData.setId]
  }
  
  return null
}
