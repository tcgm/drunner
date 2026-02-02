import type { DungeonEvent } from '@/types'
import { GiLightningTear } from 'react-icons/gi'

export const STORM_TITANS: DungeonEvent = {
  id: 'storm-titans',
  type: 'combat',
  title: 'Storm Titans',
  description: 'Colossal beings made of thunder and lightning!',
  choices: [
    {
      text: 'Face their fury',
      outcome: {
        text: 'Lightning strikes devastate!',
        effects: [
          { type: 'damage', target: 'strongest', value: 103 },
          { type: 'xp', value: 547 },
          { type: 'gold', value: 420 },
        ],
      },
    },
    {
      text: 'Deflect the bolts (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your weapon grounds the lightning!',
        effects: [
          { type: 'damage', target: 'strongest', value: 92 },
          { type: 'xp', value: 567 },
          { type: 'gold', value: 440 },
        ],
      },
    },
  ],
  depth: 62,
  icon: GiLightningTear,
}
