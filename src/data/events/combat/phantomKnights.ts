import type { DungeonEvent } from '@/types'
import { GiSpectralTear } from 'react-icons/gi'

export const PHANTOM_KNIGHTS: DungeonEvent = {
  id: 'phantom-knights',
  type: 'combat',
  title: 'Phantom Knights',
  description: 'Ghostly warriors in ancient armor materialize from the walls!',
  choices: [
    {
      text: 'Fight the phantoms',
      outcome: {
        text: 'Your weapons pass through them partially!',
        effects: [
          { type: 'damage', target: 'random', value: 21 },
          { type: 'xp', value: 82 },
          { type: 'gold', value: 49 },
        ],
      },
    },
    {
      text: 'Blessed weapons (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy power makes them corporeal!',
        effects: [
          { type: 'damage', target: 'random', value: 14 },
          { type: 'xp', value: 97 },
          { type: 'gold', value: 59 },
        ],
      },
    },
    {
      text: 'Exploit weaknesses (Defense check)',
      requirements: { stat: 'defense', minValue: 35 },
      outcome: {
        text: 'You anticipate their ethereal strikes!',
        effects: [
          { type: 'damage', target: 'random', value: 16 },
          { type: 'xp', value: 92 },
          { type: 'gold', value: 57 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiSpectralTear,
}
