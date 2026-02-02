import type { DungeonEvent } from '@/types'
import { GiThornyVine } from 'react-icons/gi'

export const BRAMBLE_KING: DungeonEvent = {
  id: 'bramble-king',
  type: 'boss',
  title: 'Bramble King',
  description: 'An ancient fey lord transformed into a mass of thorns and darkness. It rules over all twisted plants in the deep dungeon.',
  choices: [
    {
      text: 'Cut through the thorns',
      outcome: {
        text: 'The thorns regrow instantly! Each cut draws blood from razor-sharp barbs!',
        effects: [
          { type: 'damage', target: 'all', value: 382 },
          { type: 'xp', value: 1570 },
          { type: 'gold', value: 2355 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Commune with nature (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You reach the trapped fey lord within! He helps you end his cursed existence!',
        effects: [
          { type: 'damage', target: 'all', value: 312 },
          { type: 'xp', value: 1690 },
          { type: 'gold', value: 2535 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Burn the corruption (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 61,
      },
      outcome: {
        text: 'Fire consumes the cursed brambles! The king is finally free!',
        effects: [
          { type: 'damage', target: 'strongest', value: 325 },
          { type: 'xp', value: 1710 },
          { type: 'gold', value: 2565 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
  ],
  depth: 54,
  icon: GiThornyVine,
}
