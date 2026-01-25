// Merchant event aggregator - auto-discovers all events in this directory
import type { DungeonEvent } from '@/types'

const eventModules = import.meta.glob<{ default?: DungeonEvent; [key: string]: unknown }>('./*.ts', { eager: true })

export const MERCHANT_EVENTS: DungeonEvent[] = Object.values(eventModules)
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
