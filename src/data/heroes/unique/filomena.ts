import type { UniqueHeroDefinition } from './_types'

/** A gnome bard who plays seven instruments simultaneously using a harness of her own design. It is wildly impractical. The music is extraordinary. */
export const filomena: UniqueHeroDefinition = {
    id: 'filomena',
    name: 'Filomena Brasstrap',
    species: 'gnome',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 8 },
        { stat: 'luck', value: 6 },
        { stat: 'wisdom', value: 4 },
    ],
    hireCostOverride: 1250,
    lore: 'She plays seven instruments simultaneously using a harness of her own design. It is wildly impractical. The music is extraordinary.',
}
