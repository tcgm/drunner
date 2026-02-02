import type { DungeonEvent } from '@/types'
import { GiFallingStar } from 'react-icons/gi'

export const DESTINY_BREAKER: DungeonEvent = {
  id: 'destiny-breaker',
  type: 'boss',
  title: 'Destiny Breaker',
  description: 'A being that defies fate itself. Prophecies fail around it. Destiny means nothing. The future is always uncertain.',
  choices: [
    {
      text: 'Trust in fate',
      outcome: {
        text: 'Fate shatters! Your destined victory becomes impossible defeat!',
        effects: [
          { type: 'damage', target: 'random', value: 592 },
          { type: 'xp', value: 2485 },
          { type: 'gold', value: 3728 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
    {
      text: 'Forge your own path (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 86,
      },
      outcome: {
        text: 'You need no destiny! You choose your own future!',
        effects: [
          { type: 'damage', target: 'all', value: 532 },
          { type: 'xp', value: 2615 },
          { type: 'gold', value: 3923 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 66 },
        ],
      },
    },
    {
      text: 'Break the breaker (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Your will is stronger than any destiny! The breaker is broken!',
        effects: [
          { type: 'damage', target: 'strongest', value: 545 },
          { type: 'xp', value: 2645 },
          { type: 'gold', value: 3968 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 67 },
        ],
      },
    },
  ],
  depth: 85,
  icon: GiFallingStar,
}
