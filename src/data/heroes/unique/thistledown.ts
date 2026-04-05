import type { UniqueHeroDefinition } from './_types'

/** A fae bard who performs for audiences only she can see. They applaud enthusiastically. */
export const thistledown: UniqueHeroDefinition = {
    id: 'thistledown',
    name: 'Thistledown',
    species: 'fae',
    heroRarity: 'rare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'luck', value: 7 },
        { stat: 'charisma', value: 6 },
        { stat: 'speed', value: 3 },
    ],
    hireCostOverride: 900,
    lore: 'She performs for audiences only she can see. They applaud enthusiastically. When asked if this bothers her, she says the visible audience is the less important one.',
}
