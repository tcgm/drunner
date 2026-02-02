import type { DungeonEvent } from '@/types'
import { GiSpikesHalf } from 'react-icons/gi'

export const NIGHTMARE_TYRANT: DungeonEvent = {
  id: 'nightmare-tyrant',
  type: 'boss',
  title: 'Nightmare Tyrant',
  description: 'A demon that feeds on fear, manifesting your worst nightmares. The chamber shifts and morphs into scenes of terror.',
  choices: [
    {
      text: 'Face your fears',
      outcome: {
        text: 'Your deepest terrors come alive! The psychological assault is overwhelming!',
        effects: [
          { type: 'damage', target: 'all', value: 295 },
          { type: 'xp', value: 1130 },
          { type: 'gold', value: 1700 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Conquer fear (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 50,
      },
      outcome: {
        text: 'You master your emotions! Without fear to feed on, it starves!',
        effects: [
          { type: 'damage', target: 'all', value: 220 },
          { type: 'xp', value: 1250 },
          { type: 'gold', value: 1875 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Turn dreams against it (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'You weave pleasant dreams! The nightmare cannot exist in joy!',
        effects: [
          { type: 'damage', target: 'weakest', value: 232 },
          { type: 'xp', value: 1270 },
          { type: 'gold', value: 1905 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 43,
  icon: GiSpikesHalf,
}
