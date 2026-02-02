import type { DungeonEvent } from '@/types'
import { GiFleshyMass } from 'react-icons/gi'

export const CARRION_BEASTS: DungeonEvent = {
  id: 'carrion-beasts',
  type: 'combat',
  title: 'Carrion Beasts',
  description: 'Grotesque creatures stitched together from corpses attack hungrily!',
  choices: [
    {
      text: 'Hack them apart',
      outcome: {
        text: 'You dismember the abominations!',
        effects: [
          { type: 'damage', target: 'weakest', value: 22 },
          { type: 'xp', value: 84 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Cleave through (Strength check)',
      requirements: { stat: 'strength', minValue: 32 },
      outcome: {
        text: 'You split them with powerful strikes!',
        effects: [
          { type: 'damage', target: 'weakest', value: 15 },
          { type: 'xp', value: 94 },
          { type: 'gold', value: 58 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiFleshyMass,
}
