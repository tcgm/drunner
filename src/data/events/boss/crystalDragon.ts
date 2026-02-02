import type { DungeonEvent } from '@/types'
import { GiEmerald } from 'react-icons/gi'

export const CRYSTAL_DRAGON: DungeonEvent = {
  id: 'crystal-dragon',
  type: 'boss',
  title: 'Crystal Dragon',
  description: 'A dragon made entirely of living gemstone gleams in the light. Its breath weapon is a beam of concentrated magical energy that can shatter stone.',
  choices: [
    {
      text: 'Face the dragon',
      outcome: {
        text: 'Its crystal breath and razor-sharp claws tear through your defenses!',
        effects: [
          { type: 'damage', target: 'all', value: 150 },
          { type: 'xp', value: 515 },
          { type: 'gold', value: 680 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Shatter with resonance (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your sonic magic finds its resonant frequency! The dragon explodes into gems!',
        effects: [
          { type: 'damage', target: 'all', value: 108 },
          { type: 'xp', value: 555 },
          { type: 'gold', value: 730 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Strike vital facets (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 34,
      },
      outcome: {
        text: 'You identify structural weak points! Precision strikes crack it apart!',
        effects: [
          { type: 'damage', target: 'strongest', value: 118 },
          { type: 'xp', value: 548 },
          { type: 'gold', value: 718 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiEmerald,
}
