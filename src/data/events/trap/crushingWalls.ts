import type { DungeonEvent } from '@/types'
import { GiBrickWall } from 'react-icons/gi'

export const CRUSHING_WALLS: DungeonEvent = {
    id: 'crushing-walls',
    type: 'trap',
    title: 'Crushing Walls',
    description: 'You step past the threshold and hear a heavy click. Stone walls on both sides begin grinding inward. The gap is already narrowing.',
    choices: [
        {
            text: 'Find the stop mechanism (Luck check — time critical)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'You locate a hidden lever and yank it hard. The walls freeze with inches to spare.',
                effects: [
                    { type: 'xp', value: 80 },
                ],
            },
            failureOutcome: {
                text: 'You can\'t find it in time. Everyone gets squeezed before bursting through the far side.',
                effects: [
                    { type: 'damage', target: 'all', value: 40 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Sprint for the far exit (Speed check)',
            successChance: 0.55,
            statModifier: 'speed',
            successOutcome: {
                text: 'Everyone dives through the exit with a hair to spare.',
                effects: [
                    { type: 'xp', value: 50 },
                ],
            },
            failureOutcome: {
                text: 'Not fast enough. The walls close in before the last hero clears the threshold.',
                effects: [
                    { type: 'damage', target: 'random', value: 55 },
                ],
            },
        },
        {
            text: 'Brace against the walls (Attack check)',
            requirements: { stat: 'attack', minValue: 70 },
            successChance: 0.5,
            statModifier: 'attack',
            successOutcome: {
                text: 'Impossible strength holds the walls apart long enough for everyone to pass.',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'No one is that strong. The party gets compacted.',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                ],
            },
        },
    ],
    depth: 9,
    icon: GiBrickWall,
}
