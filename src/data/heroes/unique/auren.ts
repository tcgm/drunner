import type { UniqueHeroDefinition } from './_types'

/** An angel warrior reassigned from divine messenger to dungeon combatant after what he describes as "a series of miscommunications." */
export const auren: UniqueHeroDefinition = {
    id: 'auren',
    name: 'Auren Lightfall',
    species: 'angel',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'warrior',
    statBonuses: [
        { stat: 'defense', value: 5 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 460,
    lore: 'He was reassigned from divine messenger to dungeon combatant after what he describes as "a series of miscommunications." The paperwork is still being sorted out.',
}
