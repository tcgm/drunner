import type { DungeonEvent } from '@/types'
import { GiAngelWings } from 'react-icons/gi'

export const FALLEN_ANGEL: DungeonEvent = {
  id: 'fallen-angel',
  type: 'boss',
  title: 'Fallen Angel',
  description: 'A once-celestial being with blackened wings and a blade of corrupted light. Its beauty is terrible to behold, mixing divine grace with infernal corruption.',
  choices: [
    {
      text: 'Face the fallen',
      outcome: {
        text: 'Divine and infernal power combine in devastating attacks! You\'re overwhelmed!',
        effects: [
          { type: 'damage', target: 'all', value: 140 },
          { type: 'xp', value: 498 },
          { type: 'gold', value: 658 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Attempt redemption (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your faith pierces the corruption! The angel finds peace and fades!',
        effects: [
          { type: 'damage', target: 'all', value: 90 },
          { type: 'xp', value: 548 },
          { type: 'gold', value: 720 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Shatter its wings (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 33,
      },
      outcome: {
        text: 'You destroy its wings! Grounded, the fallen angel is vulnerable!',
        effects: [
          { type: 'damage', target: 'strongest', value: 105 },
          { type: 'xp', value: 543 },
          { type: 'gold', value: 710 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
  ],
  depth: 27,
  icon: GiAngelWings,
}
