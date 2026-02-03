import type { DungeonEvent } from '@/types'
import { GiAbstract050 } from 'react-icons/gi'

export const CONCEPT_DESTROYER: DungeonEvent = {
  id: 'concept-destroyer',
  type: 'boss',
  title: 'Concept Destroyer',
  description: 'A being that erases ideas from existence. It doesn\'t kill you - it makes the concept of "you" cease to have ever existed.',
  choices: [
    {
      text: 'Maintain your concept',
      outcome: {
        text: 'Parts of you are erased from reality! Your identity fragments!',
        effects: [
          { type: 'damage', target: 'all', value: 672 },
          { type: 'xp', value: 2780 },
          { type: 'gold', value: 4170 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 55 },
        ],
      },
    },
    {
      text: 'Assert existence (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 94,
      },
      outcome: {
        text: 'I think, therefore I am! Your existence is absolute!',
        effects: [
          { type: 'damage', target: 'all', value: 645 },
          { type: 'xp', value: 2940 },
          { type: 'gold', value: 4410 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 78 },
        ],
      },
    },
    {
      text: 'Destroy destruction (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You erase the eraser! The destroyer is destroyed!',
        effects: [
          { type: 'damage', target: 'strongest', value: 658 },
          { type: 'xp', value: 2970 },
          { type: 'gold', value: 4455 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 79 },
        ],
      },
    },
  ],
  depth: 98,
  icon: GiAbstract050,
}
