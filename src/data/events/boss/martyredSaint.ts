import type { DungeonEvent } from '@/types'
import { GiCrownOfThorns } from 'react-icons/gi'

export const MARTYRED_SAINT: DungeonEvent = {
  id: 'martyred-saint',
  type: 'boss',
  title: 'Martyred Saint',
  description: 'A holy warrior who died for their cause, now twisted into undeath. Divine and necrotic power combine in terrible ways.',
  choices: [
    {
      text: 'Fight the abomination',
      outcome: {
        text: 'Holy fire burns you even as necrotic energy drains your life!',
        effects: [
          { type: 'damage', target: 'all', value: 308 },
          { type: 'xp', value: 1165 },
          { type: 'gold', value: 1748 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Grant true peace (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your blessing finally allows them to rest! They thank you as they fade!',
        effects: [
          { type: 'damage', target: 'all', value: 235 },
          { type: 'xp', value: 1295 },
          { type: 'gold', value: 1943 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Overwhelm with strength (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 52,
      },
      outcome: {
        text: 'You break through their conflicted defenses! Victory is yours!',
        effects: [
          { type: 'damage', target: 'strongest', value: 262 },
          { type: 'xp', value: 1315 },
          { type: 'gold', value: 1973 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 42,
  icon: GiCrownOfThorns,
}
