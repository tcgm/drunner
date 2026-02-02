import type { DungeonEvent } from '@/types'
import { GiSunRadiations } from 'react-icons/gi'

export const STELLAR_TYRANTS: DungeonEvent = {
  id: 'stellar-tyrants',
  type: 'combat',
  title: 'Stellar Tyrants',
  description: 'Beings forged in dying stars command apocalyptic power!',
  choices: [
    {
      text: 'Withstand cosmic fury',
      outcome: {
        text: 'Stellar power obliterates!',
        effects: [
          { type: 'damage', target: 'all', value: 118 },
          { type: 'xp', value: 610 },
          { type: 'gold', value: 490 },
        ],
      },
    },
    {
      text: 'Divine intercession (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy power shields from stellar wrath!',
        effects: [
          { type: 'damage', target: 'all', value: 107 },
          { type: 'xp', value: 630 },
          { type: 'gold', value: 510 },
        ],
      },
    },
  ],
  depth: 79,
  icon: GiSunRadiations,
}
