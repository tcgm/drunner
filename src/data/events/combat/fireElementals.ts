import type { DungeonEvent } from '@/types'
import { GiFireSpellCast } from 'react-icons/gi'

export const FIRE_ELEMENTALS: DungeonEvent = {
    id: 'fire-elementals',
    type: 'combat',
    title: 'Fire Elementals',
    description: [
        { weight: 3, text: 'Flames coalesce into humanoid shapes that rush toward you!' },
        { weight: 2, text: 'Living fire bursts from the walls, forming aggressive elementals!' },
        { weight: 1, text: 'The temperature spikes as fire elementals materialize!' },
    ],
    choices: [
        {
            text: 'Fight with caution',
            outcome: {
                text: 'You battle the blazing creatures, suffering burns!',
                effects: [
                    { type: 'damage', target: 'all', value: 22 },
                    { type: 'xp', value: 85 },
                    { type: 'gold', value: 70 },
                ],
            },
        },
        {
            text: 'Douse them with water (requires item)',
            requirements: {
                item: 'Water Flask',
            },
            outcome: {
                text: 'Steam explodes as the elementals are extinguished!',
                effects: [
                    { type: 'damage', target: 'random', value: 10 },
                    { type: 'xp', value: 100 },
                    { type: 'gold', value: 85 },
                ],
            },
        },
        {
            text: 'Counter with ice magic (Wizard bonus)',
            requirements: {
                class: 'Wizard',
            },
            outcome: {
                text: 'Your frost spells freeze the elementals solid!',
                effects: [
                    { type: 'damage', target: 'random', value: 8 },
                    { type: 'xp', value: 105 },
                    { type: 'gold', value: 90 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 8 },
                ],
            },
        },
        {
            text: 'Retreat quickly',
            outcome: {
                text: 'Flames lick at you as you flee!',
                effects: [
                    { type: 'damage', target: 'all', value: 20 },
                    { type: 'xp', value: 40 },
                ],
            },
        },
    ],
    depth: 9,
    icon: GiFireSpellCast,
}
