import type { DungeonEvent } from '@/types'
import { GiFire } from 'react-icons/gi'

export const FIRE_TRAP: DungeonEvent = {
    id: 'fire-trap',
    type: 'trap',
    title: 'Fire Jet Trap',
    description: 'Scorch marks line the walls ahead, and the heat makes your eyes water. Nozzles are set into the floor at regular intervals.',
    choices: [
        {
            text: 'Time the jets carefully (Speed check)',
            successChance: 0.55,
            statModifier: 'speed',
            successOutcome: {
                text: 'You dart through between blasts, not a hair singed.',
                effects: [
                    { type: 'xp', value: 55 },
                ],
            },
            failureOutcome: {
                text: 'A jet catches you mid-stride. The burns are painful.',
                effects: [
                    { type: 'damage', target: 'random', value: 40, isTrueDamage: true },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Disable the mechanism (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'You find the valve and shut it off. The passage goes cold.',
                effects: [
                    { type: 'xp', value: 70 },
                ],
            },
            failureOutcome: {
                text: 'The valve breaks off in your hand and the pressure increases. Run!',
                effects: [
                    { type: 'damage', target: 'all', value: 25, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Shield formation — absorb and push through',
            outcome: {
                text: 'You brace shields together and wade through the scorching corridor.',
                effects: [
                    { type: 'damage', target: 'all', value: 20 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Find another way around',
            outcome: {
                text: 'A longer route, but no one gets burned.',
                effects: [
                    { type: 'xp', value: 15 },
                ],
            },
        },
    ],
    depth: 4,
    icon: GiFire,
}
