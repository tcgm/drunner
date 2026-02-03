import type { Hero, Consumable, GameState } from '@/types'
import { applyEffect } from '../effects/effectManager'
import { GiHealthPotion, GiStrong, GiShield, GiRun, GiClover } from 'react-icons/gi'
import { getConsumableSlotIds } from '@/config/slotConfig'

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
  let message = ''

  // Apply consumable effect
  switch (consumable.effect.type) {
    case 'heal':
      if (consumable.effect.value) {
        const healAmount = Math.min(consumable.effect.value, hero.stats.maxHp - hero.stats.hp)
        updatedHero.stats = {
          ...updatedHero.stats,
          hp: Math.min(hero.stats.hp + consumable.effect.value, hero.stats.maxHp),
        }
        message = `${hero.name} used ${consumable.name} and recovered ${healAmount} HP!`
      }
      break

    case 'revive':
      if (!hero.isAlive && consumable.effect.value) {
        // Revive the hero with the specified HP amount
        updatedHero.isAlive = true
        updatedHero.stats = {
          ...updatedHero.stats,
          hp: Math.min(consumable.effect.value, hero.stats.maxHp),
        }
        message = `${hero.name} was revived with ${consumable.effect.value} HP!`
      } else if (hero.isAlive) {
        message = `${hero.name} is already alive!`
      }
      break

    case 'buff':
      if (consumable.effect.stat && consumable.effect.value && consumable.effect.duration) {
        const effectToApply = {
          name: consumable.name,
          description: consumable.description,
          icon: consumable.icon,
          type: 'buff' as const,
          stat: consumable.effect.stat,
          modifier: consumable.effect.value,
          duration: consumable.effect.duration,
          isPermanent: consumable.effect.isPermanent || false,
        }
        
        const heroWithEffect = applyEffect(updatedHero, effectToApply, currentDepth)
        Object.assign(updatedHero, heroWithEffect)
        
        message = `${hero.name} used ${consumable.name} and gained +${consumable.effect.value} ${consumable.effect.stat} for ${consumable.effect.duration} events!`
      }
      break

    case 'cleanse':
      // Remove all debuffs
      updatedHero.activeEffects = updatedHero.activeEffects.filter((e) => e.type !== 'debuff')
      message = `${hero.name} used ${consumable.name} and cleansed all debuffs!`
      break

    case 'damage':
      // Damage effects would need enemy targeting logic
      message = `${hero.name} used ${consumable.name}!`
      break

    case 'special':
      message = `${hero.name} used ${consumable.name}!`
      break
  }

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
