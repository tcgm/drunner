import type { SpeciesDefinition } from './_types'

export const oni: SpeciesDefinition = {
  id: 'oni',
  name: 'Oni',
  description: 'Iron-skinned demon-giants of towering fury, as unyielding in battle as the mountains they haunt.',
  statBonuses: [
    { stat: 'attack', value: 4 },
    { stat: 'defense', value: 3 },
    { stat: 'maxHp', value: 10 },
  ],
  nameStyle: 'yokai',
  spawnRarity: 'uncommon',
}
