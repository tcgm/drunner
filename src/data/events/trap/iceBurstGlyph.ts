import type { DungeonEvent } from '@/types'
import { GiFrozenOrb } from 'react-icons/gi'

export const ICE_BURST_GLYPH: DungeonEvent = {
    id: 'ice-burst-glyph',
    type: 'trap',
    title: 'Ice Burst Glyph',
    description: 'A shimmering blue rune is inscribed on the floor. The temperature drops sharply as you approach. Someone didn\'t want visitors.',
    choices: [
        {
            text: 'Study and disarm the glyph (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'You trace the counterspell correctly and the glyph fades harmlessly.',
                effects: [
                    { type: 'xp', value: 65 },
                ],
            },
            failureOutcome: {
                text: 'A spray of ice shards erupts from the rune. Painful and cold.',
                effects: [
                    { type: 'damage', target: 'all', value: 30, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Trigger it deliberately from a distance',
            outcome: {
                text: 'You toss a stone onto the rune. Ice detonates harmlessly ahead of you.',
                effects: [
                    { type: 'xp', value: 40 },
                ],
            },
        },
        {
            text: 'Step over it very carefully',
            successChance: 0.6,
            statModifier: 'speed',
            successOutcome: {
                text: 'Inch by inch, you all make it across without activating it.',
                effects: [
                    { type: 'xp', value: 35 },
                ],
            },
            failureOutcome: {
                text: 'One misstep and everyone is flash-frozen for a moment.',
                effects: [
                    { type: 'damage', target: 'all', value: 20 },
                ],
            },
        },
    ],
    depth: 5,
    icon: GiFrozenOrb,
}
