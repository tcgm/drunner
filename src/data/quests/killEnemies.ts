import type { QuestTemplate } from './types'

export const KILL_ENEMIES_TEMPLATES: QuestTemplate[] = [
    // Rarity pools: ordered lowest → highest for rollRarity().
    // Easy   → common .. rare
    // Medium → uncommon .. magical
    // Hard   → rare .. legendary
    // base doubled from 4→8 to account for more combat nodes per run with the map system
    { type: 'kill_enemies', difficulty: 'easy', title: 'Pest Control', descriptionFn: req => `Defeat ${req} enemies in the dungeon.`, base: 8, exp: 1.0, goldPerReq: 8, xpPerReq: 1.5, rarityPool: ['common', 'uncommon', 'rare'] },
    { type: 'kill_enemies', difficulty: 'medium', title: 'Dungeon Cleanse', descriptionFn: req => `Slay ${req} foul creatures lurking in the depths.`, base: 8, exp: 1.0, goldPerReq: 10, xpPerReq: 2.0, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
    { type: 'kill_enemies', difficulty: 'hard', title: 'Extermination Order', descriptionFn: req => `Eliminate ${req} monsters from the dungeon's cursed halls.`, base: 8, exp: 1.0, goldPerReq: 13, xpPerReq: 2.5, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },
]
