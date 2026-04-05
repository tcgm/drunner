import type { UniqueHeroDefinition } from './_types'

/** A hellborn bard who smells faintly of ash and honey and plays cheerful songs about dark places. People feel better after listening. */
export const sprig: UniqueHeroDefinition = {
    id: 'sprig',
    name: 'Sprig Cinderbloom',
    species: 'hellborn',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'luck', value: 5 },
        { stat: 'charisma', value: 5 },
    ],
    hireCostOverride: 470,
    lore: 'She smells faintly of ash and honey. She plays cheerful songs about dark places. People feel better after listening. She considers this her whole purpose and it is enough.',
}
