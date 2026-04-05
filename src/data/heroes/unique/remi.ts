import type { UniqueHeroDefinition } from './_types'

/** Angel of thunder and visions. The visions are more useful. The thunder is exactly as loud as you'd expect. */
export const remi: UniqueHeroDefinition = {
    id: 'remi',
    name: 'Remiel',
    species: 'angel',
    heroRarity: 'rare',
    level: 3,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 7 },
        { stat: 'speed', value: 6 },
        { stat: 'wisdom', value: 4 },
    ],
    hireCostOverride: 950,
    lore: 'She has visions of what\'s coming and then hits it with thunder when it arrives. The party considers this comprehensive coverage.',
}
