import type { DungeonEvent } from '@/types'
import { GiBalaclava } from 'react-icons/gi'

export const SHADOW_ASSASSINS: DungeonEvent = {
  id: 'shadow-assassins',
  type: 'combat',
  title: 'Shadow Assassins',
  description: 'Perfect killers strike from complete darkness with lethal precision!',
  choices: [
    {
      text: 'Defend blindly',
      outcome: {
        text: 'Daggers find vulnerable spots!',
        effects: [
          { type: 'damage', target: 'weakest', value: 90 },
          { type: 'xp', value: 465 },
          { type: 'gold', value: 345 },
        ],
      },
    },
    {
      text: 'Counter-assassination (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You turn their tactics against them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 79 },
          { type: 'xp', value: 485 },
          { type: 'gold', value: 365 },
        ],
      },
    },
  ],
  depth: 61,
  icon: GiBalaclava,
}
