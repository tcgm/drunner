import type { UniqueHeroDefinition } from './_types'

/** Heaven's voice and divine scribe. She has been asked to look something up exactly once. It took eleven years. She considers this very fast. */
export const meta: UniqueHeroDefinition = {
    id: 'meta',
    name: 'Meta',
    species: 'angel',
    heroRarity: 'mythic',
    level: 6,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 18 },
        { stat: 'magicPower', value: 14 },
        { stat: 'charisma', value: 8 },
    ],
    hireCostOverride: 6000,
    lore: 'Heaven\'s voice and divine scribe. Every event in history is somewhere in her notes. She was once asked to look something up. It took eleven years. She considers this remarkably fast.',
}
