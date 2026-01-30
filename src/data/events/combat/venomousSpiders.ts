import type { DungeonEvent } from '@/types'
import { GiSpiderFace } from 'react-icons/gi'

export const VENOMOUS_SPIDERS: DungeonEvent = {
    id: 'venomous-spiders',
    type: 'combat',
    title: 'Venomous Spiders',
    description: [
        { weight: 3, text: 'Giant spiders descend from webs above, fangs dripping venom!' },
        { weight: 2, text: 'You walk into a massive web, and its creators emerge!' },
        { weight: 1, text: 'Chittering echoes as dozens of glowing eyes appear in the darkness!' },
    ],
    choices: [
        {
            text: 'Fight through the swarm',
            outcome: {
                text: 'You crush spiders but suffer numerous venomous bites!',
                effects: [
                    { type: 'damage', target: 'all', value: 26 },
                    { type: 'xp', value: 90 },
                    { type: 'gold', value: 65 },
                ],
            },
        },
        {
            text: 'Burn the webs (Luck check)',
            requirements: {
                stat: 'luck',
                minValue: 60,
            },
            outcome: {
                text: 'The flames spread quickly, destroying the spider nest!',
                effects: [
                    { type: 'damage', target: 'random', value: 15 },
                    { type: 'xp', value: 110 },
                    { type: 'gold', value: 85 },
                    { type: 'item', itemType: 'boots', minRarity: 'uncommon', rarityBoost: 7 },
                ],
            },
        },
        {
            text: 'Track the queen (Ranger bonus)',
            requirements: {
                class: 'Ranger',
            },
            outcome: {
                text: 'You find and slay the broodmother! The others scatter!',
                effects: [
                    { type: 'damage', target: 'random', value: 12 },
                    { type: 'xp', value: 120 },
                    { type: 'gold', value: 95 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 9 },
                ],
            },
        },
        {
            text: 'Escape the nest',
            outcome: {
                text: 'Spiders swarm over you as you flee!',
                effects: [
                    { type: 'damage', target: 'all', value: 30 },
                    { type: 'xp', value: 40 },
                ],
            },
        },
    ],
    depth: 6,
    icon: GiSpiderFace,
}
