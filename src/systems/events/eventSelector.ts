import type { DungeonEvent, EventType } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { 
  ALL_EVENTS, 
  EVENT_TYPE_WEIGHTS, 
  getEventsByType 
} from '@data/events'

/**
 * Select a random event based on current dungeon state and weighted probabilities
 */
export function selectRandomEvent(
  depth: number, 
  floor: number,
  isFloorBoss: boolean,
  isMajorBoss: boolean,
  excludeIds: string[] = []
): DungeonEvent | null {
  // If this should be a floor boss or major boss
  if (isFloorBoss || isMajorBoss) {
    const bossEvents = getEventsByType('boss').filter(e => 
      e.depth <= depth && !excludeIds.includes(e.id)
    )
    if (bossEvents.length > 0) {
      // For major bosses (every N floors), prefer higher depth bosses
      if (isMajorBoss) {
        const sortedBosses = [...bossEvents].sort((a, b) => b.depth - a.depth)
        return sortedBosses[0]
      }
      // For regular floor bosses, random selection
      return bossEvents[Math.floor(Math.random() * bossEvents.length)]
    }
  }
  
  // Filter events available at current depth
  const availableEvents = ALL_EVENTS.filter(e => 
    e.type !== 'boss' && 
    e.depth <= depth && 
    !excludeIds.includes(e.id)
  )
  
  if (availableEvents.length === 0) {
    return null
  }
  
  // Select event type based on weights
  const eventType = selectWeightedEventType()
  
  // Get events of selected type
  const typeEvents = availableEvents.filter(e => e.type === eventType)
  
  if (typeEvents.length === 0) {
    // Fallback to any available event if no events of selected type
    return availableEvents[Math.floor(Math.random() * availableEvents.length)]
  }
  
  // Return random event of selected type
  return typeEvents[Math.floor(Math.random() * typeEvents.length)]
}

/**
 * Select event type based on weighted probabilities
 */
function selectWeightedEventType(): EventType {
  const weights = EVENT_TYPE_WEIGHTS
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  const random = Math.random() * totalWeight
  
  let cumulative = 0
  for (const [type, weight] of Object.entries(weights)) {
    cumulative += weight
    if (random <= cumulative) {
      return type as EventType
    }
  }
  
  // Fallback to combat
  return 'combat'
}

/**
 * Get all events suitable for a given depth
 */
export function getEventsForDepth(depth: number): DungeonEvent[] {
  return ALL_EVENTS.filter(e => e.depth <= depth)
}

/**
 * Get next event, respecting recently seen events to avoid repetition
 */
export function getNextEvent(
  depth: number,
  floor: number,
  isFloorBoss: boolean,
  isMajorBoss: boolean,
  recentEventIds: string[], 
  maxRecent: number = 10
): DungeonEvent | null {
  const excludeIds = recentEventIds.slice(-maxRecent)
  return selectRandomEvent(depth, floor, isFloorBoss, isMajorBoss, excludeIds)
}
