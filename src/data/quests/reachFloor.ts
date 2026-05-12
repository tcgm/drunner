import type { QuestTemplate } from './types'

export const REACH_FLOOR_TEMPLATES: QuestTemplate[] = [
    { type: 'reach_floor', difficulty: 'easy', title: 'Into the Dark', descriptionFn: req => `Reach Floor ${req} in a single run.`, base: 1.2, exp: 0.7, goldPerReq: 65, xpPerReq: 12, rarityPool: ['common', 'uncommon', 'rare'] },
    { type: 'reach_floor', difficulty: 'medium', title: 'Depth Diver', descriptionFn: req => `Descend to Floor ${req} or deeper in a single run.`, base: 1.2, exp: 0.7, goldPerReq: 75, xpPerReq: 15, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
    { type: 'reach_floor', difficulty: 'hard', title: 'Legend of the Deep', descriptionFn: req => `Reach the treacherous Floor ${req} in a single run.`, base: 1.2, exp: 0.7, goldPerReq: 50, xpPerReq: 10, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },
]
