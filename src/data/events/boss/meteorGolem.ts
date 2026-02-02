import type { DungeonEvent } from '@/types'
import { GiCometSpark } from 'react-icons/gi'

export const METEOR_GOLEM: DungeonEvent = {
  id: 'meteor-golem',
  type: 'boss',
  title: 'Meteor Golem',
  description: 'A construct forged from a fallen star. Its body radiates intense heat and cosmic energy, burning everything it touches.',
  choices: [
    {
      text: 'Endure the heat',
      outcome: {
        text: 'The cosmic fire is overwhelming! Your flesh burns from proximity alone!',
        effects: [
          { type: 'damage', target: 'all', value: 388 },
          { type: 'xp', value: 1590 },
          { type: 'gold', value: 2385 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Cool it down (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Ice magic quenches the star-fire! The golem cracks and shatters!',
        effects: [
          { type: 'damage', target: 'all', value: 315 },
          { type: 'xp', value: 1705 },
          { type: 'gold', value: 2558 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Smash it quickly (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 63,
      },
      outcome: {
        text: 'You destroy it before taking too much heat! Victory!',
        effects: [
          { type: 'damage', target: 'strongest', value: 328 },
          { type: 'xp', value: 1725 },
          { type: 'gold', value: 2588 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
  ],
  depth: 57,
  icon: GiCometSpark,
}
