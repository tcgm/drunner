import type { DungeonEvent } from '@/types'
import { GiSpikedDragonHead } from 'react-icons/gi'

export const DRAKE_SPAWN: DungeonEvent = {
  id: 'drake-spawn',
  type: 'combat',
  title: 'Drake Spawn',
  description: 'Young dragonlings breathe gouts of flame!',
  choices: [
    {
      text: 'Engage them',
      outcome: {
        text: 'You fight through the fire!',
        effects: [
          { type: 'damage', target: 'all', value: 17 },
          { type: 'xp', value: 74 },
          { type: 'gold', value: 44 },
        ],
      },
    },
    {
      text: 'Shield from flames (Defense check)',
      requirements: { stat: 'defense', minValue: 32 },
      outcome: {
        text: 'You block their breath attacks!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 89 },
          { type: 'gold', value: 54 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiSpikedDragonHead,
}
