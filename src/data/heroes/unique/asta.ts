import type { UniqueHeroDefinition } from './_types'

/** Demon of knowledge and art. She can tell you anything. She will also draw you a picture while she talks. The picture will be disturbingly accurate. */
export const asta: UniqueHeroDefinition = {
  id: 'asta',
  name: 'Asta',
  species: 'devil',
  heroRarity: 'epic',
  level: 4,
  classId: 'mage',
  statBonuses: [
    { stat: 'wisdom', value: 10 },
    { stat: 'magicPower', value: 8 },
    { stat: 'charisma', value: 6 },
  ],
  hireCostOverride: 2100,
  lore: 'She knows things. A great many things. She shares them freely. She also sketches your portrait while talking. The portrait is disturbingly accurate. She says "observation." No more.',
}
