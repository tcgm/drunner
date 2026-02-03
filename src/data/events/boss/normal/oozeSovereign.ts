import type { DungeonEvent } from '@/types'
import { GiTentacleStrike } from 'react-icons/gi'

export const OOZE_SOVEREIGN: DungeonEvent = {
  id: 'ooze-sovereign',
  type: 'boss',
  title: 'Ooze Sovereign',
  description: 'A massive, sentient slime pulses with malevolent intelligence. It splits and reforms, absorbing everything in its path with acidic hunger.',
  choices: [
    {
      text: 'Hack at the ooze',
      outcome: {
        text: 'Your weapon passes through harmlessly! The acid burns your flesh!',
        effects: [
          { type: 'damage', target: 'all', value: 80 },
          { type: 'xp', value: 340 },
          { type: 'gold', value: 450 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Freeze it solid (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Ice magic crystallizes the ooze! You shatter it into pieces!',
        effects: [
          { type: 'damage', target: 'all', value: 58 },
          { type: 'xp', value: 378 },
          { type: 'gold', value: 495 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Resist the acid (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 19,
      },
      outcome: {
        text: 'Your armor holds! You destroy its core from within!',
        effects: [
          { type: 'damage', target: 'all', value: 64 },
          { type: 'xp', value: 373 },
          { type: 'gold', value: 488 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiTentacleStrike,
}
