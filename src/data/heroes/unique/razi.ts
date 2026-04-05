import type { UniqueHeroDefinition } from './_types'

/** Keeper of divine secrets. She knows everything. She tells you when you need to know and not before, which is always at the worst possible moment. */
export const razi: UniqueHeroDefinition = {
    id: 'razi',
    name: 'Raziel',
    species: 'angel',
    heroRarity: 'epic',
    level: 4,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 9 },
        { stat: 'magicPower', value: 9 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 2000,
    lore: 'She knows every divine secret ever written. She tells you what you need when you need it, which is always, somehow, at the worst possible moment. She says the timing is intentional.',
}
