import type { QuestTemplate } from './types'

export const EARN_GOLD_TEMPLATES: QuestTemplate[] = [
    { type: 'earn_gold', difficulty: 'easy', title: 'Gold Rush', descriptionFn: req => `Earn ${req.toLocaleString()} gold from dungeon runs.`, base: 20, exp: 1.2, goldPerReq: 0.5, xpPerReq: 0.1, rarityPool: ['common', 'uncommon', 'rare'] },
    { type: 'earn_gold', difficulty: 'medium', title: 'Treasure Hunter', descriptionFn: req => `Collect ${req.toLocaleString()} gold from dungeon expeditions.`, base: 20, exp: 1.2, goldPerReq: 0.6, xpPerReq: 0.12, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
    { type: 'earn_gold', difficulty: 'hard', title: 'Hoard of the Ages', descriptionFn: req => `Amass ${req.toLocaleString()} gold from the dark dungeon vaults.`, base: 20, exp: 1.2, goldPerReq: 0.8, xpPerReq: 0.15, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },
]
