import type { DungeonEvent } from '@/types'
import { GiThunderSkull } from 'react-icons/gi'

export const STORM_LICH: DungeonEvent = {
  id: 'storm-lich',
  type: 'boss',
  title: 'Storm Lich',
  description: 'An undead sorcerer who commands the power of storms. Lightning arcs between their skeletal fingers, and thunder accompanies their every word.',
  choices: [
    {
      text: 'Endure the tempest',
      outcome: {
        text: 'Lightning bolts and hurricane winds batter you relentlessly! The storm is unending!',
        effects: [
          { type: 'damage', target: 'all', value: 305 },
          { type: 'xp', value: 1150 },
          { type: 'gold', value: 1750 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Ground the lightning (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 48,
      },
      outcome: {
        text: 'You channel the electricity harmlessly! Without lightning, the lich is vulnerable!',
        effects: [
          { type: 'damage', target: 'all', value: 242 },
          { type: 'xp', value: 1280 },
          { type: 'gold', value: 1920 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Destroy phylactery (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'You locate their soul vessel! The lich and its storm dissipate together!',
        effects: [
          { type: 'damage', target: 'all', value: 228 },
          { type: 'xp', value: 1320 },
          { type: 'gold', value: 1980 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 46,
  icon: GiThunderSkull,
}
