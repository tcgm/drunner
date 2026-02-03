import type { DungeonEvent } from '@/types'
import { GiSpikedShell } from 'react-icons/gi'

export const ARMORED_BEHEMOTH: DungeonEvent = {
  id: 'armored-behemoth',
  type: 'boss',
  title: 'Armored Behemoth',
  description: 'A massive creature covered in natural armor plates. Its shell deflects most attacks, and its crushing bulk can flatten anything in its path.',
  choices: [
    {
      text: 'Attack the armor',
      outcome: {
        text: 'Your weapons bounce off uselessly! It charges and tramples you!',
        effects: [
          { type: 'damage', target: 'all', value: 202 },
          { type: 'xp', value: 750 },
          { type: 'gold', value: 1080 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Find weak spots (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You target the gaps between plates! Precision shots bring it down!',
        effects: [
          { type: 'damage', target: 'random', value: 158 },
          { type: 'xp', value: 825 },
          { type: 'gold', value: 1180 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Flip it over (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 44,
      },
      outcome: {
        text: 'With tremendous effort, you overturn it! Its soft underbelly is exposed!',
        effects: [
          { type: 'damage', target: 'weakest', value: 172 },
          { type: 'xp', value: 840 },
          { type: 'gold', value: 1195 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 37,
  icon: GiSpikedShell,
}
