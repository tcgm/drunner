import type { SpeciesDefinition } from './_types'

export const dryad: SpeciesDefinition = {
  id: 'dryad',
  name: 'Dryad',
  description: 'Ancient spirits of wood and root, dryads are bound to the living forest. Their wisdom runs deep as old roots, and their magic blooms as naturally as wildflowers.',
  statBonuses: [
    { stat: 'wisdom', value: 4 },
    { stat: 'magicPower', value: 3 },
    { stat: 'speed', value: 2 },
  ],
  nameStyle: 'sylvan',
  spawnRarity: 'rare',
}
