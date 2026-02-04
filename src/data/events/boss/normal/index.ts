// Boss event aggregator - auto-discovers all events in this directory and zone bosses
import type { DungeonEvent } from '@/types'

const normalBossModules = import.meta.glob<{ default?: DungeonEvent; [key: string]: unknown }>('./*.ts', { eager: true })
const zoneBossModules = import.meta.glob<{ default?: DungeonEvent; [key: string]: unknown }>('../zone/*.ts', { eager: true })

const allBossModules = { ...normalBossModules, ...zoneBossModules }

export const BOSS_EVENTS: DungeonEvent[] = Object.values(allBossModules)
  .filter(module => module !== undefined)
  .flatMap(module => 
    Object.values(module).filter((exp): exp is DungeonEvent => 
      exp !== null && 
      typeof exp === 'object' && 
      'id' in exp && 
      'type' in exp && 
      'title' in exp
    )
  )
