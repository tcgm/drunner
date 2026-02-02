import type { DungeonEvent } from '@/types'
import { GiFrozenOrb } from 'react-icons/gi'

export const ICE_WRAITH: DungeonEvent = {
  id: 'ice-wraith',
  type: 'boss',
  title: 'Ice Wraith',
  description: 'A ghostly figure of frost and mist drifts through the frozen chamber. Its touch brings death by freezing, and the temperature drops with each breath.',
  choices: [
    {
      text: 'Fight in the cold',
      outcome: {
        text: 'Your movements slow in the frigid air! Frostbite sets in quickly!',
        effects: [
          { type: 'damage', target: 'all', value: 68 },
          { type: 'xp', value: 315 },
          { type: 'gold', value: 415 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 13 },
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
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
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
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiFrozenOrb,
}
