import type { DungeonEvent } from '@/types'
import { GiBlackHoleBolas } from 'react-icons/gi'

export const SINGULARITY: DungeonEvent = {
  id: 'singularity',
  type: 'boss',
  title: 'Singularity',
  description: 'A collapsed star given awareness. Its gravity crushes all matter. Light cannot escape. Nothing can resist its pull.',
  choices: [
    {
      text: 'Resist the pull',
      outcome: {
        text: 'Irresistible gravity! You\'re crushed into infinitesimal density!',
        effects: [
          { type: 'damage', target: 'all', value: 625 },
          { type: 'xp', value: 2595 },
          { type: 'gold', value: 3893 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 51 },
        ],
      },
    },
    {
      text: 'Nullify gravity (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You create anti-gravity! The singularity tears itself apart!',
        effects: [
          { type: 'damage', target: 'all', value: 578 },
          { type: 'xp', value: 2755 },
          { type: 'gold', value: 4133 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 70 },
        ],
      },
    },
    {
      text: 'Achieve escape velocity (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 86,
      },
      outcome: {
        text: 'Your power exceeds even a black hole! You escape and destroy it!',
        effects: [
          { type: 'damage', target: 'strongest', value: 592 },
          { type: 'xp', value: 2785 },
          { type: 'gold', value: 4178 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 71 },
        ],
      },
    },
  ],
  depth: 91,
  icon: GiBlackHoleBolas,
}
