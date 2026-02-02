import type { DungeonEvent } from '@/types'
import { GiBirdLimb } from 'react-icons/gi'

export const HARPY_QUEEN: DungeonEvent = {
  id: 'harpy-queen',
  type: 'boss',
  title: 'Harpy Queen',
  description: 'Ruler of a flock of harpies, she commands the skies with talons and song. Her shriek can shatter stone.',
  choices: [
    {
      text: 'Fight the flock',
      outcome: {
        text: 'Harpies attack from all sides! Their talons and songs overwhelm you!',
        effects: [
          { type: 'damage', target: 'all', value: 285 },
          { type: 'xp', value: 1110 },
          { type: 'gold', value: 1665 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Ground the queen (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'Your arrow destroys her wing! Grounded, she\'s vulnerable!',
        effects: [
          { type: 'damage', target: 'weakest', value: 215 },
          { type: 'xp', value: 1230 },
          { type: 'gold', value: 1845 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Counter-song (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your melody drowns out hers! The flock flees in confusion!',
        effects: [
          { type: 'damage', target: 'all', value: 205 },
          { type: 'xp', value: 1260 },
          { type: 'gold', value: 1890 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
  ],
  depth: 41,
  icon: GiBirdLimb,
}
