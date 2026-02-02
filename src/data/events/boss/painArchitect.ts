import type { DungeonEvent } from '@/types'
import { GiSwordWound } from 'react-icons/gi'

export const PAIN_ARCHITECT: DungeonEvent = {
  id: 'pain-architect',
  type: 'boss',
  title: 'Pain Architect',
  description: 'A demon that has mastered the art of suffering. It doesn\'t kill - it makes you wish it would.',
  choices: [
    {
      text: 'Endure torture',
      outcome: {
        text: 'Agony beyond description! Pain becomes your entire world!',
        effects: [
          { type: 'damage', target: 'all', value: 452 },
          { type: 'xp', value: 1870 },
          { type: 'gold', value: 2805 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Transcend pain (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 74,
      },
      outcome: {
        text: 'You separate mind from body! Pain becomes meaningless!',
        effects: [
          { type: 'damage', target: 'all', value: 385 },
          { type: 'xp', value: 2000 },
          { type: 'gold', value: 3000 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 47 },
        ],
      },
    },
    {
      text: 'Strike through agony (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Pain fuels your rage! You use suffering as a weapon!',
        effects: [
          { type: 'damage', target: 'strongest', value: 398 },
          { type: 'xp', value: 2025 },
          { type: 'gold', value: 3038 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
  ],
  depth: 64,
  icon: GiSwordWound,
}
