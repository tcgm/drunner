import type { DungeonEvent } from '@/types'
import { GiSnail } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const ACID_SLUGS: DungeonEvent = {
  id: 'acid-slugs',
  type: 'combat',
  tags: [TAGS.OOZE, TAGS.ACID, TAGS.SWAMP, TAGS.CAVE],
  title: 'Acid Slugs',
  description: 'Giant gastropods leave trails of corrosive slime!',
  choices: [
    {
      text: 'Step carefully',
      outcome: {
        text: 'The acid dissolves your boots!',
        effects: [
          { type: 'damage', target: 'weakest', value: 20 },
          { type: 'xp', value: 89 },
          { type: 'gold', value: 54 },
        ],
      },
    },
    {
      text: 'Salt them (Strength check)',
      requirements: { stat: 'attack', minValue: 31 },
      outcome: {
        text: 'They shrivel harmlessly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 15 },
          { type: 'xp', value: 104 },
          { type: 'gold', value: 64 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiSnail,
}
