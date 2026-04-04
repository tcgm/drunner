import type { DungeonEvent } from '@/types'
import { GiNightVision } from 'react-icons/gi'

export const SHADOW_CRYSTAL: DungeonEvent = {
    id: 'shadow-crystal',
    type: 'mining',
    title: 'Shadow Crystal Deposit',
    description: 'Clusters of pitch-black crystals grow from the ceiling and walls, absorbing torchlight around them. The area near them is oddly, deeply dark.',
    choices: [
        {
            text: 'Mine carefully in the dark',
            outcome: {
                text: 'Blind work by feel alone. You chip out what you can.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Bring more light — torches and power orbs',
            outcome: {
                text: 'With enough light sources, the crystals\' dampening effect is overcome. Excellent yield.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                    { type: 'xp', value: 35 },
                ],
            },
        },
        {
            text: 'Study the light-absorption effect first (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'You understand the effect and use it to your advantage, mining unseen by any watchers.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'The darkness disorients one hero badly. They stumble into a sharp formation.',
                effects: [
                    { type: 'damage', target: 'random', value: 25 },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
    ],
    depth: 11,
    icon: GiNightVision,
}
