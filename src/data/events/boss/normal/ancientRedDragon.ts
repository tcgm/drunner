import type { DungeonEvent } from '@/types'
import { GiDragonHead } from 'react-icons/gi'

export const ANCIENT_RED_DRAGON: DungeonEvent = {
  id: 'ancient-red-dragon',
  type: 'boss',
  title: 'Ancient Red Dragon',
  description: 'A truly ancient wyrm with scales like molten metal. Its hoard fills the cavern, and its breath could melt stone itself.',
  choices: [
    {
      text: 'Face the dragon',
      outcome: {
        text: 'Dragonfire washes over you! Claws and fangs tear at you as you burn!',
        effects: [
          { type: 'damage', target: 'all', value: 340 },
          { type: 'xp', value: 1260 },
          { type: 'gold', value: 1890 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Strike vital spots (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 58,
      },
      outcome: {
        text: 'You pierce beneath the scales! The ancient wyrm roars its last!',
        effects: [
          { type: 'damage', target: 'strongest', value: 285 },
          { type: 'xp', value: 1380 },
          { type: 'gold', value: 2070 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Negotiate tribute (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your flattery appeals to its vanity! The dragon grants passage for tribute!',
        effects: [
          { type: 'damage', target: 'all', value: 145 },
          { type: 'xp', value: 1300 },
          { type: 'gold', value: 2450 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 49,
  icon: GiDragonHead,
}
