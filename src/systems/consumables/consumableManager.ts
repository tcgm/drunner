import type { Hero, Consumable, GameState } from '@/types'
import { applyEffect } from '../effects/effectManager'
import { GiHealthPotion, GiStrong, GiShield, GiRun, GiClover } from 'react-icons/gi'
import { getConsumableSlotIds } from '@/config/slotConfig'
import { calculateTotalStats } from '@/utils/statCalculator'

/**
 * Use a consumable from a hero's slot by slot ID
 */
export function useConsumable(
  hero: Hero,
  slotId: string,
  currentDepth: number,
  party: (Hero | null)[]
): {
  hero: Hero
  party: (Hero | null)[]
  message: string
} {
  const consumable = hero.slots[slotId] as Consumable | null
  
  if (!consumable || !('consumableType' in consumable)) {
    return { hero, party, message: 'No consumable in that slot.' }
  }

  const updatedHero = { ...hero }
  let updatedParty = [...party]
  const messages: string[] = []

  // Apply all consumable effects
  for (const effect of consumable.effects) {
    switch (effect.type) {
      case 'heal':
        if (effect.value) {
          const effectiveMaxHp = calculateTotalStats(updatedHero).maxHp
          const healAmount = Math.min(effect.value, effectiveMaxHp - updatedHero.stats.hp)
          updatedHero.stats = {
            ...updatedHero.stats,
            hp: Math.min(updatedHero.stats.hp + effect.value, effectiveMaxHp),
          }
          messages.push(`Recovered ${healAmount} HP`)
        }
        break

      case 'hot':
        // Heal over time - apply as a regeneration effect
        if (effect.value && effect.duration) {
          const effectToApply = {
            name: consumable.name,
            description: `Healing ${effect.value} HP per event`,
            icon: consumable.icon,
            type: 'regeneration' as const,
            modifier: effect.value, // HP to heal per event
            duration: effect.duration,
            isPermanent: false,
          }
          
          const heroWithEffect = applyEffect(updatedHero, effectToApply, currentDepth)
          Object.assign(updatedHero, heroWithEffect)
          
          messages.push(`Will recover ${effect.value} HP per event for ${effect.duration} events`)
        }
        break

      case 'revive':
        if (!hero.isAlive && effect.value) {
          // Revive the hero with the specified HP amount
          updatedHero.isAlive = true
          const effectiveMaxHp = calculateTotalStats(updatedHero).maxHp
          updatedHero.stats = {
            ...updatedHero.stats,
            hp: Math.min(effect.value, effectiveMaxHp),
          }
          messages.push(`Was revived with ${effect.value} HP`)
        } else if (hero.isAlive) {
          messages.push(`Already alive`)
        }
        break

      case 'buff':
        if (effect.stat && effect.value && effect.duration) {
          const effectToApply = {
            name: consumable.name,
            description: consumable.description,
            icon: consumable.icon,
            type: 'buff' as const,
            stat: effect.stat,
            modifier: effect.value,
            duration: effect.duration,
            isPermanent: effect.isPermanent || false,
          }
          
          const heroWithEffect = applyEffect(updatedHero, effectToApply, currentDepth)
          Object.assign(updatedHero, heroWithEffect)
          
          messages.push(`Gained +${effect.value} ${effect.stat} for ${effect.duration} events`)
        }
        break

      case 'cleanse':
        // Remove all debuffs
        updatedHero.activeEffects = updatedHero.activeEffects.filter((e) => e.type !== 'debuff')
        messages.push(`Cleansed all debuffs`)
        break

      case 'damage':
        // Damage effects would need enemy targeting logic
        messages.push(`Used ${consumable.name}`)
        break

      case 'special':
        messages.push(`Used ${consumable.name}`)
        break
    }
  }

  const message = messages.length > 0 
    ? `${hero.name} used ${consumable.name}! ${messages.join(', ')}.`
    : `${hero.name} used ${consumable.name}!`

  // Remove or decrement stack
  if (consumable.stackable && consumable.stackCount && consumable.stackCount > 1) {
    updatedHero.slots = {
      ...updatedHero.slots,
      [slotId]: {
        ...consumable,
        stackCount: consumable.stackCount - 1,
      }
    }
  } else {
    updatedHero.slots = {
      ...updatedHero.slots,
      [slotId]: null
    }
  }

  // Update party with modified hero
  updatedParty = updatedParty.map((p) => (p?.id === hero.id ? updatedHero : p))

  return { hero: updatedHero, party: updatedParty, message }
}

/**
 * Equip a consumable from inventory to a hero's consumable slot
 */
export function equipConsumable(hero: Hero, consumable: Consumable, slotId: string): Hero {
  const consumableSlotIds = getConsumableSlotIds()
  
  if (!consumableSlotIds.includes(slotId)) {
    throw new Error('Invalid consumable slot ID')
  }

  return {
    ...hero,
    slots: {
      ...hero.slots,
      [slotId]: { ...consumable }
    }
  }
}

/**
 * Unequip a consumable from a hero's slot (returns it to inventory)
 */
export function unequipConsumable(hero: Hero, slotId: string): { hero: Hero; consumable: Consumable | null } {
  const consumableSlotIds = getConsumableSlotIds()
  
  if (!consumableSlotIds.includes(slotId)) {
    throw new Error('Invalid consumable slot ID')
  }

  const consumable = hero.slots[slotId] as Consumable | null

  return {
    hero: { 
      ...hero, 
      slots: {
        ...hero.slots,
        [slotId]: null
      }
    },
    consumable,
  }
}

/**
 * Get all consumable slots with their status
 */
export function getConsumableSlotInfo(hero: Hero): Array<{
  slotId: string
  consumable: Consumable | null
  isEmpty: boolean
}> {
  const consumableSlotIds = getConsumableSlotIds()
  
  return consumableSlotIds.map((slotId) => ({
    slotId,
    consumable: hero.slots[slotId] as Consumable | null,
    isEmpty: hero.slots[slotId] === null,
  }))
}

/**
 * Check if hero has a specific consumable equipped
 */
export function hasConsumableEquipped(hero: Hero, consumableId: string): boolean {
  const consumableSlotIds = getConsumableSlotIds()
  
  return consumableSlotIds.some((slotId) => {
    const item = hero.slots[slotId]
    return item && 'consumableType' in item && item.id === consumableId
  })
}

/**
 * Get count of specific consumable across all slots (for stackables)
 */
export function getConsumableCount(hero: Hero, consumableId: string): number {
  const consumableSlotIds = getConsumableSlotIds()
  
  return consumableSlotIds.reduce((count, slotId) => {
    const item = hero.slots[slotId]
    if (item && 'consumableType' in item && item.id === consumableId) {
      return count + (item.stackCount || 1)
    }
    return count
  }, 0)
}
