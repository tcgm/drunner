import type { UniqueHeroDefinition } from './_types'

/** A tanuki rogue who shapeshifts into one specific boulder and has used this same disguise in seventeen dungeons. Nobody has caught him. */
export const tokkuri: UniqueHeroDefinition = {
    id: 'tokkuri',
    name: 'Tokkuri',
    species: 'tanuki',
    heroRarity: 'rare',
    level: 3,
    classId: 'trickster',
    statBonuses: [
        { stat: 'luck', value: 8 },
        { stat: 'speed', value: 5 },
        { stat: 'charisma', value: 3 },
    ],
    hireCostOverride: 900,
    lore: 'He shapeshifts into one specific boulder. He has used this exact boulder disguise in seventeen different dungeons. Nobody has caught him yet. He considers this a flawless strategy.',
}
