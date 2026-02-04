/**
 * Consumable potency - affects concentration/quality of the potion
 * This is separate from size (which is physical quantity)
 */
export interface ConsumablePotency {
  id: string
  name: string
  prefix: string // Name prefix (e.g., "Weak", "Potent")
  multiplier: number // Multiplier for effect value
  valueMultiplier: number // Multiplier for gold value
}
