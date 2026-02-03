import type { DungeonEvent } from '@/types'
import { GiSwordman } from 'react-icons/gi'

export const BLADE_DANCER: DungeonEvent = {
  id: 'blade-dancer',
  type: 'boss',
  title: 'Blade Dancer',
  description: 'An assassin moves with impossible grace, four enchanted blades orbiting their body. They strike with mesmerizing precision.',
  choices: [
    {
      text: 'Match their speed',
      outcome: {
        text: 'You can barely track their movements! Cuts appear from impossible angles!',
        effects: [
          { type: 'damage', target: 'all', value: 122 },
          { type: 'xp', value: 468 },
          { type: 'gold', value: 618 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Disarm the blades (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'Your quick hands snatch their weapons mid-dance! They\'re helpless!',
        effects: [
          { type: 'damage', target: 'random', value: 78 },
          { type: 'xp', value: 513 },
          { type: 'gold', value: 673 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Anticipate the pattern (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 28,
      },
      outcome: {
        text: 'You see the pattern in their dance! You counter perfectly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 86 },
          { type: 'xp', value: 505 },
          { type: 'gold', value: 665 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
  ],
  depth: 23,
  icon: GiSwordman,
}
