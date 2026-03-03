import emberbladeIcon from '@/assets/icons/items/emberblade.svg'
import type { Item } from '@/types'
import type { UniqueEffectDefinition } from '@/systems/items/uniqueEffects'

/**
 * Emberblade - Legendary fire sword
 *
 * On each basic attack the wielder applies a stacking Burning DoT to the boss.
 * The actual in-combat DoT is applied by executeAttack (heroActions.ts) which
 * checks for this item in the hero's weapon slot.
 * The uniqueEffect here is used for out-of-combat display / event system.
 */
export const EMBERBLADE: Omit<Item, 'id'> & { uniqueEffect?: UniqueEffectDefinition } = {
  name: 'Emberblade',
  description: 'A blade whose edge burns with unquenchable fire. Each strike fans the flames higher, building an inferno that consumes everything it touches.',
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'epic',
  maxRarity: 'artifact',
  icon: emberbladeIcon,
  stats: {
    attack: 135,
    magicPower: 45,
    speed: 20,
    luck: 10,
  },
  value: 13000,
  uniqueEffect: {
    triggers: ['onDamageDealt'],
    description: 'Inferno: Each basic attack applies 1 stack of Burning to the boss (15 dmg/turn per stack, stacks refresh to 3 rounds)',
    handler: (_context) => {
      // Out-of-combat / event system: no additional effect beyond normal damage.
      // The in-combat burning DoT is handled in executeAttack (heroActions.ts).
      return null
    },
  },
}
