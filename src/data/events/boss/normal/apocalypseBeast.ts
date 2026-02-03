import type { DungeonEvent } from '@/types'
import { GiPsychicWaves } from 'react-icons/gi'

export const APOCALYPSE_BEAST: DungeonEvent = {
  id: 'apocalypse-beast',
  type: 'boss',
  title: 'Apocalypse Beast',
  description: 'The end of all things given form. When it awakens, worlds end. It has ended a thousand realities. Yours is next.',
  choices: [
    {
      text: 'Accept the end',
      outcome: {
        text: 'The apocalypse cannot be stopped! Everything dies!',
        effects: [
          { type: 'damage', target: 'all', value: 665 },
          { type: 'xp', value: 2755 },
          { type: 'gold', value: 4133 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 55 },
        ],
      },
    },
    {
      text: 'Prevent the apocalypse (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Hope defeats despair! Life conquers ending! The beast is sealed!',
        effects: [
          { type: 'damage', target: 'all', value: 632 },
          { type: 'xp', value: 2915 },
          { type: 'gold', value: 4373 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 77 },
        ],
      },
    },
    {
      text: 'Become the new beginning (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 93,
      },
      outcome: {
        text: 'Every end is a beginning! You embody rebirth! The beast becomes you!',
        effects: [
          { type: 'damage', target: 'all', value: 645 },
          { type: 'xp', value: 2945 },
          { type: 'gold', value: 4418 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 78 },
        ],
      },
    },
  ],
  depth: 96,
  icon: GiPsychicWaves,
}
