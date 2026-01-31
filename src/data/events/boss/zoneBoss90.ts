import type { DungeonEvent } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

export const ZONE_BOSS_90: DungeonEvent = {
  id: 'zone-boss-90-nightmare-king',
  type: 'boss',
  title: 'The Nightmare King',
  description: 'The lord of all dark dreams and forbidden thoughts. It is every fear you\'ve ever had given terrible form. The dungeon\'s penultimate guardian, second only to the Lord himself. This is where legends are born or shattered.',
  depth: 90,
  isZoneBoss: true,
  zoneBossFloor: 90,
  icon: GiCrownedSkull,
  choices: [
    {
      text: 'Face your deepest fears',
      outcome: {
        text: 'You confront every nightmare, every terror, every dark thought you\'ve ever had. And you emerge victorious. The King dissipates like morning fog.',
        effects: [
          { type: 'damage', target: 'all', value: 140 },
          { type: 'xp', value: 2500 },
          { type: 'gold', value: 3600 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Turn fear into strength (High Defense)',
      requirements: { stat: 'defense', minValue: 120 },
      outcome: {
        text: 'Your mental fortitude is unbreakable! The Nightmare King\'s attacks cannot touch those who know no fear!',
        effects: [
          { type: 'damage', target: 'all', value: 100 },
          { type: 'heal', target: 'all', value: 100 },
          { type: 'xp', value: 2800 },
          { type: 'gold', value: 4000 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 50 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 45 },
        ],
      },
    },
    {
      text: 'Become the nightmare (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike from the shadows with such precision that even the King of Nightmares learns to fear the darkness!',
        effects: [
          { type: 'damage', target: 'all', value: 110 },
          { type: 'xp', value: 3000 },
          { type: 'gold', value: 4200 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 55 },
          { type: 'item', itemType: 'weapon', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 50 },
          { type: 'item', itemType: 'accessory1', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 45 },
        ],
      },
    },
  ],
}
