import type { DungeonEvent } from '@/types'
import { GiFist } from 'react-icons/gi'

export const BRAWLER_GOLEMS: DungeonEvent = {
  id: 'brawler-golems',
  type: 'combat',
  title: 'Brawler Golems',
  description: 'Stone constructs programmed for hand-to-hand combat!',
  choices: [
    {
      text: 'Trade blows',
      outcome: {
        text: 'Their fists hit like hammers!',
        effects: [
          { type: 'damage', target: 'strongest', value: 62 },
          { type: 'xp', value: 308 },
          { type: 'gold', value: 223 },
        ],
      },
    },
    {
      text: 'Counter technique (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Superior skill wins!',
        effects: [
          { type: 'damage', target: 'strongest', value: 51 },
          { type: 'xp', value: 328 },
          { type: 'gold', value: 243 },
        ],
      },
    },
  ],
  depth: 54,
  icon: GiFist,
}
