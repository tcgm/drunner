import type { DungeonEvent } from '@/types'
import { GiMeditation } from 'react-icons/gi'

export const MEDITATION_CHAMBER: DungeonEvent = {
  id: 'meditation-chamber',
  type: 'rest',
  title: 'Meditation Chamber',
  description: 'A serene chamber with ancient meditative symbols on the walls.',
  choices: [
    {
      text: 'Meditate deeply',
      outcome: {
        text: 'Your mind clears and you feel refreshed.',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Pray for guidance (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine energy fills the chamber and heals your wounds!',
        effects: [
          { type: 'heal', target: 'all', value: 100 },
          { type: 'xp', value: 60 },
        ],
      },
    },
    {
      text: 'Study the symbols',
      outcome: {
        text: 'You learn something about the dungeon\'s history.',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Continue without stopping',
      outcome: {
        text: 'You press forward without rest.',
        effects: [],
      },
    },
  ],
  depth: 2,
  icon: GiMeditation,
}
