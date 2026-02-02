import type { DungeonEvent } from '@/types'
import { GiShardSword } from 'react-icons/gi'

export const GLASS_KNIGHTS: DungeonEvent = {
  id: 'glass-knights',
  type: 'combat',
  title: 'Glass Knights',
  description: 'Transparent warriors made of razor-sharp glass advance silently!',
  choices: [
    {
      text: 'Shatter them',
      outcome: {
        text: 'Glass shards fly everywhere!',
        effects: [
          { type: 'damage', target: 'all', value: 21 },
          { type: 'xp', value: 111 },
          { type: 'gold', value: 67 },
        ],
      },
    },
    {
      text: 'Careful strikes (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You avoid the shard spray!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 131 },
          { type: 'gold', value: 82 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiShardSword,
}
