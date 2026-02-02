import type { DungeonEvent } from '@/types'
import { GiWinterGloves } from 'react-icons/gi'

export const WINTER_SOVEREIGN: DungeonEvent = {
  id: 'winter-sovereign',
  type: 'boss',
  title: 'Winter Sovereign',
  description: 'The embodiment of eternal winter. Wherever it walks, spring never comes. Its touch brings the final, coldest sleep.',
  choices: [
    {
      text: 'Endure the endless winter',
      outcome: {
        text: 'Cold beyond imagining! Your blood freezes as hypothermia sets in!',
        effects: [
          { type: 'damage', target: 'all', value: 345 },
          { type: 'xp', value: 1275 },
          { type: 'gold', value: 1913 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Summon spring (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'Your nature magic brings warmth and life! Winter cannot exist in spring!',
        effects: [
          { type: 'damage', target: 'all', value: 270 },
          { type: 'xp', value: 1385 },
          { type: 'gold', value: 2078 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Shatter with heat (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 56,
      },
      outcome: {
        text: 'Your attacks generate intense heat! The sovereign melts away!',
        effects: [
          { type: 'damage', target: 'strongest', value: 290 },
          { type: 'xp', value: 1405 },
          { type: 'gold', value: 2108 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 34 },
        ],
      },
    },
  ],
  depth: 48,
  icon: GiWinterGloves,
}
