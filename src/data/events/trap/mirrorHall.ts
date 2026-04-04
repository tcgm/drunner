import type { DungeonEvent } from '@/types'
import { GiMirrorMirror } from 'react-icons/gi'

export const MIRROR_HALL: DungeonEvent = {
    id: 'mirror-hall',
    type: 'trap',
    title: 'Mirror Hall',
    description: 'A corridor lined with mirrors stretching to the ceiling. Your reflections move slightly off, and the path ahead seems to fork and loop. The disorientation is clearly intentional.',
    choices: [
        {
            text: 'Navigate by logic — ignore the mirrors (Luck check)',
            successChance: 0.55,
            statModifier: 'luck',
            successOutcome: {
                text: 'You keep your eyes down and reason through the geometry. Clean exit.',
                effects: [
                    { type: 'xp', value: 50 },
                ],
            },
            failureOutcome: {
                text: 'You spend an hour going in circles. Exhausted and confused, you eventually stumble out.',
                effects: [
                    { type: 'damage', target: 'all', value: 15 },
                    { type: 'xp', value: 15 },
                ],
            },
        },
        {
            text: 'Smash the mirrors',
            outcome: {
                text: 'Shards everywhere, but the illusion shatters with them. Your hands pay for it.',
                effects: [
                    { type: 'damage', target: 'all', value: 20 },
                    { type: 'xp', value: 30 },
                    { type: 'gold', value: 30 },
                ],
            },
        },
        {
            text: 'Follow the reflection that moves wrongly',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'An old trick — the imperfect reflection is the real one. It leads you out.',
                effects: [
                    { type: 'xp', value: 70 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon' },
                ],
            },
            failureOutcome: {
                text: 'The trick works backwards here. An hour wasted before you find the exit.',
                effects: [
                    { type: 'damage', target: 'all', value: 10 },
                ],
            },
        },
    ],
    depth: 6,
    icon: GiMirrorMirror,
}
