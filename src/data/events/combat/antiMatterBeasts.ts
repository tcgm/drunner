import type { DungeonEvent } from '@/types'
import { GiMatterStates } from 'react-icons/gi'

export const ANTI_MATTER_BEASTS: DungeonEvent = {
  id: 'anti-matter-beasts',
  type: 'combat',
  title: 'Anti-Matter Beasts',
  description: 'Creatures made of antimatter that annihilate upon contact!',
  choices: [
    {
      text: 'Strike carefully',
      outcome: {
        text: 'Massive explosions occur!',
        effects: [
          { type: 'damage', target: 'strongest', value: 153 },
          { type: 'xp', value: 818 },
          { type: 'gold', value: 632 },
        ],
      },
    },
    {
      text: 'Use containment field (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic prevents annihilation!',
        effects: [
          { type: 'damage', target: 'strongest', value: 142 },
          { type: 'xp', value: 838 },
          { type: 'gold', value: 652 },
        ],
      },
    },
  ],
  depth: 86,
  icon: GiMatterStates,
}
