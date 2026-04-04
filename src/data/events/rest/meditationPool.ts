import type { DungeonEvent } from '@/types'
import { GiLotus } from 'react-icons/gi'

export const MEDITATION_POOL: DungeonEvent = {
    id: 'meditation-pool',
    type: 'rest',
    title: 'Meditation Pool',
    description: 'A still, mirror-black pool sits in a perfectly circular chamber. The air hums with latent magical energy. This is a place of quiet power.',
    choices: [
        {
            text: 'Meditate beside the pool',
            outcome: {
                text: 'Hours feel like minutes. The party emerges sharper and more focused than ever.',
                effects: [
                    { type: 'heal', target: 'all', value: 55 },
                    { type: 'xp', value: 90 },
                ],
            },
        },
        {
            text: 'Drink from the mystical pool',
            possibleOutcomes: [
                {
                    weight: 65,
                    outcome: {
                        text: 'The water fills you with strange energy, healing body and invigorating spirit.',
                        effects: [
                            { type: 'heal', target: 'all', value: 100 },
                            { type: 'xp', value: 40 },
                        ],
                    },
                },
                {
                    weight: 35,
                    outcome: {
                        text: 'A vision overwhelms you — powerful but disorienting.',
                        effects: [
                            { type: 'damage', target: 'random', value: 20, isTrueDamage: true },
                            { type: 'xp', value: 120 },
                            { type: 'heal', target: 'all', value: 50 },
                        ],
                    },
                },
            ],
        },
        {
            text: 'Study the magical properties',
            outcome: {
                text: 'The pool holds secrets of arcane theory. You document everything.',
                effects: [
                    { type: 'xp', value: 140 },
                ],
            },
        },
    ],
    depth: 8,
    icon: GiLotus,
}
