import type { DungeonEvent } from '@/types'
import { GiCrystalShine } from 'react-icons/gi'

export const CRYSTALLINE_SENTINEL: DungeonEvent = {
  id: 'crystalline-sentinel',
  type: 'boss',
  title: 'Crystalline Sentinel',
  description: 'A being made entirely of living crystal. Light refracts through its prismatic body in blinding patterns. Each movement creates harmonic tones that resonate through your bones.',
  choices: [
    {
      text: 'Shatter it with force',
      outcome: {
        text: 'You hammer away at the crystal, each blow sending cracks spreading through its form!',
        effects: [
          { type: 'damage', target: 'all', value: 210 },
          { type: 'xp', value: 850 },
          { type: 'gold', value: 1250 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Find the harmonic frequency (High Luck)',
      requirements: {
        stat: 'luck',
        minValue: 60,
      },
      outcome: {
        text: 'You discover the exact resonance frequency! The sentinel vibrates itself apart!',
        effects: [
          { type: 'damage', target: 'all', value: 140 },
          { type: 'xp', value: 1000 },
          { type: 'gold', value: 1450 },
          { type: 'item', itemType: 'accessory1', minRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Disrupt with magic',
      outcome: {
        text: 'Your spells interfere with its crystalline structure, causing it to crack and eventually shatter!',
        effects: [
          { type: 'damage', target: 'all', value: 175 },
          { type: 'xp', value: 900 },
          { type: 'gold', value: 1300 },
          { type: 'item', itemType: 'helmet', minRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
  ],
  depth: 42,
  icon: GiCrystalShine,
}
