import type { Hero, Consumable, GameState } from '@/types'
import { applyEffect } from '../effects/effectManager'
import { GiHealthPotion, GiStrong, GiShield, GiRun, GiClover } from 'react-icons/gi'

/**
 * Use a consumable from a hero's consumable slot
 */
export function useConsumable(
  hero: Hero,
  slotIndex: number,
  currentDepth: number,
  party: (Hero | null)[]
): {
  hero: Hero
  party: (Hero | null)[]
  message: string
} {
  const consumable = hero.consumableSlots[slotIndex]
  
  if (!consumable) {
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
    updatedHero.consumableSlots[slotIndex] = {
      ...consumable,
      stackCount: consumable.stackCount - 1,
    }
  } else {
    updatedHero.consumableSlots[slotIndex] = null
  }

  // Update party with modified hero
  updatedParty = updatedParty.map((p) => (p?.id === hero.id ? updatedHero : p))

  return { hero: updatedHero, party: updatedParty, message }
}

/**
 * Equip a consumable from inventory to a hero's consumable slot
 */
export function equipConsumable(hero: Hero, consumable: Consumable, slotIndex: number): Hero {
  if (slotIndex < 0 || slotIndex >= 3) {
    throw new Error('Invalid consumable slot index')
  }

  const updatedSlots = [...hero.consumableSlots]
  updatedSlots[slotIndex] = { ...consumable }

  return {
    ...hero,
    consumableSlots: updatedSlots,
  }
}

/**
 * Unequip a consumable from a hero's slot (returns it to inventory)
 */
export function unequipConsumable(hero: Hero, slotIndex: number): { hero: Hero; consumable: Consumable | null } {
  if (slotIndex < 0 || slotIndex >= 3) {
    throw new Error('Invalid consumable slot index')
  }

  const consumable = hero.consumableSlots[slotIndex]
  const updatedSlots = [...hero.consumableSlots]
  updatedSlots[slotIndex] = null

  return {
    hero: { ...hero, consumableSlots: updatedSlots },
    consumable,
  }
}

/**
 * Get all consumable slots with their status
 */
export function getConsumableSlotInfo(hero: Hero): Array<{
  index: number
  consumable: Consumable | null
  isEmpty: boolean
}> {
  return hero.consumableSlots.map((consumable, index) => ({
    index,
    consumable,
    isEmpty: consumable === null,
  }))
}

/**
 * Check if hero has a specific consumable equipped
 */
export function hasConsumableEquipped(hero: Hero, consumableId: string): boolean {
  return hero.consumableSlots.some((c) => c?.id === consumableId)
}

/**
 * Get count of specific consumable across all slots (for stackables)
 */
export function getConsumableCount(hero: Hero, consumableId: string): number {
  return hero.consumableSlots.reduce((count, c) => {
    if (c?.id === consumableId) {
      return count + (c.stackCount || 1)
    }
    return count
  }, 0)
}
