import type { DungeonEvent } from '@/types'
import { GiPoisonCloud } from 'react-icons/gi'

export const MIASMA_ENTITIES: DungeonEvent = {
  id: 'miasma-entities',
  type: 'combat',
  title: 'Miasma Entities',
  description: 'Living clouds of toxic gas coalesce into vaguely humanoid forms!',
  choices: [
    {
      text: 'Fight through the fog',
      outcome: {
        text: 'Poisonous fumes choke you!',
        effects: [
          { type: 'damage', target: 'all', value: 53 },
          { type: 'xp', value: 268 },
          { type: 'gold', value: 188 },
        ],
      },
    },
    {
      text: 'Disperse them (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Wind magic scatters the gas!',
        effects: [
          { type: 'damage', target: 'all', value: 42 },
          { type: 'xp', value: 288 },
          { type: 'gold', value: 204 },
        ],
      },
    },
  ],
  depth: 41,
  icon: GiPoisonCloud,
}
