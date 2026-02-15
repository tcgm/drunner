import type { DungeonEvent } from '@/types'
import { GIANT_RAT } from './giantRat'
import { GOBLIN_CHIEF } from './goblinChief'
import { RABID_WOLF } from './rabidWolf'
import { GIANT_SLIME } from './giantSlime'
import { GIANT_BAT } from './giantBat'
import { WILD_BOAR } from './wildBoar'
import { ZOMBIE_BRUTE } from './zombieBrute'
import { ROGUE_APPRENTICE } from './rogueApprentice'

/**
 * Intro Bosses - Designed specifically for Floor 1
 * These are intentionally easier to help players learn combat mechanics
 * Classic "first MMO boss" encounters with 14-20 damage range
 */
export const INTRO_BOSS_EVENTS: DungeonEvent[] = [
  GIANT_RAT,
  GOBLIN_CHIEF,
  RABID_WOLF,
  GIANT_SLIME,
  GIANT_BAT,
  WILD_BOAR,
  ZOMBIE_BRUTE,
  ROGUE_APPRENTICE,
]
