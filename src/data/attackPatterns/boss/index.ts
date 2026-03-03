/**
 * Boss Attack Patterns
 * 
 * Different attack types bosses can use on their turn.
 * Patterns have weights for probability and can have conditions.
 * 
 * Attack Types:
 * - single: Target one hero (normal/crit damage)
 * - aoe: Hit all heroes with reduced damage
 * - multi: Hit multiple random heroes (can hit same hero multiple times)
 * - cleave: Hit frontline heroes (positional)
 */

export { HEAVY_STRIKE } from './heavyStrike'
export { WHIRLWIND } from './whirlwind'
export { RAPID_STRIKES } from './rapidStrikes'
export { EXECUTE } from './execute'
