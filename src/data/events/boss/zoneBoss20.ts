import type { DungeonEvent } from '@/types'
import { GiDragonOrb } from 'react-icons/gi'

export const ZONE_BOSS_20: DungeonEvent = {
  id: 'zone-boss-20-corrupted-drake',
  type: 'boss',
  title: 'Corrupted Drake',
  description: 'A once-noble dragon, now twisted by dark magic. Its scales gleam with unnatural power, and corruption drips from its fangs. This is a creature of nightmares.',
  depth: 20,
  isZoneBoss: true,
  zoneBossFloor: 20,
  icon: GiDragonOrb,
  choices: [
    {
      text: 'Face it head-on',
      outcome: {
        text: 'You charge into its flames and claws, trading blows until the corrupted beast finally collapses!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 800 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Purify the corruption (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Your holy magic burns away the dark influence! The drake regains its sanity briefly before passing peacefully.',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'heal', target: 'all', value: 40 },
          { type: 'xp', value: 600 },
          { type: 'gold', value: 900 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Strike at its heart (High Attack)',
      requirements: { stat: 'attack', minValue: 40 },
      outcome: {
        text: 'A single devastating blow pierces through scales and corruption, ending it swiftly!',
        effects: [
          { type: 'damage', target: 'strongest', value: 30 },
          { type: 'xp', value: 550 },
          { type: 'gold', value: 1000 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 15 },
        ],
      },
    },
  ],
}
