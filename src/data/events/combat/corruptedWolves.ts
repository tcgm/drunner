import type { DungeonEvent } from '@/types'
import { GiWolfHead } from 'react-icons/gi'

export const CORRUPTED_WOLVES: DungeonEvent = {
    id: 'corrupted-wolves',
    type: 'combat',
    title: 'Corrupted Wolves',
    description: [
        { weight: 3, text: 'A pack of dark-furred wolves with glowing red eyes emerges from the shadows!' },
        { weight: 2, text: 'Snarling wolves with corrupted flesh circle around you!' },
        { weight: 1, text: 'The howls of twisted wolves echo through the corridor!' },
    ],
    choices: [
        {
            text: 'Stand your ground',
            outcome: {
                text: 'You brace yourself as the wolves attack in waves!',
                effects: [
                    { type: 'damage', target: 'random', value: 18 },
                    { type: 'xp', value: 55 },
                    { type: 'gold', value: 30 },
                ],
            },
        },
        {
            text: 'Target the alpha (Attack check)',
            requirements: {
                stat: 'attack',
                minValue: 35,
            },
            outcome: {
                text: 'You slay the pack leader! The others flee in terror!',
                effects: [
                    { type: 'damage', target: 'random', value: 10 },
                    { type: 'xp', value: 70 },
                    { type: 'gold', value: 45 },
                    { type: 'item', itemType: 'boots', minRarity: 'common', rarityBoost: 3 },
                ],
            },
        },
        {
            text: 'Use nature magic (Ranger bonus)',
            requirements: {
                class: 'Ranger',
            },
            outcome: {
                text: 'Your connection with nature calms the corrupted beasts!',
                effects: [
                    { type: 'xp', value: 75 },
                    { type: 'gold', value: 40 },
                ],
            },
        },
        {
            text: 'Retreat',
            outcome: {
                text: 'The wolves chase you down and bite at your heels!',
                effects: [
                    { type: 'damage', target: 'all', value: 12 },
                    { type: 'xp', value: 25 },
                ],
            },
        },
    ],
    depth: 3,
    icon: GiWolfHead,
}
