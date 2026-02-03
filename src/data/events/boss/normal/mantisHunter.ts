import type { DungeonEvent } from '@/types'
import { GiAlienBug } from 'react-icons/gi'

export const MANTIS_HUNTER: DungeonEvent = {
  id: 'mantis-hunter',
  type: 'boss',
  title: 'Mantis Hunter',
  description: 'An enormous praying mantis with blade-like forelegs stalks from the shadows. Its compound eyes track your every movement with unsettling precision.',
  choices: [
    {
      text: 'Match its speed',
      outcome: {
        text: 'The mantis strikes like lightning! Its blades cut deep before you can react!',
        effects: [
          { type: 'damage', target: 'all', value: 75 },
          { type: 'xp', value: 330 },
          { type: 'gold', value: 440 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Predict its movements (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You know how predators think! You anticipate and counter perfectly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 54 },
          { type: 'xp', value: 375 },
          { type: 'gold', value: 490 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Break its limbs (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 17,
      },
      outcome: {
        text: 'You shatter both forelegs! The mantis can no longer fight!',
        effects: [
          { type: 'damage', target: 'random', value: 60 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 485 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiAlienBug,
}
