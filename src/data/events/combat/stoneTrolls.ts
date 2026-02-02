import type { DungeonEvent } from '@/types'
import { GiMountains } from 'react-icons/gi'

export const STONE_TROLLS: DungeonEvent = {
  id: 'stone-trolls',
  type: 'combat',
  title: 'Stone Trolls',
  description: 'Massive trolls with rock-hard skin smash everything!',
  choices: [
    {
      text: 'Fight them head-on',
      outcome: {
        text: 'Their fists hit like boulders!',
        effects: [
          { type: 'damage', target: 'all', value: 31 },
          { type: 'xp', value: 128 },
          { type: 'gold', value: 80 },
        ],
      },
    },
    {
      text: 'Dodge and strike (Speed check)',
      requirements: { stat: 'speed', minValue: 42 },
      outcome: {
        text: 'You use their size against them!',
        effects: [
          { type: 'damage', target: 'all', value: 21 },
          { type: 'xp', value: 143 },
          { type: 'gold', value: 91 },
        ],
      },
    },
  ],
  depth: 20,
  icon: GiMountains,
}
