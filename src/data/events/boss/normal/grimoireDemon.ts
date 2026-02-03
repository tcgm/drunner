import type { DungeonEvent } from '@/types'
import { GiBookCover } from 'react-icons/gi'

export const GRIMOIRE_DEMON: DungeonEvent = {
  id: 'grimoire-demon',
  type: 'boss',
  title: 'Grimoire Demon',
  description: 'A demon bound into a spellbook that has gained sentience. Every page contains a different deadly spell.',
  choices: [
    {
      text: 'Let it cast',
      outcome: {
        text: 'Page after page of devastation! Spells beyond mortal comprehension!',
        effects: [
          { type: 'damage', target: 'all', value: 442 },
          { type: 'xp', value: 1840 },
          { type: 'gold', value: 2760 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 36 },
        ],
      },
    },
    {
      text: 'Counterspell everything (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You counter spell after spell! The grimoire exhausts its pages!',
        effects: [
          { type: 'damage', target: 'all', value: 372 },
          { type: 'xp', value: 1970 },
          { type: 'gold', value: 2955 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 46 },
        ],
      },
    },
    {
      text: 'Tear out the pages (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 69,
      },
      outcome: {
        text: 'You rip the grimoire apart! No pages, no spells!',
        effects: [
          { type: 'damage', target: 'strongest', value: 385 },
          { type: 'xp', value: 1995 },
          { type: 'gold', value: 2993 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 47 },
        ],
      },
    },
  ],
  depth: 62,
  icon: GiBookCover,
}
