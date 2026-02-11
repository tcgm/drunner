import type { DungeonEvent } from '@/types'
import { GiChainedHeart } from 'react-icons/gi'
import { DEVASTATING_SLAM, REGENERATION } from '@/data/abilities/boss'
import { RAPID_STRIKES, EXECUTE } from '@/data/attackPatterns/boss'

export const BOUND_DEMON: DungeonEvent = {
  id: 'bound-demon',
  type: 'boss',
  title: 'Bound Demon',
  description: 'A fiendish creature strains against magical chains. Though bound, its power is still formidable, and it lashes out with claws and hellfire.',

  // Combat properties for turn-based boss fights
  bossAbilities: [DEVASTATING_SLAM, REGENERATION],
  attackPatterns: [RAPID_STRIKES, EXECUTE],
  phases: [
    {
      hpThreshold: 0.3,
      name: 'Chains Breaking',
      description: 'The magical chains begin to shatter! The demon\'s power surges!',
      abilityChanges: { DEVASTATING_SLAM: true },
      patternChanges: { RAPID_STRIKES: 2 }
    }
  ],

  // Legacy choice-based rewards (used for victory rewards)
  choices: [
    {
      text: 'Fight while it\'s bound',
      outcome: {
        text: 'The demon\'s rage is terrifying! Even chained, it nearly breaks free!',
        effects: [
          { type: 'damage', target: 'all', value: 83 },
          { type: 'xp', value: 345 },
          { type: 'gold', value: 455 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Banish it (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy power sends the demon back to the abyss! The chains vanish!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 375 },
          { type: 'gold', value: 490 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Strengthen the chains (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 19,
      },
      outcome: {
        text: 'You reinforce the binding! The demon is crushed by its own prison!',
        effects: [
          { type: 'damage', target: 'random', value: 62 },
          { type: 'xp', value: 368 },
          { type: 'gold', value: 478 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiChainedHeart,
}
