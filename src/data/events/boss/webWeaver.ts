import type { DungeonEvent } from '@/types'
import { GiCobweb } from 'react-icons/gi'

export const WEB_WEAVER: DungeonEvent = {
  id: 'web-weaver',
  type: 'boss',
  title: 'Web Weaver',
  description: 'An intelligent spider the size of a house commands an intricate web that fills the entire chamber. Its many eyes calculate your every move.',
  choices: [
    {
      text: 'Navigate the web',
      outcome: {
        text: 'You become entangled! The spider wraps you in silk as venom courses through you!',
        effects: [
          { type: 'damage', target: 'all', value: 120 },
          { type: 'xp', value: 465 },
          { type: 'gold', value: 615 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Burn the web (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Flames consume the web! The spider falls and you finish it!',
        effects: [
          { type: 'damage', target: 'all', value: 82 },
          { type: 'xp', value: 510 },
          { type: 'gold', value: 670 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Cut through strategically (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 27,
      },
      outcome: {
        text: 'You find the structural weak points! The web collapses on the spider!',
        effects: [
          { type: 'damage', target: 'weakest', value: 88 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 660 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
  ],
  depth: 22,
  icon: GiCobweb,
}
