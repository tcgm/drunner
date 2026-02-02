import type { DungeonEvent } from '@/types'
import { GiSpikedDragonHead } from 'react-icons/gi'

export const DRAKE_MATRIARCH: DungeonEvent = {
  id: 'drake-matriarch',
  type: 'boss',
  title: 'Drake Matriarch',
  description: 'A scarred drake guards her nest fiercely. Her scales are battle-worn but her fangs and claws remain razor sharp. Fury burns in her eyes.',
  choices: [
    {
      text: 'Face her wrath',
      outcome: {
        text: 'The protective mother fights with savage desperation! Her bite is vicious!',
        effects: [
          { type: 'damage', target: 'all', value: 78 },
          { type: 'xp', value: 335 },
          { type: 'gold', value: 445 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Calm the beast (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You show no threat to her eggs! She allows you to pass peacefully!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 380 },
          { type: 'gold', value: 500 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Strike vital spots (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 20,
      },
      outcome: {
        text: 'You target the gaps in her scales! Critical hits bring her down fast!',
        effects: [
          { type: 'damage', target: 'strongest', value: 62 },
          { type: 'xp', value: 372 },
          { type: 'gold', value: 487 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiSpikedDragonHead,
}
