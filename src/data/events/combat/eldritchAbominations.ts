import type { DungeonEvent } from '@/types'
import { GiCrackedAlienSkull } from 'react-icons/gi'

export const ELDRITCH_ABOMINATIONS: DungeonEvent = {
  id: 'eldritch-abominations',
  type: 'combat',
  title: 'Eldritch Abominations',
  description: 'Beings so alien they defy comprehension attack with impossible geometries!',
  choices: [
    {
      text: 'Confront the unknown',
      outcome: {
        text: 'Sanity-breaking forms twist reality!',
        effects: [
          { type: 'damage', target: 'all', value: 85 },
          { type: 'xp', value: 445 },
          { type: 'gold', value: 325 },
        ],
      },
    },
    {
      text: 'Faith protects (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine certainty shields your mind!',
        effects: [
          { type: 'damage', target: 'all', value: 74 },
          { type: 'xp', value: 465 },
          { type: 'gold', value: 345 },
        ],
      },
    },
  ],
  depth: 60,
  icon: GiCrackedAlienSkull,
}
