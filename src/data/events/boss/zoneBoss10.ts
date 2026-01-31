import type { DungeonEvent } from '@/types'
import { GiStoneThrone } from 'react-icons/gi'

export const ZONE_BOSS_10: DungeonEvent = {
  id: 'zone-boss-10-dungeon-warden',
  type: 'boss',
  title: 'The Dungeon Warden',
  description: 'A massive armored guardian awakens from its vigil. This ancient sentinel has protected these depths for centuries, and it will not yield easily. The first true test of your resolve.',
  depth: 10,
  isZoneBoss: true,
  zoneBossFloor: 10,
  icon: GiStoneThrone,
  choices: [
    {
      text: 'Break through its defenses',
      outcome: {
        text: 'You hammer away at its stone armor until it finally cracks and crumbles! The warden falls, and the path deeper opens.',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 300 },
          { type: 'gold', value: 500 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Find a weak point (High Speed)',
      requirements: { stat: 'speed', minValue: 25 },
      outcome: {
        text: 'Your quick reflexes let you spot a gap in its armor. A precise strike brings it down efficiently!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 600 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Outlast its assault (High Defense)',
      requirements: { stat: 'defense', minValue: 25 },
      outcome: {
        text: 'You weather its devastating blows until the ancient construct finally runs out of power!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'heal', target: 'all', value: 30 },
          { type: 'xp', value: 320 },
          { type: 'gold', value: 550 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 6 },
        ],
      },
    },
  ],
}
