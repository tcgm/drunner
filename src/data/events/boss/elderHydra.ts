import type { DungeonEvent } from '@/types'
import { GiSeaDragon } from 'react-icons/gi'

export const ELDER_HYDRA: DungeonEvent = {
    id: 'elder-hydra',
    type: 'boss',
    title: 'Elder Hydra',
    description: 'A massive hydra with seven heads rises from the murky waters. Each head weaves independently, searching for prey. Its scales shimmer with an iridescent sheen.',
    choices: [
        {
            text: 'Attack all heads at once',
            outcome: {
                text: 'You fight desperately against all seven heads, suffering grievous wounds!',
                effects: [
                    { type: 'damage', target: 'all', value: 60 },
                    { type: 'xp', value: 350 },
                    { type: 'gold', value: 440 },
                    { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 12 },
                ],
            },
        },
        {
            text: 'Target the central head (Attack check)',
            requirements: {
                stat: 'attack',
                minValue: 35,
            },
            outcome: {
                text: 'Your powerful strike severs the dominant head, causing the others to falter!',
                effects: [
                    { type: 'damage', target: 'all', value: 45 },
                    { type: 'xp', value: 420 },
                    { type: 'gold', value: 530 },
                    { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 18 },
                ],
            },
        },
        {
            text: 'Cleave through multiple heads (Warrior bonus)',
            requirements: {
                class: 'Warrior',
            },
            outcome: {
                text: 'With a mighty swing, you cleave through three heads in one blow!',
                effects: [
                    { type: 'damage', target: 'all', value: 40 },
                    { type: 'xp', value: 450 },
                    { type: 'gold', value: 560 },
                    { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 20 },
                ],
            },
        },
        {
            text: 'Dive underwater to escape',
            outcome: {
                text: 'The hydra catches you before you reach the water, its fangs tearing into you.',
                effects: [
                    { type: 'damage', target: 'random', value: 45 },
                    { type: 'xp', value: 90 },
                ],
            },
        },
    ],
    depth: 25,
    icon: GiSeaDragon,
}
