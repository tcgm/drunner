import type { DungeonEvent } from '@/types'
import { GiCryptEntrance } from 'react-icons/gi'

export const FORGOTTEN_CRYPT: DungeonEvent = {
    id: 'forgotten-crypt',
    type: 'treasure',
    title: 'Forgotten Crypt',
    description: 'A sealed crypt lies behind a crumbling wall. Ancient bones surround a stone sarcophagus adorned with offerings.',
    choices: [
        {
            text: 'Open the sarcophagus',
            possibleOutcomes: [
                {
                    weight: 50,
                    outcome: {
                        text: 'The crypt holds the remains of a wealthy warrior. Their equipment is remarkably well preserved.',
                        effects: [
                            { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 5 },
                            { type: 'gold', value: 80 },
                        ],
                    },
                },
                {
                    weight: 30,
                    outcome: {
                        text: 'The corpse lurches to life! You fight it off but take wounds.',
                        effects: [
                            { type: 'damage', target: 'all', value: 25 },
                            { type: 'item', itemType: 'random', minRarity: 'common' },
                            { type: 'gold', value: 50 },
                        ],
                    },
                },
                {
                    weight: 20,
                    outcome: {
                        text: 'Nothing but dust — but ceremonial gold offerings line the walls.',
                        effects: [
                            { type: 'gold', value: 150 },
                        ],
                    },
                },
            ],
        },
        {
            text: 'Collect only the gold offerings',
            outcome: {
                text: 'You respectfully take the offerings without disturbing the remains.',
                effects: [
                    { type: 'gold', value: 90 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Leave it undisturbed',
            outcome: {
                text: 'You walk past with quiet reverence.',
                effects: [{ type: 'xp', value: 15 }],
            },
        },
    ],
    depth: 5,
    icon: GiCryptEntrance,
}
