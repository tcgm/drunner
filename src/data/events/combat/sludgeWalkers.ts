import type { DungeonEvent } from '@/types'
import { GiWaterSplash } from 'react-icons/gi'

export const SLUDGE_WALKERS: DungeonEvent = {
  id: 'sludge-walkers',
  type: 'combat',
  title: 'Sludge Walkers',
  description: 'Humanoid figures formed from toxic waste shamble forward!',
  choices: [
    {
      text: 'Cut them down',
      outcome: {
        text: 'Toxic fluid splashes on you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 21 },
          { type: 'xp', value: 81 },
          { type: 'gold', value: 48 },
        ],
      },
    },
    {
      text: 'Evaporate them (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Fire magic boils them away!',
        effects: [
          { type: 'damage', target: 'strongest', value: 14 },
          { type: 'xp', value: 96 },
          { type: 'gold', value: 58 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiWaterSplash,
}
