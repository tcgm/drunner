import type { DungeonEvent } from '@/types'
import { GiGoblinHead } from 'react-icons/gi'

export const GOBLIN_SALESMAN: DungeonEvent = {
    id: 'goblin-salesman',
    type: 'merchant',
    title: 'Goblin Salesman',
    description: 'A grinning goblin waves you over with an armful of items of questionable provenance. "Very cheap! Very good! Probably not cursed!"',
    choices: [
        {
            text: 'Buy the mystery bag (Luck check)',
            requirements: { gold: 25 },
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'It\'s actually good! The goblin looks almost disappointed.',
                effects: [
                    { type: 'gold', value: -25 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
                ],
            },
            failureOutcome: {
                text: 'A handful of broken pottery and a live spider. Classic goblin.',
                effects: [
                    { type: 'gold', value: -25 },
                    { type: 'damage', target: 'random', value: 10 },
                ],
            },
        },
        {
            text: 'Haggle aggressively (Luck check)',
            requirements: { gold: 15 },
            successChance: 0.55,
            statModifier: 'luck',
            successOutcome: {
                text: 'You talk him down to nearly nothing. He hands over actual goods in a sulk.',
                effects: [
                    { type: 'gold', value: -15 },
                    { type: 'item', itemType: 'random', minRarity: 'common' },
                ],
            },
            failureOutcome: {
                text: 'He takes your coin and runs. You\'re left with nothing.',
                effects: [
                    { type: 'gold', value: -15 },
                ],
            },
        },
        {
            text: 'Buy a cheap healing potion (risky quality)',
            requirements: { gold: 20 },
            outcome: {
                text: 'The label reads "Definitely Healing". It mostly works.',
                effects: [
                    { type: 'gold', value: -20 },
                    { type: 'heal', target: 'random', value: 30 },
                ],
            },
        },
        {
            text: 'Chase him off',
            outcome: {
                text: 'He scurries away, hurling insults.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
    ],
    depth: 2,
    icon: GiGoblinHead,
}
