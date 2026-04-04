import type { DungeonEvent } from '@/types'
import { GiHotSurface } from 'react-icons/gi'

export const HOT_SPRING: DungeonEvent = {
    id: 'hot-spring',
    type: 'rest',
    title: 'Underground Hot Spring',
    description: 'Geothermal heat warms a natural pool of crystal-clear water. Steam rises in lazy spirals, and the air smells of minerals.',
    choices: [
        {
            text: 'Soak and rest fully',
            outcome: {
                text: 'The heat soaks away the aches and wounds of battle. Everyone feels restored.',
                effects: [
                    { type: 'heal', target: 'all', value: 90 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Fill flasks and take a quick dip',
            outcome: {
                text: 'You refill your waterskins with the healing water and bathe quickly.',
                effects: [
                    { type: 'heal', target: 'all', value: 40 },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'health-potion-small' },
                ],
            },
        },
        {
            text: 'Keep moving — no time to rest',
            outcome: {
                text: 'You press on.',
                effects: [],
            },
        },
    ],
    depth: 3,
    icon: GiHotSurface,
}
