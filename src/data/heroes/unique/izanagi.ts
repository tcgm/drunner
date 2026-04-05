import type { UniqueHeroDefinition } from './_types'

/** An oni necromancer who died twice, came back angrier each time, and the second time brought friends. He doesn't explain where the friends came from. */
export const izanagi: UniqueHeroDefinition = {
    id: 'izanagi',
    name: 'Izanagi Twice-Broken',
    species: 'oni',
    heroRarity: 'legendary',
    level: 5,
    classId: 'necromancer',
    statBonuses: [
        { stat: 'magicPower', value: 12 },
        { stat: 'wisdom', value: 10 },
        { stat: 'maxHp', value: 20 },
    ],
    hireCostOverride: 3200,
    lore: 'He died twice. Both times he came back angrier. The second time he brought friends. He does not explain where the friends came from.',
}
