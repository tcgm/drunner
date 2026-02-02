import type { DungeonEvent } from '@/types'
import { GiMightySpanner } from 'react-icons/gi'

export const CLOCKWORK_SENTINEL: DungeonEvent = {
  id: 'clockwork-sentinel',
  type: 'boss',
  title: 'Clockwork Sentinel',
  description: 'A towering mechanical construct whirs to life, gears grinding and steam hissing. Its brass fists gleam with deadly intent.',
  choices: [
    {
      text: 'Damage the armor',
      outcome: {
        text: 'Your weapons dent the metal, but it\'s built to last! Pistons slam into you!',
        effects: [
          { type: 'damage', target: 'all', value: 67 },
          { type: 'xp', value: 318 },
          { type: 'gold', value: 425 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Dismantle the gears (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 18,
      },
      outcome: {
        text: 'You understand its mechanisms! You disassemble it piece by piece!',
        effects: [
          { type: 'damage', target: 'all', value: 48 },
          { type: 'xp', value: 363 },
          { type: 'gold', value: 473 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Sabotage with tools (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You jam its gears! The sentinel grinds to a halt and explodes!',
        effects: [
          { type: 'damage', target: 'random', value: 52 },
          { type: 'xp', value: 358 },
          { type: 'gold', value: 468 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiMightySpanner,
}
