import type { DungeonEvent } from '@/types'
import { GiPublicSpeaker } from 'react-icons/gi'

export const CHARISMATIC_LEADER: DungeonEvent = {
  id: 'charismatic-leader',
  type: 'choice',
  title: 'Dungeon Denizens',
  description: 'A group of lost dungeon creatures looks to you for leadership. They seem willing to follow orders.',
  choices: [
    {
      text: 'Rally them to your cause (Charisma check)',
      requirements: { stat: 'charisma', minValue: 22 },
      outcome: {
        text: 'Your inspiring words win their loyalty! They fight alongside you.',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 100 },
        ],
      },
    },
    {
      text: 'Command them without authority',
      outcome: {
        text: 'They attack you for your arrogance!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Offer them gold for assistance',
      requirements: { gold: 80 },
      outcome: {
        text: 'They accept your payment and help clear the path.',
        effects: [
          { type: 'gold', value: -80 },
          { type: 'xp', value: 90 },
        ],
      },
    },
    {
      text: 'Leave them be',
      outcome: {
        text: 'You move on without their help.',
        effects: [],
      },
    },
  ],
  depth: 18,
  icon: GiPublicSpeaker,
}
