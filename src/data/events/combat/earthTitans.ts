import type { DungeonEvent } from '@/types'
import { GiStoneGolem } from 'react-icons/gi'

export const EARTH_TITANS: DungeonEvent = {
  id: 'earth-titans',
  type: 'combat',
  title: 'Earth Titans',
  description: 'Massive stone behemoths shake the ground with every step!',
  choices: [
    {
      text: 'Strike their legs',
      outcome: {
        text: 'You chip away at solid rock!',
        effects: [
          { type: 'damage', target: 'all', value: 22 },
          { type: 'xp', value: 110 },
          { type: 'gold', value: 68 },
        ],
      },
    },
    {
      text: 'Topple them (Strength check)',
      requirements: { stat: 'strength', minValue: 55 },
      outcome: {
        text: 'You bring them crashing down!',
        effects: [
          { type: 'damage', target: 'all', value: 16 },
          { type: 'xp', value: 130 },
          { type: 'gold', value: 83 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiStoneGolem,
}
