import type { DungeonEvent } from '@/types'
import { GiShamblingZombie } from 'react-icons/gi'

export const BLOATED_GHOULS: DungeonEvent = {
  id: 'bloated-ghouls',
  type: 'combat',
  title: 'Bloated Ghouls',
  description: 'Rotting corpses stumble forward, reeking of decay!',
  choices: [
    {
      text: 'Strike them down',
      outcome: {
        text: 'You fight through the undead!',
        effects: [
          { type: 'damage', target: 'random', value: 11 },
          { type: 'xp', value: 38 },
          { type: 'gold', value: 19 },
        ],
      },
    },
    {
      text: 'Target weak points (Precision)',
      requirements: { stat: 'speed', minValue: 11 },
      outcome: {
        text: 'You strike critical spots, felling them quickly!',
        effects: [
          { type: 'damage', target: 'random', value: 7 },
          { type: 'xp', value: 48 },
          { type: 'gold', value: 27 },
        ],
      },
    },
    {
      text: 'Holy strike (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine power sears the undead!',
        effects: [
          { type: 'damage', target: 'random', value: 4 },
          { type: 'xp', value: 52 },
          { type: 'gold', value: 32 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiShamblingZombie,
}
