import type { DungeonEvent } from '@/types'
import { GiTowerBolt } from 'react-icons/gi'

export const ARCANE_ARTILLERY: DungeonEvent = {
  id: 'arcane-artillery',
  type: 'boss',
  title: 'Arcane Artillery',
  description: 'A living magical weapon system. It bombards you with spells from impossible ranges, each more devastating than the last.',
  choices: [
    {
      text: 'Endure the barrage',
      outcome: {
        text: 'Magical explosions rain down! The artillery never misses!',
        effects: [
          { type: 'damage', target: 'all', value: 328 },
          { type: 'xp', value: 1225 },
          { type: 'gold', value: 1838 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Counterspell everything (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You negate every spell! Without magic, it\'s defenseless!',
        effects: [
          { type: 'damage', target: 'all', value: 260 },
          { type: 'xp', value: 1345 },
          { type: 'gold', value: 2018 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Close the distance (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 57,
      },
      outcome: {
        text: 'You reach it before it can fire! Up close, you tear it apart!',
        effects: [
          { type: 'damage', target: 'strongest', value: 278 },
          { type: 'xp', value: 1365 },
          { type: 'gold', value: 2048 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
  ],
  depth: 46,
  icon: GiTowerBolt,
}
