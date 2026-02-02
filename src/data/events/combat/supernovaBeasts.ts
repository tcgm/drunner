import type { DungeonEvent } from '@/types'
import { GiFlame } from 'react-icons/gi'

export const SUPERNOVA_BEASTS: DungeonEvent = {
  id: 'supernova-beasts',
  type: 'combat',
  title: 'Supernova Beasts',
  description: 'Creatures containing stellar cores ready to explode!',
  choices: [
    {
      text: 'Trigger detonation',
      outcome: {
        text: 'The explosion is catastrophic!',
        effects: [
          { type: 'damage', target: 'all', value: 100 },
          { type: 'xp', value: 510 },
          { type: 'gold', value: 390 },
        ],
      },
    },
    {
      text: 'Contain the blast (Defense check)',
      requirements: { stat: 'defense', minValue: 148 },
      outcome: {
        text: 'You shield yourself from the explosion!',
        effects: [
          { type: 'damage', target: 'all', value: 89 },
          { type: 'xp', value: 530 },
          { type: 'gold', value: 400 },
        ],
      },
    },
  ],
  depth: 70,
  icon: GiFlame,
}
