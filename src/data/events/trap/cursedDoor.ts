import type { DungeonEvent } from '@/types'
import { GiDoorHandle } from 'react-icons/gi'

export const CURSED_DOOR: DungeonEvent = {
  id: 'cursed-door',
  type: 'trap',
  title: 'Cursed Door',
  description: 'A door covered in dark runes pulses with malevolent energy.',
  choices: [
    {
      text: 'Break the curse (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your holy power shatters the curse!',
        effects: [
          { type: 'xp', value: 90 },
        ],
      },
    },
    {
      text: 'Open the door carefully',
      outcome: {
        text: 'The curse activates but you resist most of it!',
        effects: [
          { type: 'damage', target: 'random', value: 15 },
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Kick the door down',
      outcome: {
        text: 'The curse explodes! Dark energy engulfs you!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
        ],
      },
    },
    {
      text: 'Find another entrance',
      outcome: {
        text: 'You search and find an uncursed side door.',
        effects: [
          { type: 'xp', value: 25 },
        ],
      },
    },
  ],
  depth: 4,
  icon: GiDoorHandle,
}
