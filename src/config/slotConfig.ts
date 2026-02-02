/**
 * Centralized slot configuration for hero equipment and consumables
 * This defines the canonical slot layout for all heroes
 */

export interface SlotDefinition {
  id: string
  name: string
  category: 'equipment' | 'consumable'
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'consumable' | 'offhand' | 'belt' | 'cloak' | 'gloves'
  enabled: boolean // Can be disabled for future features
  sortOrder: number
}

/**
 * All available slots in the game
 * Adding new slots here automatically makes them available to all heroes
 */
export const SLOT_DEFINITIONS: SlotDefinition[] = [
  // Core equipment slots
  { id: 'weapon', name: 'Weapon', category: 'equipment', type: 'weapon', enabled: true, sortOrder: 1 },
  { id: 'armor', name: 'Armor', category: 'equipment', type: 'armor', enabled: true, sortOrder: 2 },
  { id: 'helmet', name: 'Helmet', category: 'equipment', type: 'helmet', enabled: true, sortOrder: 3 },
  { id: 'boots', name: 'Boots', category: 'equipment', type: 'boots', enabled: true, sortOrder: 4 },
  { id: 'accessory1', name: 'Accessory 1', category: 'equipment', type: 'accessory', enabled: true, sortOrder: 5 },
  { id: 'accessory2', name: 'Accessory 2', category: 'equipment', type: 'accessory', enabled: true, sortOrder: 6 },
  
  // Stretch goal equipment slots (disabled for now)
  { id: 'offhand', name: 'Offhand', category: 'equipment', type: 'offhand', enabled: false, sortOrder: 7 },
  { id: 'belt', name: 'Belt', category: 'equipment', type: 'belt', enabled: false, sortOrder: 8 },
  { id: 'cloak', name: 'Cloak', category: 'equipment', type: 'cloak', enabled: false, sortOrder: 9 },
  { id: 'gloves', name: 'Gloves', category: 'equipment', type: 'gloves', enabled: false, sortOrder: 10 },
  
  // Consumable slots
  { id: 'consumable1', name: 'Consumable 1', category: 'consumable', type: 'consumable', enabled: true, sortOrder: 11 },
  { id: 'consumable2', name: 'Consumable 2', category: 'consumable', type: 'consumable', enabled: true, sortOrder: 12 },
  { id: 'consumable3', name: 'Consumable 3', category: 'consumable', type: 'consumable', enabled: true, sortOrder: 13 },
]

/**
 * Get all enabled slots
 */
export function getEnabledSlots(): SlotDefinition[] {
  return SLOT_DEFINITIONS.filter(slot => slot.enabled)
}

/**
 * Get enabled slots by category
 */
export function getSlotsByCategory(category: 'equipment' | 'consumable'): SlotDefinition[] {
  return SLOT_DEFINITIONS.filter(slot => slot.enabled && slot.category === category)
}

/**
 * Get slot definition by ID
 */
export function getSlotById(id: string): SlotDefinition | undefined {
  return SLOT_DEFINITIONS.find(slot => slot.id === id)
}

/**
 * Get all equipment slot IDs (enabled only)
 */
export function getEquipmentSlotIds(): string[] {
  return getSlotsByCategory('equipment').map(slot => slot.id)
}

/**
 * Get all consumable slot IDs (enabled only)
 */
export function getConsumableSlotIds(): string[] {
  return getSlotsByCategory('consumable').map(slot => slot.id)
}

/**
 * Check if a slot ID is valid and enabled
 */
export function isValidSlot(slotId: string): boolean {
  const slot = getSlotById(slotId)
  return slot !== undefined && slot.enabled
}

/**
 * Check if a slot accepts a specific item type
 */
export function slotAcceptsItemType(slotId: string, itemType: string): boolean {
  const slot = getSlotById(slotId)
  if (!slot || !slot.enabled) return false
  
  // Consumable slots accept any item type (for now)
  if (slot.category === 'consumable') return true
  
  // Accessory slots can accept any accessory
  if (slot.type === 'accessory' && (itemType === 'accessory1' || itemType === 'accessory2')) {
    return true
  }
  
  // Otherwise, types must match
  return slot.type === itemType
}
