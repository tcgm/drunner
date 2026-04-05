import type { UniqueHeroDefinition } from './_types'

/** Angel of repentance and fire. She takes both seriously. The fire noticeably more so. */
export const uri: UniqueHeroDefinition = {
    id: 'uri',
    name: 'Uriel',
    species: 'angel',
    heroRarity: 'epic',
    level: 4,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 10 },
        { stat: 'wisdom', value: 7 },
        { stat: 'defense', value: 5 },
    ],
    hireCostOverride: 2100,
    lore: 'Angel of repentance and fire. She takes both seriously. The fire noticeably more so. She describes this as "balanced priorities."',
}
