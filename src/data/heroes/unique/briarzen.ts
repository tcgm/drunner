import type { UniqueHeroDefinition } from './_types'

/** A young dryad shaman who communes with storm spirits. Her bark crackles with static when she is excited — which is always. */
export const briarzen: UniqueHeroDefinition = {
    id: 'briarzen',
    name: 'Briarzen Stormbloom',
    species: 'dryad',
    heroRarity: 'rare',
    level: 3,
    classId: 'shaman',
    statBonuses: [
        { stat: 'magicPower', value: 9 },
        { stat: 'speed', value: 4 },
        { stat: 'wisdom', value: 3 },
    ],
    hireCostOverride: 1050,
    lore: 'The other dryads call her "the one who smells like lightning." She considers this a compliment. The spirits she summons are loud, she is louder.',
}
