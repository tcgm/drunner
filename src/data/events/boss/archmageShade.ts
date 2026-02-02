import type { DungeonEvent } from '@/types'
import { GiSpellBook } from 'react-icons/gi'

export const ARCHMAGE_SHADE: DungeonEvent = {
  id: 'archmage-shade',
  type: 'boss',
  title: 'Archmage Shade',
  description: 'The ghost of a legendary wizard. Even in death, its mastery of magic surpasses any living mage.',
  choices: [
    {
      text: 'Tank the spells',
      outcome: {
        text: 'Spell after spell of legendary power! You\'re overwhelmed!',
        effects: [
          { type: 'damage', target: 'all', value: 465 },
          { type: 'xp', value: 1910 },
          { type: 'gold', value: 2865 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Learn and adapt (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You absorb the shade\'s knowledge! Its own spells teach you victory!',
        effects: [
          { type: 'damage', target: 'all', value: 402 },
          { type: 'xp', value: 2040 },
          { type: 'gold', value: 3060 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
    {
      text: 'Disperse the shade (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 73,
      },
      outcome: {
        text: 'You see through its ethereal nature! The shade dissipates!',
        effects: [
          { type: 'damage', target: 'all', value: 415 },
          { type: 'xp', value: 2065 },
          { type: 'gold', value: 3098 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
  ],
  depth: 67,
  icon: GiSpellBook,
}
