import type { DungeonEvent } from '@/types'
import { GiVortex } from 'react-icons/gi'

export const VOID_TEAR: DungeonEvent = {
    id: 'void-tear',
    type: 'trap',
    title: 'Void Tear',
    description: 'A jagged rift in reality hangs in the middle of the corridor, pulsing with absolute darkness. Objects near it drift sideways as if gravity has opinions.',
    choices: [
        {
            text: 'Seal it with focused willpower (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'You pour concentration into the rift and it collapses with an implosion you feel in your teeth.',
                effects: [
                    { type: 'xp', value: 90 },
                ],
            },
            failureOutcome: {
                text: 'The rift pulls at you. Something is momentarily ripped from your grasp.',
                effects: [
                    { type: 'damage', target: 'random', value: 60, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Edge around the walls',
            successChance: 0.65,
            statModifier: 'speed',
            successOutcome: {
                text: 'Pressing tight to the wall, you all get past without being pulled in.',
                effects: [
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'The pull is stronger than expected. A hero is yanked sideways into the rift\'s edge.',
                effects: [
                    { type: 'damage', target: 'random', value: 45, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Toss something metallic in and study it',
            outcome: {
                text: 'The object disappears with a loud hiss. Useful data. Terrible experience.',
                effects: [
                    { type: 'xp', value: 50 },
                ],
            },
        },
    ],
    depth: 12,
    icon: GiVortex,
}
