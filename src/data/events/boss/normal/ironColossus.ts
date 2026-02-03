import type { DungeonEvent } from '@/types'
import { GiAnvilImpact } from 'react-icons/gi'

export const IRON_COLOSSUS: DungeonEvent = {
  id: 'iron-colossus',
  type: 'boss',
  title: 'Iron Colossus',
  description: 'A massive iron statue animates with grinding metal. Each footstep shakes the floor as it advances with unstoppable force.',
  choices: [
    {
      text: 'Attack the armor',
      outcome: {
        text: 'Your strikes barely scratch the iron! Its massive fist nearly crushes you!',
        effects: [
          { type: 'damage', target: 'all', value: 79 },
          { type: 'xp', value: 332 },
          { type: 'gold', value: 442 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Heat and shatter (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You superheat the metal then freeze it! The colossus shatters from thermal shock!',
        effects: [
          { type: 'damage', target: 'all', value: 56 },
          { type: 'xp', value: 372 },
          { type: 'gold', value: 487 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Target the joints (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 21,
      },
      outcome: {
        text: 'You find weak points where the plates meet! The colossus topples!',
        effects: [
          { type: 'damage', target: 'random', value: 63 },
          { type: 'xp', value: 366 },
          { type: 'gold', value: 476 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiAnvilImpact,
}
