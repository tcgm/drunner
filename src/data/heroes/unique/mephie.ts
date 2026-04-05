import type { UniqueHeroDefinition } from './_types'

/** She makes deals. Always in your favor, she says. She means it. She was thinking twelve steps ahead. You were thinking one. */
export const mephie: UniqueHeroDefinition = {
  id: 'mephie',
  name: 'Mephie',
  species: 'devil',
  heroRarity: 'legendary',
  level: 5,
  classId: 'necromancer',
  statBonuses: [
    { stat: 'wisdom', value: 12 },
    { stat: 'magicPower', value: 10 },
    { stat: 'charisma', value: 8 },
  ],
  hireCostOverride: 3400,
  lore: 'She makes deals. Always in your favor, she insists. You sign. It was technically in your favor. She was thinking twelve steps ahead. You were thinking one. She considers this fair.',
}
