import type { Hero, Item, ItemSlot } from '@/types'

/**
 * Check if a hero can equip an item in a specific slot
 */
export function canEquipItem(_hero: Hero, item: Item, slot: ItemSlot): boolean {
  // Check if item type matches the slot
  const slotTypeMap: Record<ItemSlot, ItemSlot[]> = {
    weapon: ['weapon'],
    armor: ['armor'],
    helmet: ['helmet'],
    boots: ['boots'],
    accessory1: ['accessory1', 'accessory2'],
    accessory2: ['accessory1', 'accessory2'],
  }

  return slotTypeMap[slot]?.includes(item.type) ?? false
}

/**
 * Equip an item to a hero
 */
export function equipItem(hero: Hero, item: Item, slot: ItemSlot): Hero {
  if (!canEquipItem(hero, item, slot)) {
    return hero
  }

  const updatedHero = { ...hero }
  updatedHero.equipment = { ...hero.equipment }
  
  // Equip new item (old item is automatically replaced)
  updatedHero.equipment[slot] = item
  
  // Recalculate stats
  updatedHero.stats = calculateStatsWithEquipment(updatedHero)
  
  return updatedHero
}

/**
 * Unequip an item from a hero
 */
export function unequipItem(hero: Hero, slot: ItemSlot): { hero: Hero; item: Item | null } {
  const item = hero.equipment[slot] ?? null
  
  const updatedHero = { ...hero }
  updatedHero.equipment = { ...hero.equipment }
  updatedHero.equipment[slot] = null
  
  // Recalculate stats
  updatedHero.stats = calculateStatsWithEquipment(updatedHero)
  
  return { hero: updatedHero, item }
}

/**
 * Calculate hero stats including equipment bonuses
 */
export function calculateStatsWithEquipment(hero: Hero) {
  const baseStats = { ...hero.stats }
  
  // Start with base stats (without equipment)
  const levelBonus = (hero.level - 1) * 5
  const stats = {
    hp: baseStats.hp, // Keep current HP
    maxHp: 50 + (hero.level * 10) + (hero.class.baseStats.defense * 5),
    attack: hero.class.baseStats.attack + levelBonus,
    defense: hero.class.baseStats.defense + levelBonus,
    speed: hero.class.baseStats.speed + levelBonus,
    luck: hero.class.baseStats.luck + levelBonus,
    magicPower: hero.class.baseStats.magicPower 
      ? hero.class.baseStats.magicPower + levelBonus 
      : undefined,
  }
  
  // Add equipment bonuses
  Object.values(hero.equipment).forEach(item => {
    if (item?.stats) {
      if (item.stats.attack) stats.attack += item.stats.attack
      if (item.stats.defense) stats.defense += item.stats.defense
      if (item.stats.speed) stats.speed += item.stats.speed
      if (item.stats.luck) stats.luck += item.stats.luck
      if (item.stats.maxHp) stats.maxHp += item.stats.maxHp
      if (item.stats.magicPower && stats.magicPower !== undefined) {
        stats.magicPower += item.stats.magicPower
      }
    }
  })
  
  // Ensure HP doesn't exceed new maxHp
  stats.hp = Math.min(stats.hp, stats.maxHp)
  
  return stats
}

/**
 * Sell an item for gold
 */
export function sellItem(item: Item): number {
  return item.value
}

/**
 * Determine which item is better for a slot
 */
export function getBestItemForSlot(
  currentItem: Item | null,
  newItem: Item
): Item {
  if (!currentItem) return newItem
  
  // Simple comparison: sum of all stat values
  const currentPower = Object.values(currentItem.stats || {}).reduce((sum, val) => sum + (val || 0), 0)
  const newPower = Object.values(newItem.stats || {}).reduce((sum, val) => sum + (val || 0), 0)
  
  return newPower > currentPower ? newItem : currentItem
}
