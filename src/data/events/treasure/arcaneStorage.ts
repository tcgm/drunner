import type { DungeonEvent } from '@/types'
import { GiLockedChest } from 'react-icons/gi'

export const ARCANE_STORAGE: DungeonEvent = {
    id: 'arcane-storage',
    type: 'treasure',
    title: 'Arcane Storage Room',
    description: 'Magical seals preserve a long-abandoned storage chamber. Artifacts float in suspended stasis fields, perfectly preserved.',
    choices: [
        {
            text: 'Dispel the stasis fields (Mage only)',
            requirements: {
                class: 'Mage',
            },
            outcome: {
                text: 'Your magic unravels the fields perfectly, preserving every artifact within.',
                effects: [
                    { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 10 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon' },
                    { type: 'xp', value: 80 },
                ],
            },
        },
        {
            text: 'Smash the stasis fields',
            possibleOutcomes: [
                {
                    weight: 60,
                    outcome: {
                        text: 'The fields collapse violently but most items survive.',
                        effects: [
                            { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 5 },
                            { type: 'damage', target: 'random', value: 25, isTrueDamage: true },
                        ],
                    },
                },
                {
                    weight: 40,
                    outcome: {
                        text: 'The magical backlash destroys most items. You salvage fragments and gold.',
                        effects: [
                            { type: 'item', itemType: 'random', minRarity: 'common' },
                            { type: 'damage', target: 'all', value: 20, isTrueDamage: true },
                            { type: 'gold', value: 80 },
                        ],
                    },
                },
            ],
        },
        {
            text: 'Study the sealing runes without breaking them',
            outcome: {
                text: 'The arcane knowledge within is deeply instructive.',
                effects: [
                    { type: 'xp', value: 110 },
                ],
            },
        },
    ],
    depth: 9,
    icon: GiLockedChest,
}
