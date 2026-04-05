import type { UniqueHeroDefinition } from './_types'

/** A drakin mage who breathes fire already and considers adding spellwork entirely natural. */
export const zoraith: UniqueHeroDefinition = {
    id: 'zoraith',
    name: 'Zoraith Emberscale',
    species: 'drakin',
    heroRarity: 'rare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 7 },
        { stat: 'wisdom', value: 5 },
        { stat: 'luck', value: 3 },
    ],
    hireCostOverride: 950,
    lore: 'She breathes fire already. The addition of spellwork felt, she says, "natural." The dungeon\'s fire resistance ratings have not adjusted for her presence.',
}
