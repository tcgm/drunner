import type { DungeonEvent } from '@/types'
import { GiSwordSpade } from 'react-icons/gi'

export const SWORD_SAINT: DungeonEvent = {
  id: 'sword-saint',
  type: 'boss',
  title: 'Sword Saint',
  description: 'A master who has transcended mortality through perfection of the blade. Every strike is flawless, every movement art.',
  choices: [
    {
      text: 'Match blade to blade',
      outcome: {
        text: 'Outclassed! The saint\'s skill is centuries beyond yours!',
        effects: [
          { type: 'damage', target: 'strongest', value: 425 },
          { type: 'xp', value: 1690 },
          { type: 'gold', value: 2535 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Study and learn (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 69,
      },
      outcome: {
        text: 'You grasp the ultimate technique! The saint smiles and passes the torch!',
        effects: [
          { type: 'damage', target: 'all', value: 372 },
          { type: 'xp', value: 1835 },
          { type: 'gold', value: 2753 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 44 },
        ],
      },
    },
    {
      text: 'Fight with honor (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'The saint respects your dedication! They test you fully and acknowledge your worth!',
        effects: [
          { type: 'damage', target: 'strongest', value: 358 },
          { type: 'xp', value: 1810 },
          { type: 'gold', value: 2715 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 43 },
        ],
      },
    },
  ],
  depth: 60,
  icon: GiSwordSpade,
}
