import type { DungeonEvent } from '@/types'

export const BLOOD_BATS: DungeonEvent = {
    id: 'blood-bats',
    type: 'combat',
    title: 'Blood Bats',
    description: [
        { weight: 3, text: 'A swarm of vampire bats descends, screeching hungrily!' },
        { weight: 2, text: 'Hundreds of red-eyed bats pour from crevices in the ceiling!' },
        { weight: 1, text: 'The air fills with leathery wings and sharp fangs!' },
    ],
    choices: [
        {
            text: 'Swat them away',
            outcome: {
                text: 'You fend off the swarm but suffer many bites!',
                effects: [
                    { type: 'damage', target: 'all', value: 24 },
                    { type: 'xp', value: 80 },
                    { type: 'gold', value: 60 },
                ],
            },
        },
        {
            text: 'Create noise (Luck check)',
            requirements: {
                stat: 'luck',
                minValue: 55,
            },
            outcome: {
                text: 'Your loud noise disorients the bats, sending them fleeing!',
                effects: [
                    { type: 'damage', target: 'random', value: 12 },
                    { type: 'xp', value: 100 },
                    { type: 'gold', value: 80 },
                    { type: 'item', itemType: 'boots', minRarity: 'uncommon', rarityBoost: 6 },
                ],
            },
        },
        {
            text: 'Swift strikes (Rogue bonus)',
            requirements: {
                class: 'Rogue',
            },
            outcome: {
                text: 'Your quick blade work decimates the swarm!',
                effects: [
                    { type: 'damage', target: 'random', value: 10 },
                    { type: 'xp', value: 105 },
                    { type: 'gold', value: 85 },
                    { type: 'item', itemType: 'accessory2', minRarity: 'rare', rarityBoost: 8 },
                ],
            },
        },
        {
            text: 'Run blindly',
            outcome: {
                text: 'The bats drain blood as you stumble through the dark!',
                effects: [
                    { type: 'damage', target: 'all', value: 28 },
                    { type: 'xp', value: 35 },
                ],
            },
        },
    ],
    depth: 8,
}
