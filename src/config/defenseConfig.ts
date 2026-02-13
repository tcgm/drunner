/**
 * Defense Curve Configuration
 * 
 * This file defines the defense-to-block-percentage conversion curve.
 * The maxDefense value is calculated by scripts/calculate-max-defense.mjs
 * based on all items, rarities, and sets in the game.
 * 
 * To recalculate maxDefense after adding new items or changing defense values:
 * npm run calculate-max-defense
 */

export interface DefenseConfig {
  /**
   * Curve type for defense -> block % conversion
   * - 'linear': Simple linear scaling (not recommended, reaches cap too quickly)
   * - 'diminishing': Hyperbolic curve (defense / (defense + constant))
   * - 'logarithmic': Log-based curve with smooth scaling
   * - 'exponential': Exponential decay toward cap (1 - e^(-k*defense))
   */
  curveType: 'linear' | 'diminishing' | 'logarithmic' | 'exponential'
  
  /**
   * Minimum block percentage (at 0 defense)
   * Default: 0 (0%)
   */
  minBlockPercent: number
  
  /**
   * Maximum block percentage cap (asymptotic limit)
   * Default: 0.95 (95%)
   */
  maxBlockPercent: number
  
  /**
   * Theoretical maximum defense a hero can achieve
   * This is calculated by scripts/calculate-max-defense.mjs
   * based on best-in-slot items at highest rarity with all set bonuses
   * 
   * DO NOT manually edit this value - run npm run calculate-max-defense
   */
  maxDefense: number
  
  /**
   * Defense value at which 50% of max block is reached (midpoint)
   * For diminishing curve: this is the constant in defense/(defense+k)
   * For logarithmic curve: controls the steepness of the curve
   * For exponential curve: k = -ln(0.5) / midpointDefense
   * 
   * Set this as a percentage of maxDefense (e.g., 0.4 = 40% of max defense)
   */
  midpointDefenseRatio: number
  
  /**
   * Curve steepness modifier
   * Higher = steeper curve (reaches cap faster)
   * Lower = gentler curve (more gradual scaling)
   * Default: 1.0
   */
  curveModifier: number
}

/**
 * Current defense configuration
 * 
 * Default settings:
 * - Logarithmic curve for smooth, natural-feeling progression
 * - 0% minimum (no block at 0 defense)
 * - 95% maximum (always some risk)
 * - 50% cap reached at 40% of theoretical max
 */
export const DEFENSE_CONFIG: DefenseConfig = {
  curveType: 'logarithmic',
  minBlockPercent: 0.0,
  maxBlockPercent: 0.95,
  
  // This value is auto-calculated by scripts/calculate-max-defense.mjs
  // Last calculated: 2/12/2026, 8:43:51 PM
  maxDefense: 33760, // Auto-calculated: 2026-02-13
  
  midpointDefenseRatio: 0.4, // 50% of max block reached at 40% of max defense
  curveModifier: 1.0,
}

/**
 * Calculate block percentage from defense value using configured curve
 * 
 * @param defense - Current defense stat
 * @returns Block percentage (0.0 to maxBlockPercent)
 */
export function calculateBlockPercent(defense: number): number {
  if (defense <= 0) return DEFENSE_CONFIG.minBlockPercent
  
  const config = DEFENSE_CONFIG
  const range = config.maxBlockPercent - config.minBlockPercent
  const midpointDefense = config.maxDefense * config.midpointDefenseRatio
  
  let normalized: number
  
  switch (config.curveType) {
    case 'linear':
      // Simple linear: defense / maxDefense
      normalized = Math.min(defense / config.maxDefense, 1.0)
      break
      
    case 'diminishing': {
      // Hyperbolic: defense / (defense + k)
      // where k is chosen so 50% is reached at midpointDefense
      const k = midpointDefense
      normalized = defense / (defense + k)
      break
    }
      
    case 'logarithmic': {
      // Logarithmic: ln(1 + defense/k) / ln(1 + maxDefense/k)
      // where k is chosen so 50% is reached at midpointDefense
      const logK = midpointDefense * config.curveModifier
      normalized = Math.log(1 + defense / logK) / Math.log(1 + config.maxDefense / logK)
      break
    }
      
    case 'exponential': {
      // Exponential: 1 - e^(-k * defense)
      // where k = ln(2) / midpointDefense (so 50% at midpoint)
      const expK = Math.log(2) / midpointDefense * config.curveModifier
      normalized = 1 - Math.exp(-expK * defense)
      break
    }
      
    default:
      normalized = 0
  }
  
  // Apply curve modifier (allows fine-tuning without changing curve type)
  normalized = Math.pow(normalized, 1 / config.curveModifier)
  
  // Scale to configured range and clamp
  const blockPercent = config.minBlockPercent + normalized * range
  return Math.min(Math.max(blockPercent, config.minBlockPercent), config.maxBlockPercent)
}

/**
 * Format block percentage as a readable string
 * 
 * @param defense - Current defense stat
 * @returns Formatted string like "42.5%" or "0%"
 */
export function formatBlockPercent(defense: number): string {
  const percent = calculateBlockPercent(defense) * 100
  return `${percent.toFixed(1)}%`
}

/**
 * Get defense value needed to reach a specific block percentage
 * Useful for balancing and understanding the curve
 * 
 * @param targetPercent - Target block percentage (0.0 to 1.0)
 * @returns Defense value needed
 */
export function getDefenseForBlockPercent(targetPercent: number): number {
  const config = DEFENSE_CONFIG
  const range = config.maxBlockPercent - config.minBlockPercent
  const normalized = (targetPercent - config.minBlockPercent) / range
  
  if (normalized <= 0) return 0
  if (normalized >= 1) return config.maxDefense
  
  const midpointDefense = config.maxDefense * config.midpointDefenseRatio
  
  switch (config.curveType) {
    case 'linear':
      return normalized * config.maxDefense
      
    case 'diminishing': {
      const k = midpointDefense
      return (normalized * k) / (1 - normalized)
    }
      
    case 'logarithmic': {
      const logK = midpointDefense * config.curveModifier
      const maxTerm = Math.log(1 + config.maxDefense / logK)
      return logK * (Math.exp(normalized * maxTerm) - 1)
    }
      
    case 'exponential': {
      const expK = Math.log(2) / midpointDefense * config.curveModifier
      return -Math.log(1 - normalized) / expK
    }
      
    default:
      return 0
  }
}
