import type { DungeonEvent } from '@/types'
import { GiTreeFace } from 'react-icons/gi'

export const CORRUPTED_TREANT: DungeonEvent = {
  id: 'corrupted-treant',
  type: 'boss',
  title: 'Corrupted Treant',
  description: 'An ancient tree guardian twisted by dark magic. Its bark is blackened, and poisonous sap oozes from its wounds. Root tendrils lash out angrily.',
  choices: [
    {
      text: 'Chop it down',
      outcome: {
        text: 'Your axe bites deep, but the treant\'s branches batter you relentlessly!',
        effects: [
          { type: 'damage', target: 'all', value: 76 },
          { type: 'xp', value: 328 },
          { type: 'gold', value: 438 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Purify with nature magic (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You cleanse the corruption! The treant returns to peaceful slumber!',
        effects: [
          { type: 'damage', target: 'all', value: 51 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 485 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Burn the corruption (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 18,
      },
      outcome: {
        text: 'Fire consumes the tainted wood! The treant falls in a blaze!',
        effects: [
          { type: 'damage', target: 'strongest', value: 59 },
          { type: 'xp', value: 362 },
          { type: 'gold', value: 472 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiTreeFace,
}
