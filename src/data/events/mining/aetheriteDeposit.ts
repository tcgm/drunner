import type { DungeonEvent } from '@/types'
import { GiStarSattelites } from 'react-icons/gi'

export const AETHERITE_DEPOSIT: DungeonEvent = {
    id: 'aetherite-deposit',
    type: 'mining',
    title: 'Aetherite Deposit',
    description: 'Patches of iridescent ore glimmer with an inner light that shifts between colours. Aetherite — formed where raw magical energy was absorbed into rock over ages. Even a fragment is worth a fortune to the right buyer.',
    choices: [
        {
            text: 'Mine cautiously — this material is volatile',
            outcome: {
                text: 'Slow, careful work yields modest but genuine aetherite.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 40 },
                ],
            },
        },
        {
            text: 'Mine aggressively for maximum yield (Luck check)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'It doesn\'t detonate. You come away with a spectacular haul of aetherite.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'A fragment discharges. The magical explosion rattles everyone\'s bones.',
                effects: [
                    { type: 'damage', target: 'all', value: 45, isTrueDamage: true },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Attune to the magic first, then harvest',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The aetherite resonates with your intent. Extraction is almost effortless.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                    { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 15 },
                ],
            },
            failureOutcome: {
                text: 'You can\'t match the frequency. The ore rejects you and destabilises.',
                effects: [
                    { type: 'damage', target: 'all', value: 25, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Leave it — too dangerous',
            outcome: {
                text: 'Aetherite finds its way to collectors eventually. You\'ll let someone else deal with it.',
                effects: [],
            },
        },
    ],
    depth: 13,
    icon: GiStarSattelites,
}
