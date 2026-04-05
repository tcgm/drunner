import type { UniqueHeroDefinition } from './_types'

/** A genuinely, completely happy oni bard who considers dungeons fun and finds monsters interesting. */
export const bogrin: UniqueHeroDefinition = {
    id: 'bogrin',
    name: 'Bogrin the Joyful',
    species: 'oni',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 5 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 460,
    lore: 'He is genuinely, completely happy at all times. He considers dungeons fun. He finds monsters interesting. Everyone around him finds his relentless positivity either deeply comforting or deeply unnerving.',
}
