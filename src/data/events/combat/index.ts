// Combat event aggregator - auto-discovers all events in this directory
import type { DungeonEvent } from '@/types'

// Import all event modules dynamically
const eventModules = import.meta.glob<{ default?: DungeonEvent; [key: string]: unknown }>('./*.ts', { eager: true })

// Extract all exported DungeonEvent objects
export const COMBAT_EVENTS: DungeonEvent[] = Object.values(eventModules)
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
