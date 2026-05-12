import type { UniqueHeroDefinition } from './_types'

/** A dryad cleric who worships no god — she is the god, she says. Forests grow where she bleeds. She heals with the certainty of spring. */
export const mosshallow: UniqueHeroDefinition = {
    id: 'mosshallow',
    name: 'Mosshallow',
    species: 'dryad',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 6 },
        { stat: 'magicPower', value: 4 },
        { stat: 'charisma', value: 3 },
    ],
    hireCostOverride: 650,
    lore: 'She insists she is not religious. The small shrine of river stones and pressed flowers she carries everywhere is "just aesthetic."',
}
