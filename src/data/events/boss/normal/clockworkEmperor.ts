import type { DungeonEvent } from '@/types'
import { GiSteampunkGoggles } from 'react-icons/gi'

export const CLOCKWORK_EMPEROR: DungeonEvent = {
  id: 'clockwork-emperor',
  type: 'boss',
  title: 'Clockwork Emperor',
  description: 'The ultimate creation of mad artificers. This mechanical tyrant commands an army of constructs with perfect precision.',
  choices: [
    {
      text: 'Battle the machine army',
      outcome: {
        text: 'Countless constructs swarm you while the emperor coordinates the assault!',
        effects: [
          { type: 'damage', target: 'all', value: 320 },
          { type: 'xp', value: 1200 },
          { type: 'gold', value: 1800 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Hack the mainframe (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You infiltrate its command systems! The emperor shuts down!',
        effects: [
          { type: 'damage', target: 'weakest', value: 245 },
          { type: 'xp', value: 1310 },
          { type: 'gold', value: 1965 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Destroy the core (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 53,
      },
      outcome: {
        text: 'You fight through to its power source! One strike ends the machine age!',
        effects: [
          { type: 'damage', target: 'strongest', value: 270 },
          { type: 'xp', value: 1350 },
          { type: 'gold', value: 2025 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
  ],
  depth: 44,
  icon: GiSteampunkGoggles,
}
