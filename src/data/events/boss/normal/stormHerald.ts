import type { DungeonEvent } from '@/types'
import { GiLightningTear } from 'react-icons/gi'

export const STORM_HERALD: DungeonEvent = {
  id: 'storm-herald',
  type: 'boss',
  title: 'Storm Herald',
  description: 'An elemental noble who commands the fury of tempests. Lightning, thunder, and wind answer its call.',
  choices: [
    {
      text: 'Weather the storm',
      outcome: {
        text: 'Endless lightning strikes! Thunder deafens you! Wind tears at your flesh!',
        effects: [
          { type: 'damage', target: 'random', value: 398 },
          { type: 'xp', value: 1620 },
          { type: 'gold', value: 2430 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Ground the lightning (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 62,
      },
      outcome: {
        text: 'You channel the electricity safely! Without lightning, the herald falls!',
        effects: [
          { type: 'damage', target: 'all', value: 322 },
          { type: 'xp', value: 1740 },
          { type: 'gold', value: 2610 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Strike through the storm (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You charge through wind and lightning! The herald cannot stop you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 338 },
          { type: 'xp', value: 1760 },
          { type: 'gold', value: 2640 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 41 },
        ],
      },
    },
  ],
  depth: 58,
  icon: GiLightningTear,
}
