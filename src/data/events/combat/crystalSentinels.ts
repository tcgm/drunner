import type { DungeonEvent } from '@/types'
import { GiCrystalWand } from 'react-icons/gi'

export const CRYSTAL_SENTINELS: DungeonEvent = {
  id: 'crystal-sentinels',
  type: 'combat',
  title: 'Crystal Sentinels',
  description: 'Living crystals that refract magic and light!',
  choices: [
    {
      text: 'Shatter them',
      outcome: {
        text: 'Fragments cut like razors!',
        effects: [
          { type: 'damage', target: 'strongest', value: 71 },
          { type: 'xp', value: 352 },
          { type: 'gold', value: 255 },
        ],
      },
    },
    {
      text: 'Disrupt their lattice (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'They crumble harmlessly!',
        effects: [
          { type: 'damage', target: 'strongest', value: 60 },
          { type: 'xp', value: 372 },
          { type: 'gold', value: 275 },
        ],
      },
    },
  ],
  depth: 52,
  icon: GiCrystalWand,
}
