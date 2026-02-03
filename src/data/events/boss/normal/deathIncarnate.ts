import type { DungeonEvent } from '@/types'
import { GiDeathSkull } from 'react-icons/gi'

export const DEATH_INCARNATE: DungeonEvent = {
  id: 'death-incarnate',
  type: 'boss',
  title: 'Death Incarnate',
  description: 'The physical manifestation of mortality itself. Its touch is instant death. Its gaze ends existence. It is inevitable.',
  choices: [
    {
      text: 'Accept mortality',
      outcome: {
        text: 'Death comes for all! No one can fight the inevitable!',
        effects: [
          { type: 'damage', target: 'all', value: 545 },
          { type: 'xp', value: 2240 },
          { type: 'gold', value: 3360 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 44 },
        ],
      },
    },
    {
      text: 'Defy destiny (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Life triumphs! Your divine power proves death is not absolute!',
        effects: [
          { type: 'damage', target: 'all', value: 485 },
          { type: 'xp', value: 2370 },
          { type: 'gold', value: 3555 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 60 },
        ],
      },
    },
    {
      text: 'Choose when to die (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 82,
      },
      outcome: {
        text: 'You assert your own mortality! Death has no power over those who choose!',
        effects: [
          { type: 'damage', target: 'random', value: 498 },
          { type: 'xp', value: 2395 },
          { type: 'gold', value: 3593 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 61 },
        ],
      },
    },
  ],
  depth: 76,
  icon: GiDeathSkull,
}
