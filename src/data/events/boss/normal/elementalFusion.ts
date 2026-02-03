import type { DungeonEvent } from '@/types'
import { GiMatterStates } from 'react-icons/gi'

export const ELEMENTAL_FUSION: DungeonEvent = {
  id: 'elemental-fusion',
  type: 'boss',
  title: 'Elemental Fusion',
  description: 'Four elemental lords have merged into one being. Fire, ice, earth, and air attack in perfect harmony.',
  choices: [
    {
      text: 'Face all elements',
      outcome: {
        text: 'Fire burns, ice freezes, earth crushes, and air suffocates! All at once!',
        effects: [
          { type: 'damage', target: 'all', value: 355 },
          { type: 'xp', value: 1310 },
          { type: 'gold', value: 1965 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Separate them (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 57,
      },
      outcome: {
        text: 'You disrupt the fusion! Divided, they destroy each other!',
        effects: [
          { type: 'damage', target: 'all', value: 295 },
          { type: 'xp', value: 1410 },
          { type: 'gold', value: 2115 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 34 },
        ],
      },
    },
    {
      text: 'Absorb the power (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You channel all four elements! The fusion dissipates!',
        effects: [
          { type: 'damage', target: 'all', value: 265 },
          { type: 'xp', value: 1430 },
          { type: 'gold', value: 2145 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
  ],
  depth: 49,
  icon: GiMatterStates,
}
