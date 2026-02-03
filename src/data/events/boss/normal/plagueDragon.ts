import type { DungeonEvent } from '@/types'
import { GiSwampBat } from 'react-icons/gi'

export const PLAGUE_DRAGON: DungeonEvent = {
  id: 'plague-dragon',
  type: 'boss',
  title: 'Plague Dragon',
  description: 'A wyrm corrupted by disease. Its breath spreads pestilence, and flies swarm around its rotting form.',
  choices: [
    {
      text: 'Fight the disease',
      outcome: {
        text: 'Plague and poison overwhelm you! Every breath brings more infection!',
        effects: [
          { type: 'damage', target: 'all', value: 315 },
          { type: 'xp', value: 1185 },
          { type: 'gold', value: 1778 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Purify the dragon (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy magic cleanses the corruption! The dragon is freed from suffering!',
        effects: [
          { type: 'damage', target: 'all', value: 240 },
          { type: 'xp', value: 1305 },
          { type: 'gold', value: 1958 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Resist all disease (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 50,
      },
      outcome: {
        text: 'Immunity protects you! You slay the dragon without harm!',
        effects: [
          { type: 'damage', target: 'all', value: 255 },
          { type: 'xp', value: 1325 },
          { type: 'gold', value: 1988 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Soothe the suffering beast (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your songs of comfort reach through the corruption! The dragon\'s ancient heart softens, and it peacefully surrenders its treasure before passing!',
        effects: [
          { type: 'damage', target: 'all', value: 200 },
          { type: 'xp', value: 1350 },
          { type: 'gold', value: 2050 },
          { type: 'item', itemType: 'accessory1', minRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
  ],
  depth: 44,
  icon: GiSwampBat,
}
