import { GiKatana } from 'react-icons/gi'
import type { Item } from '@/types'
import type { UniqueEffectDefinition } from '@/systems/items/uniqueEffects'

/**
 * Kitsune's Bite - Set weapon
 * 
 * When this specific piece rolls as unique, it has a custom effect
 * that overrides the set-wide effect defined in effects.ts
 */
export const KITSUNE_BITE: Omit<Item, 'id'> & { uniqueEffect?: UniqueEffectDefinition } = {
  name: "Kitsune's Bite",
  description: 'A blade forged by the nine-tailed fox spirits. Gleams with ethereal fox fire.',
  type: 'weapon',
  rarity: 'epic',
  icon: GiKatana,
  stats: {
    attack: 110,
    speed: 30,
    luck: 15,
  },
  value: 8000,
  
  // Optional: Define a unique effect specific to this piece when it rolls as unique
  // If not defined, will use the set-wide effect from effects.ts
  // Uncomment to enable:
  /*
  uniqueEffect: {
    triggers: ['onDamageDealt'],
    description: 'Fox Bite: 15% chance to deal +30% damage',
    handler: (context) => {
      const { party, sourceHero, damageAmount } = context
      
      if (!sourceHero || !sourceHero.isAlive || !damageAmount) {
        return null
      }
      
      // 15% chance to trigger
      if (Math.random() > 0.15) {
        return null
      }
      
      const bonusDamage = Math.floor(damageAmount * 0.3)
      
      return {
        party,
        message: `${sourceHero.name}'s Fox Bite strikes with +${bonusDamage} bonus damage!`,
        additionalEffects: [{
          type: 'damage',
          target: [sourceHero.id],
          value: bonusDamage,
          description: `Fox Bite adds ${bonusDamage} bonus damage!`
        }]
      }
    }
  }
  */
}
