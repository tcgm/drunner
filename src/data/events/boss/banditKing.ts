import type { DungeonEvent } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

export const BANDIT_KING: DungeonEvent = {
  id: 'bandit-king',
  type: 'boss',
  title: 'Bandit King',
  description: 'A notorious outlaw sits on a throne of stolen treasure. His gang of cutthroats surrounds him, but he looks confident.',
  choices: [
    {
      text: 'Fight them all',
      outcome: {
        text: 'You battle through the bandits, but their numbers wear you down!',
        effects: [
          { type: 'damage', target: 'all', value: 29 },
          { type: 'xp', value: 180 },
          { type: 'gold', value: 265 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 9 },
        ],
      },
    },
    {
      text: 'Duel the king (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 10,
      },
      outcome: {
        text: 'You defeat the king in single combat! His gang surrenders!',
        effects: [
          { type: 'damage', target: 'strongest', value: 22 },
          { type: 'xp', value: 220 },
          { type: 'gold', value: 315 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Negotiate a cut (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your silver tongue convinces them to split the loot! You walk away rich!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 450 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiCrownedSkull,
}
