import type { DungeonEvent } from '@/types'
import { GiAbstract112 } from 'react-icons/gi'

export const PARADOX_ENTITIES: DungeonEvent = {
  id: 'paradox-entities',
  type: 'combat',
  title: 'Paradox Entities',
  description: 'Impossible beings that exist and do not exist!',
  choices: [
    {
      text: 'Accept the paradox',
      outcome: {
        text: 'Logic tears at your mind!',
        effects: [
          { type: 'damage', target: 'strongest', value: 141 },
          { type: 'xp', value: 753 },
          { type: 'gold', value: 582 },
        ],
      },
    },
    {
      text: 'Resolve the paradox (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You force them to choose!',
        effects: [
          { type: 'damage', target: 'strongest', value: 130 },
          { type: 'xp', value: 773 },
          { type: 'gold', value: 602 },
        ],
      },
    },
  ],
  depth: 83,
  icon: GiAbstract112,
}
