import type { DungeonEvent } from '@/types'
import { GiGasMask } from 'react-icons/gi'

export const POISON_GAS_VENT: DungeonEvent = {
    id: 'poison-gas-vent',
    type: 'trap',
    title: 'Poison Gas Vent',
    description: 'A faint hissing fills the air, and a sickly green tinge colours the corridor ahead. Gas is seeping through vents in the walls.',
    choices: [
        {
            text: 'Hold breath and sprint through (Speed check)',
            successChance: 0.5,
            statModifier: 'speed',
            successOutcome: {
                text: 'Everyone makes it through before their lungs gave out.',
                effects: [
                    { type: 'xp', value: 45 },
                ],
            },
            failureOutcome: {
                text: 'The gas burns your throat. You push through spluttering and weakened.',
                effects: [
                    { type: 'damage', target: 'all', value: 25, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Seal the vents (Attack check)',
            requirements: { stat: 'attack', minValue: 50 },
            outcome: {
                text: 'You jam debris into the vent openings and the hissing stops.',
                effects: [
                    { type: 'xp', value: 60 },
                ],
            },
        },
        {
            text: 'Use bandages as makeshift masks',
            requirements: { gold: 0 },
            outcome: {
                text: 'The wet bandages buy enough time to cross without taking the worst of it.',
                effects: [
                    { type: 'damage', target: 'all', value: 10 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Retreat and find a different route',
            outcome: {
                text: 'You backtrack and take the long way around. Safe, but slow.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
    ],
    depth: 5,
    icon: GiGasMask,
}
