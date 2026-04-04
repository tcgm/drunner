import type { DungeonEvent } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

export const RUNIC_ORE: DungeonEvent = {
    id: 'runic-ore',
    type: 'mining',
    title: 'Runic Ore Vein',
    description: 'Strange runes are naturally formed in the mineral pattern of this ore vein — not carved, but grown. The ore hums faintly when touched.',
    choices: [
        {
            text: 'Mine it carefully, preserving the runes',
            outcome: {
                text: 'You extract ore fragments with the rune patterns intact. Strange and valuable.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Study the runes before mining (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The rune pattern reveals something useful — ancient knowledge encoded in stone.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 80 },
                ],
            },
            failureOutcome: {
                text: 'The runes react poorly to your scrutiny. The vein flares with magical discharge.',
                effects: [
                    { type: 'damage', target: 'all', value: 20, isTrueDamage: true },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Channel the magic to enhance the extraction',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'The runes amplify your effort. The ore practically leaps into your hands.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                ],
            },
            failureOutcome: {
                text: 'The channel backfires. The vein shatters outward in a burst of arcane shards.',
                effects: [
                    { type: 'damage', target: 'all', value: 30, isTrueDamage: true },
                ],
            },
        },
    ],
    depth: 7,
    icon: GiMagicSwirl,
}
