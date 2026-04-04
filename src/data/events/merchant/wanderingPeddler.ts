import type { DungeonEvent } from '@/types'
import { GiTwoCoins, GiPowderBag } from 'react-icons/gi'

export const WANDERING_PEDDLER: DungeonEvent = {
    id: 'wandering-peddler',
    type: 'merchant',
    title: 'Wandering Peddler',
    description: 'A scruffy peddler trudges past with a cart full of odds and ends. His prices are suspiciously low.',
    choices: [
        {
            text: 'Buy rations and bandages',
            requirements: { gold: 30 },
            outcome: {
                text: 'You stock up on trail essentials.',
                effects: [
                    { type: 'gold', value: -30 },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'consumable', consumableId: 'rations' },
                ],
            },
        },
        {
            text: 'Buy a healing potion',
            requirements: { gold: 40 },
            outcome: {
                text: 'A small potion, but better than nothing.',
                effects: [
                    { type: 'gold', value: -40 },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                ],
            },
        },
        {
            text: 'Check if he has anything rare (Luck check)',
            successChance: 0.35,
            statModifier: 'luck',
            successOutcome: {
                text: 'He pulls out a dusty gem he\'d been sitting on for months.',
                effects: [
                    { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 5 },
                ],
            },
            failureOutcome: {
                text: 'Nothing but junk. He shrugs apologetically.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
        {
            text: 'No thanks',
            outcome: {
                text: 'You wave him off and move on.',
                effects: [],
            },
        },
    ],
    depth: 1,
    icon: GiPowderBag,
}
