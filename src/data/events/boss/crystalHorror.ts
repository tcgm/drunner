import type { DungeonEvent } from '@/types'
import { GiCrystalBall } from 'react-icons/gi'

export const CRYSTAL_HORROR: DungeonEvent = {
  id: 'crystal-horror',
  type: 'boss',
  title: 'Crystal Horror',
  description: 'A bizarre fusion of crystal and flesh shambles forward, razor-sharp shards protruding from its warped body. It pulses with eldritch light.',
  choices: [
    {
      text: 'Smash the crystals',
      outcome: {
        text: 'Shattered crystals cut you as you attack! Each shard seems alive!',
        effects: [
          { type: 'damage', target: 'all', value: 70 },
          { type: 'xp', value: 310 },
          { type: 'gold', value: 410 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Shatter with sonic magic (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your resonant tone shatters every crystal! The horror collapses!',
        effects: [
          { type: 'damage', target: 'all', value: 45 },
          { type: 'xp', value: 360 },
          { type: 'gold', value: 470 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Target the flesh (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 17,
      },
      outcome: {
        text: 'You realize the flesh is the weak point! You cut it free from the crystals!',
        effects: [
          { type: 'damage', target: 'random', value: 55 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 460 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiCrystalBall,
}
