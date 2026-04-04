import type { DungeonEvent } from '@/types'
import { GiMushroom } from 'react-icons/gi'

export const MUSHROOM_CIRCLE: DungeonEvent = {
    id: 'mushroom-circle',
    type: 'rest',
    title: 'Glowing Mushroom Circle',
    description: "A perfect ring of bioluminescent mushrooms pulses with soft blue-green light. The spores in the air carry a faint, pleasant scent.",
    choices: [
        {
            text: 'Eat the glowing mushrooms (Luck check)',
            successChance: 0.55,
            statModifier: 'luck',
            successOutcome: {
                text: 'The mushrooms are medicinal! A warm glow spreads through the party.',
                effects: [
                    { type: 'heal', target: 'all', fullHeal: true },
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'The spores are mildly hallucinogenic. Disorienting but surprisingly invigorating once it passes.',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'heal', target: 'all', value: 30 },
                ],
            },
        },
        {
            text: 'Harvest the mushrooms carefully',
            outcome: {
                text: 'You collect a bundle of the healing fungi for later use.',
                effects: [
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'xp', value: 25 },
                ],
            },
        },
        {
            text: 'Meditate in the circle',
            outcome: {
                text: 'The circle amplifies focus. You emerge refreshed in mind and spirit.',
                effects: [
                    { type: 'heal', target: 'all', value: 35 },
                    { type: 'xp', value: 55 },
                ],
            },
        },
    ],
    depth: 5,
    icon: GiMushroom,
}
