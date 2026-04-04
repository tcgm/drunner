import type { SpeciesDefinition } from './_types'

export const nekomata: SpeciesDefinition = {
  id: 'nekomata',
  name: 'Nekomata',
  description: 'Twin-tailed cat demons of lethal grace — blur of claws before you ever see them coming.',
  statBonuses: [
    { stat: 'speed', value: 5 },
    { stat: 'luck', value: 3 },
  ],
  nameStyle: 'yokai',
  spawnRarity: 'uncommon',
}
