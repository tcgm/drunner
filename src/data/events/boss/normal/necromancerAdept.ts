import type { DungeonEvent } from '@/types'
import { GiDeathSkull } from 'react-icons/gi'

export const NECROMANCER_ADEPT: DungeonEvent = {
  id: 'necromancer-adept',
  type: 'boss',
  title: 'Necromancer Adept',
  description: 'A robed figure raises skeletal minions from the floor. Dark energy crackles around their staff as they chant forbidden words.',
  choices: [
    {
      text: 'Fight through the undead',
      outcome: {
        text: 'Skeletons keep rising as fast as you cut them down! The necromancer laughs!',
        effects: [
          { type: 'damage', target: 'all', value: 37 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 290 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Target the necromancer (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 11,
      },
      outcome: {
        text: 'You push past the minions and strike down the necromancer! The undead collapse!',
        effects: [
          { type: 'damage', target: 'weakest', value: 27 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 340 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Turn undead (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy light destroys the minions instantly! The necromancer is defenseless!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 250 },
          { type: 'gold', value: 350 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiDeathSkull,
}
