import type { DungeonEvent } from '@/types'
import { GiWaterfall } from 'react-icons/gi'

export const ANCIENT_CISTERN: DungeonEvent = {
    id: 'ancient-cistern',
    type: 'rest',
    title: 'Ancient Cistern',
    description: 'A vast underground cistern holds still, dark water fed by an unknown spring. The stonework is ancient but immaculate.',
    choices: [
        {
            text: 'Drink deeply from the cistern',
            outcome: {
                text: 'The water is cold and pure, washing away fatigue and minor injuries.',
                effects: [
                    { type: 'heal', target: 'all', value: 70 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Fill all available flasks',
            outcome: {
                text: 'You load up with clean water — priceless in the dungeon depths.',
                effects: [
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'heal', target: 'all', value: 20 },
                ],
            },
        },
        {
            text: 'Consecrate the water (Paladin/Cleric class bonus)',
            requirements: {
                class: ['Paladin', 'Cleric'],
            },
            outcome: {
                text: 'You consecrate the cistern. The water becomes a potent healing draught.',
                effects: [
                    { type: 'heal', target: 'all', fullHeal: true },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                    { type: 'xp', value: 70 },
                ],
            },
        },
    ],
    depth: 6,
    icon: GiWaterfall,
}
