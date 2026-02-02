import type { DungeonEvent } from '@/types'
import { GiSwordsEmblem } from 'react-icons/gi'

export const BLADE_MASTER: DungeonEvent = {
  id: 'blade-master',
  type: 'boss',
  title: 'Blade Master',
  description: 'A legendary swordsman who has perfected their art over decades. Every movement is precise, every strike potentially lethal.',
  choices: [
    {
      text: 'Duel the master',
      outcome: {
        text: 'Their skill is overwhelming! Every feint becomes an attack, every defense a counter!',
        effects: [
          { type: 'damage', target: 'all', value: 186 },
          { type: 'xp', value: 715 },
          { type: 'gold', value: 1035 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Learn their patterns (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 39,
      },
      outcome: {
        text: 'You decipher their style! Once understood, you can counter it!',
        effects: [
          { type: 'damage', target: 'random', value: 145 },
          { type: 'xp', value: 803 },
          { type: 'gold', value: 1148 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Match their mastery (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Two masters clash! Your blade finally finds its mark!',
        effects: [
          { type: 'damage', target: 'strongest', value: 162 },
          { type: 'xp', value: 823 },
          { type: 'gold', value: 1173 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 36,
  icon: GiSwordsEmblem,
}
