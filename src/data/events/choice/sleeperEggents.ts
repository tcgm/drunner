import type { DungeonEvent } from '@/types'
import { GiEggClutch, GiEgyptianBird } from 'react-icons/gi'

export const SLEEPER_EGGENTS: DungeonEvent = {
    id: 'sleeper-eggents',
    type: 'choice',
    title: 'Sleeper Eggents',
    description: 'You encounter a group of mysterious figures standing in formation, each holding a peculiar egg-shaped artifact. They speak in cryptic phrases about awakening and transformation. "To activate," their leader says, "one must choose: heat from fire, or fire from heat?"',
    choices: [
        {
            text: 'Heat from fire',
            outcome: {
                text: 'The eggents spring into action! Their artifacts glow with rainbow light as they transform, revealing their true power. They gift you powerful items and share ancient wisdom about becoming who you truly are.',
                effects: [
                    { type: 'xp', value: 200 },
                    { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 15 },
                    { type: 'heal', target: 'all', value: 40 },
                    { type: 'gold', value: 150 },
                ],
            },
        },
        {
            text: 'Fire from heat',
            outcome: {
                text: 'The eggents nod in understanding! The artifacts crack open, releasing waves of transformative energy. The agents embrace their awakening and shower your party with blessings and rare treasures.',
                effects: [
                    { type: 'xp', value: 200 },
                    { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 15 },
                    { type: 'heal', target: 'all', value: 40 },
                    { type: 'gold', value: 150 },
                ],
            },
        },
        {
            text: 'Question their riddle',
            outcome: {
                text: 'The eggents exchange knowing glances. "Not yet awakened," one whispers. They vanish in a shimmer of light, leaving behind a small gift.',
                effects: [
                    { type: 'xp', value: 50 },
                    { type: 'gold', value: 75 },
                ],
            },
        },
        {
            text: 'Attack the suspicious group',
            outcome: {
                text: 'The eggents defend themselves with surprising ferocity! Their artifacts explode in brilliant flashes. When the dust settles, they are gone, and your party is wounded.',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                    { type: 'gold', value: 50 },
                ],
            },
        },
    ],
    depth: 10,
    icon: GiEggClutch,
}
