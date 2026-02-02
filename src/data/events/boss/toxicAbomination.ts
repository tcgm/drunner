import type { DungeonEvent } from '@/types'
import { GiPoisonGas } from 'react-icons/gi'

export const TOXIC_ABOMINATION: DungeonEvent = {
  id: 'toxic-abomination',
  type: 'boss',
  title: 'Toxic Abomination',
  description: 'A writhing mass of flesh and toxic sludge, created by twisted experiments. Poison gas constantly seeps from its many orifices.',
  choices: [
    {
      text: 'Endure the poison',
      outcome: {
        text: 'Toxins overwhelm your system! Every breath brings more corruption!',
        effects: [
          { type: 'damage', target: 'all', value: 165 },
          { type: 'xp', value: 675 },
          { type: 'gold', value: 990 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Neutralize the toxins (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 34,
      },
      outcome: {
        text: 'You understand its chemistry! Counter-agents render it harmless!',
        effects: [
          { type: 'damage', target: 'weakest', value: 125 },
          { type: 'xp', value: 740 },
          { type: 'gold', value: 1060 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Purify with magic (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'Natural magic cleanses the corruption! The abomination dissolves!',
        effects: [
          { type: 'damage', target: 'all', value: 130 },
          { type: 'xp', value: 758 },
          { type: 'gold', value: 1083 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
  ],
  depth: 31,
  icon: GiPoisonGas,
}
