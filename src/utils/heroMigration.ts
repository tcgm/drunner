import type { Hero, Equipment, Consumable } from '@/types'
import { getEnabledSlots } from '@/config/slotConfig'

/**
 * Migrate a hero from old equipment/consumableSlots format to new slots format
 */
export function migrateHeroSlots(hero: Hero): Hero {
  // If already migrated (has slots and no legacy fields), return as-is
  if (hero.slots && !hero.equipment && !hero.consumableSlots) {
    return hero
  }
  
  // Initialize all slots as empty
  const slots: Record<string, any> = {}
  for (const slot of getEnabledSlots()) {
    slots[slot.id] = null
  }
  
  // Migrate equipment if present
  if (hero.equipment) {
    const equipment = hero.equipment as Equipment
    if (equipment.weapon) slots.weapon = equipment.weapon
    if (equipment.armor) slots.armor = equipment.armor
    if (equipment.helmet) slots.helmet = equipment.helmet
    if (equipment.boots) slots.boots = equipment.boots
    if (equipment.accessory1) slots.accessory1 = equipment.accessory1
    if (equipment.accessory2) slots.accessory2 = equipment.accessory2
    if (equipment.offhand) slots.offhand = equipment.offhand
    if (equipment.belt) slots.belt = equipment.belt
    if (equipment.cloak) slots.cloak = equipment.cloak
    if (equipment.gloves) slots.gloves = equipment.gloves
  }
  
  // Migrate consumable slots if present
  if (hero.consumableSlots && Array.isArray(hero.consumableSlots)) {
    const consumables = hero.consumableSlots as (Consumable | null)[]
    if (consumables[0]) slots.consumable1 = consumables[0]
    if (consumables[1]) slots.consumable2 = consumables[1]
    if (consumables[2]) slots.consumable3 = consumables[2]
  }
  
  // Return migrated hero without legacy fields
  const { equipment, consumableSlots, ...rest } = hero
  return {
    ...rest,
    slots,
  }
}

/**
 * Migrate an array of heroes
 */
export function migrateHeroArray(heroes: (Hero | null)[]): (Hero | null)[] {
  return heroes.map(hero => hero ? migrateHeroSlots(hero) : null)
}
