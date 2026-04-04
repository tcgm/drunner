import type { DungeonEvent } from '@/types'
import { GiPoisonBottle } from 'react-icons/gi'

export const TOXIC_SPORE_VEIN: DungeonEvent = {
    id: 'toxic-spore-vein',
    type: 'mining',
    title: 'Toxic Spore Vein',
    description: 'A vein of bioluminescent green ore pulses softly in the wall. Spores drift from cracks in the surrounding rock — the ore is infested with a parasitic fungus.',
    choices: [
        {
            text: 'Mine through bandage-masks (some exposure)',
            outcome: {
                text: 'The improvised masks do most of the job. A small dose gets through.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'damage', target: 'all', value: 15, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Clear the fungus with fire, then mine',
            successChance: 0.65,
            statModifier: 'luck',
            successOutcome: {
                text: 'The fire burns off the spores cleanly. You mine in clear air.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 30 },
                ],
            },
            failureOutcome: {
                text: 'The heat causes a spore pocket to rupture. Everyone catches a faceful.',
                effects: [
                    { type: 'damage', target: 'all', value: 30, isTrueDamage: true },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Harvest the fungus too — might be useful',
            outcome: {
                text: 'Peculiar stuff. You pack both ore and fungal matter. An alchemist could do something with this.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 1 },
                    { type: 'gold', value: 50 },
                    { type: 'damage', target: 'random', value: 20, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Don\'t touch it',
            outcome: {
                text: 'Anything glowing green in a dungeon is best left alone.',
                effects: [],
            },
        },
    ],
    depth: 6,
    icon: GiPoisonBottle,
}
