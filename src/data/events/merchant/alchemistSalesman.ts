import type { DungeonEvent } from '@/types'
import { GiChemicalDrop } from 'react-icons/gi'

export const ALCHEMIST_SALESMAN: DungeonEvent = {
    id: 'alchemist-salesman',
    type: 'merchant',
    title: 'Alchemist Salesman',
    description: 'A travelling alchemist has set up a bubbling stall. Flasks and vials clutter every surface, each one labelled in cramped handwriting.',
    choices: [
        {
            text: 'Buy a bundle of healing potions',
            requirements: { gold: 60 },
            outcome: {
                text: 'You load up on standard healing potions.',
                effects: [
                    { type: 'gold', value: -60 },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                ],
            },
        },
        {
            text: 'Buy a strength elixir',
            requirements: { gold: 75 },
            outcome: {
                text: 'A potent red elixir. You feel the power before you\'ve even opened it.',
                effects: [
                    { type: 'gold', value: -75 },
                    { type: 'consumable', consumableId: 'strength-elixir' },
                ],
            },
        },
        {
            text: 'Buy an iron skin potion',
            requirements: { gold: 75 },
            outcome: {
                text: 'Your skin feels like hammered iron after just one sip.',
                effects: [
                    { type: 'gold', value: -75 },
                    { type: 'consumable', consumableId: 'iron-skin-potion' },
                ],
            },
        },
        {
            text: 'Browse the experimental shelf (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'You pick a mystery vial and it turns out to be a lucky elixir. Delightful.',
                effects: [
                    { type: 'consumable', consumableId: 'luck-elixir' },
                    { type: 'xp', value: 30 },
                ],
            },
            failureOutcome: {
                text: 'The mystery vial tastes awful and does nothing. The alchemist looks embarrassed.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
        {
            text: 'Leave — too expensive',
            outcome: {
                text: 'You move on with your gold intact.',
                effects: [],
            },
        },
    ],
    depth: 2,
    icon: GiChemicalDrop,
}
