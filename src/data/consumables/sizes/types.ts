/**
 * Consumable size - affects potency
 */
export interface ConsumableSize {
  id: string
  name: string
  prefix: string // Name prefix (e.g., "Small", "Greater")
  multiplier: number // Multiplier for base value
  valueMultiplier: number // Multiplier for gold value
}
