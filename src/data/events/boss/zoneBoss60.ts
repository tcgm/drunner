import type { DungeonEvent } from '@/types'
import { GiDualityMask } from 'react-icons/gi'

export const ZONE_BOSS_60: DungeonEvent = {
  id: 'zone-boss-60-twin-archons',
  type: 'boss',
  title: 'The Twin Archons',
  description: 'Two ancient beings bound as one - Order and Chaos incarnate. They move in perfect synchronization, one defending while the other attacks. To defeat them, you must disrupt their harmony.',
  depth: 60,
  isZoneBoss: true,
  zoneBossFloor: 60,
  icon: GiDualityMask,
  choices: [
    {
      text: 'Divide and conquer',
      outcome: {
        text: 'You split your forces to engage them separately! Though the battle is fierce, you manage to overwhelm them individually!',
        effects: [
          { type: 'damage', target: 'all', value: 400 },
          { type: 'xp', value: 1500 },
          { type: 'gold', value: 2400 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Exploit their duality (High Luck)',
      successChance: 0.35,
      statModifier: 'luck',
      successOutcome: {
        text: 'You trick them into attacking each other! Their perfect harmony becomes their downfall!',
        effects: [
          { type: 'damage', target: 'random', value: 160 },
          { type: 'xp', value: 1800 },
          { type: 'gold', value: 2800 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
        ],
      },
      failureOutcome: {
        text: 'Your plan backfires and they turn their full combined fury on you!',
        effects: [
          { type: 'damage', target: 'all', value: 480, isTrueDamage: true },
          { type: 'xp', value: 1200 },
          { type: 'gold', value: 2000 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Overwhelm with raw power',
      outcome: {
        text: 'You unleash everything you have in one massive assault! The Archons fall beneath your relentless offensive!',
        effects: [
          { type: 'damage', target: 'all', value: 380 },
          { type: 'xp', value: 1600 },
          { type: 'gold', value: 2500 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 28 },
          { type: 'item', itemType: 'accessory1', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
  ],
}
