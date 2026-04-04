import type { DungeonEvent } from '@/types'
import { GiDiamondHard } from 'react-icons/gi'

export const GEM_CLUSTER: DungeonEvent = {
    id: 'gem-cluster',
    type: 'mining',
    title: 'Gem Cluster',
    description: 'A small cluster of semi-precious gems protrudes from the rock at eye level, glinting in your torchlight. Easy to reach, though the rock around them is dense.',
    choices: [
        {
            text: 'Chip them out carefully',
            outcome: {
                text: 'Slow, precise work. You extract each gem intact.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 1 },
                    { type: 'gold', value: 40 },
                ],
            },
        },
        {
            text: 'Smash the surrounding rock for more',
            successChance: 0.55,
            statModifier: 'luck',
            successOutcome: {
                text: 'The rock breaks cleanly and reveals a deeper cluster beneath.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'gold', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'The gems shatter along with the rock. You salvage a few fragments.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                    { type: 'gold', value: 15 },
                ],
            },
        },
        {
            text: 'Leave them — not worth stopping for',
            outcome: {
                text: 'They catch the light behind you as you walk on.',
                effects: [],
            },
        },
    ],
    depth: 2,
    icon: GiDiamondHard,
}
