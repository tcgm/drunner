import type { Hero, Equipment, Consumable, Item } from '@/types'
import { getEnabledSlots } from '@/config/slotConfig'
import { getClassById } from '@/data/classes'

/**
 * Migrate a hero from old equipment/consumableSlots format to new slots format
 */
export function migrateHeroSlots(hero: Hero): Hero {
  // Check if hero has slots AND legacy equipment/consumableSlots
  const hasSlots = !!hero.slots
  const hasLegacyEquipment = !!hero.equipment
  const hasLegacyConsumables = !!hero.consumableSlots

  // If hero has slots but ALSO has legacy fields, we need to merge them
  // This handles the case where slots were initialized but equipment wasn't migrated
  if (hasSlots && (hasLegacyEquipment || hasLegacyConsumables)) {
    const slots = { ...hero.slots }

    // Migrate equipment if present
    if (hasLegacyEquipment) {
      const equipment = hero.equipment as Equipment
      // Only copy if slot is empty (don't overwrite existing items)
      if (equipment.weapon && !slots.weapon) slots.weapon = equipment.weapon
      if (equipment.armor && !slots.armor) slots.armor = equipment.armor
      if (equipment.helmet && !slots.helmet) slots.helmet = equipment.helmet
      if (equipment.boots && !slots.boots) slots.boots = equipment.boots
      if (equipment.accessory1 && !slots.accessory1) slots.accessory1 = equipment.accessory1
      if (equipment.accessory2 && !slots.accessory2) slots.accessory2 = equipment.accessory2
      if (equipment.offhand && !slots.offhand) slots.offhand = equipment.offhand
      if (equipment.belt && !slots.belt) slots.belt = equipment.belt
      if (equipment.cloak && !slots.cloak) slots.cloak = equipment.cloak
      if (equipment.gloves && !slots.gloves) slots.gloves = equipment.gloves
    }

    // Migrate consumable slots if present
    if (hasLegacyConsumables && Array.isArray(hero.consumableSlots)) {
      const consumables = hero.consumableSlots as (Consumable | null)[]
      if (consumables[0] && !slots.consumable1) slots.consumable1 = consumables[0]
      if (consumables[1] && !slots.consumable2) slots.consumable2 = consumables[1]
      if (consumables[2] && !slots.consumable3) slots.consumable3 = consumables[2]
    }

    const migratedHero = {
      ...hero,
      slots,
      activeEffects: hero.activeEffects || [],
    }

    // Add wisdom and charisma if missing
    const needsWisdom = migratedHero.stats.wisdom == null || isNaN(migratedHero.stats.wisdom)
    const needsCharisma = migratedHero.stats.charisma == null || isNaN(migratedHero.stats.charisma)

    if (needsWisdom || needsCharisma) {
      const currentClass = getClassById(hero.class.id) || hero.class
      const levelBonus = (hero.level - 1) * 5
      migratedHero.class = currentClass
      migratedHero.stats = {
        ...migratedHero.stats,
        wisdom: needsWisdom ? currentClass.baseStats.wisdom + levelBonus : migratedHero.stats.wisdom,
        charisma: needsCharisma ? currentClass.baseStats.charisma + levelBonus : migratedHero.stats.charisma,
      }
    }

    return migratedHero
  }

  // If already fully migrated (has slots, no legacy fields), just ensure stats
  if (hasSlots && !hasLegacyEquipment && !hasLegacyConsumables) {
    const migratedHero = {
      ...hero,
      activeEffects: hero.activeEffects || [],
    }
    
    // Add wisdom and charisma if missing (from old saves)
    const needsWisdom = migratedHero.stats.wisdom == null || isNaN(migratedHero.stats.wisdom)
    const needsCharisma = migratedHero.stats.charisma == null || isNaN(migratedHero.stats.charisma)

    if (needsWisdom || needsCharisma) {
      // Get current class definition (in case old hero has outdated class data)
      const currentClass = getClassById(hero.class.id) || hero.class
      const levelBonus = (hero.level - 1) * 5
      migratedHero.class = currentClass
      migratedHero.stats = {
        ...migratedHero.stats,
        wisdom: needsWisdom ? currentClass.baseStats.wisdom + levelBonus : migratedHero.stats.wisdom,
        charisma: needsCharisma ? currentClass.baseStats.charisma + levelBonus : migratedHero.stats.charisma,
      }
    }
    
    return migratedHero
  }
  
  // Full migration from legacy format
  // Initialize all slots as empty
  const slots: Record<string, Item | Consumable | null> = {}
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
  
  // Return migrated hero with new slots system
  // Keep legacy fields as backup (don't delete them)
  const migratedHero = {
    ...hero,
    slots,
    activeEffects: hero.activeEffects || [], // Ensure activeEffects exists
  }
  
  // Add wisdom and charisma if missing (from old saves)
  const needsWisdom = migratedHero.stats.wisdom == null || isNaN(migratedHero.stats.wisdom)
  const needsCharisma = migratedHero.stats.charisma == null || isNaN(migratedHero.stats.charisma)

  // Get current class definition (in case old hero has outdated class data)
  const currentClass = getClassById(hero.class.id) || hero.class
  const levelBonus = (hero.level - 1) * 5

  migratedHero.class = currentClass
  migratedHero.stats = {
    ...migratedHero.stats,
    wisdom: needsWisdom ? currentClass.baseStats.wisdom + levelBonus : migratedHero.stats.wisdom,
    charisma: needsCharisma ? currentClass.baseStats.charisma + levelBonus : migratedHero.stats.charisma,
  }
  
  return migratedHero
}

/**
 * Migrate an array of heroes
 */
export function migrateHeroArray(heroes: (Hero | null)[]): (Hero | null)[] {
  return heroes.map(hero => hero ? migrateHeroSlots(hero) : null)
}
