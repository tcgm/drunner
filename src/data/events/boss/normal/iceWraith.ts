import type { DungeonEvent } from '@/types'
import { GiFrozenOrb } from 'react-icons/gi'

export const FROST_WRAITH_KING: DungeonEvent = {
  id: 'frost-wraith-king',
  type: 'boss',
  title: 'Frost Wraith King',
  description: 'The sovereign of all frost spirits, this ancient wraith commands legions of lesser spirits. Its presence creates blizzards, and its touch can freeze souls themselves. Centuries of haunting have made it immensely powerful.',
  choices: [
    {
      text: 'Fight in the cold',
      outcome: {
        text: 'Your movements slow in the frigid air! Frostbite sets in quickly!',
        effects: [
          { type: 'damage', target: 'all', value: 68 },
          { type: 'xp', value: 315 },
          { type: 'gold', value: 415 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Use fire magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Flames melt the wraith! It screams as it evaporates!',
        effects: [
          { type: 'damage', target: 'all', value: 50 },
          { type: 'xp', value: 360 },
          { type: 'gold', value: 470 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Resist the cold (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 17,
      },
      outcome: {
        text: 'Your constitution withstands the freezing! You shatter the wraith!',
        effects: [
          { type: 'damage', target: 'all', value: 53 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 460 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 16 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiFrozenOrb,
}
