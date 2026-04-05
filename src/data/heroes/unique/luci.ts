import type { UniqueHeroDefinition } from './_types'

/** The morning star. The brightest. The fallen. She considers the official version of events incomplete and the smirk is constant. */
export const luci: UniqueHeroDefinition = {
  id: 'luci',
  name: 'Luci',
  species: 'devil',
  heroRarity: 'mythic',
  level: 6,
    classId: 'archdevil',
  statBonuses: [
    { stat: 'charisma', value: 16 },
    { stat: 'magicPower', value: 12 },
    { stat: 'wisdom', value: 10 },
  ],
  hireCostOverride: 6500,
  lore: 'She was the brightest. She fell. She has very specific thoughts about the official version of events. She keeps them mostly to herself. The smirk, however, is constant.',
}
