import type { DungeonEvent } from '@/types'
import { GiPendulumSwing } from 'react-icons/gi'

export const BLADE_PENDULUM: DungeonEvent = {
    id: 'blade-pendulum',
    type: 'trap',
    title: 'Blade Pendulum',
    description: 'Enormous bladed pendulums sweep the corridor in long, rhythmic arcs. The blades are old but still razor-sharp.',
    choices: [
        {
            text: 'Synchronise and dash through (Speed check)',
            successChance: 0.5,
            statModifier: 'speed',
            successOutcome: {
                text: 'Perfect timing. You all slip through the arcs without a scratch.',
                effects: [
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'One blade catches a hero across the side. A nasty gash.',
                effects: [
                    { type: 'damage', target: 'random', value: 50 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Jam the mechanism (Attack check)',
            requirements: { stat: 'attack', minValue: 60 },
            successChance: 0.65,
            statModifier: 'attack',
            successOutcome: {
                text: 'You drive your weapon into the gear teeth and the blades groan to a halt.',
                effects: [
                    { type: 'xp', value: 80 },
                ],
            },
            failureOutcome: {
                text: 'Your weapon shatters on the mechanism. You narrowly avoid the rebound blade.',
                effects: [
                    { type: 'damage', target: 'random', value: 35 },
                ],
            },
        },
        {
            text: 'Crawl under the arc (takes time)',
            outcome: {
                text: 'Low and slow. It works, but your knees ache.',
                effects: [
                    { type: 'damage', target: 'all', value: 10 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Back away and find another path',
            outcome: {
                text: 'The pendulums keep swinging as you retreat.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
    ],
    depth: 6,
    icon: GiPendulumSwing,
}
