import type { DungeonEvent } from '@/types'
import { GiWolfHead } from 'react-icons/gi'

export const RABID_WOLF: DungeonEvent = {
  id: 'rabid-wolf-intro',
  type: 'boss',
  title: 'Rabid Wolf',
  description: 'A snarling wolf guards this passage. Foam drips from its jaws as it prepares to attack.',
  choices: [
    {
      text: 'Defend and counter',
      outcome: {
        text: 'You block the wolf\'s attacks and strike back. It\'s a tough fight!',
        effects: [
          { type: 'damage', target: 'all', value: 16 },
          { type: 'xp', value: 125 },
          { type: 'gold', value: 155 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Block with shield (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 8,
      },
      outcome: {
        text: 'Your defense holds strong! The wolf exhausts itself against your guard!',
        effects: [
          { type: 'damage', target: 'all', value: 11 },
          { type: 'xp', value: 155 },
          { type: 'gold', value: 185 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 7 },
        ],
      },
    },
    {
      text: 'Calm the beast (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You soothe the wolf with your connection to nature. It backs down!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 165 },
          { type: 'gold', value: 205 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiWolfHead,
  isIntroBoss: true,
}
