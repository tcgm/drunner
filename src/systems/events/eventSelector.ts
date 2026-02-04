import type { DungeonEvent, EventType } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { 
  ALL_EVENTS, 
  EVENT_TYPE_WEIGHTS, 
  getEventsByType 
} from '@data/events'

/**
 * NOTE: The "depth" property in event data is a LEGACY TERM that actually means "minimum floor".
 * Events with depth: 5 become available starting from floor 5.
 * The depth parameter passed to functions is still the actual event count for future use.
 */

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
    // Get boss events available at current floor (using depth property as minFloor)
    let bossEvents = getEventsByType('boss').filter(e => 
      e.depth <= floor && !excludeIds.includes(e.id)
    )
    
    // Check if this is THE final boss (Floor 100)
    const isFinalFloor = floor >= GAME_CONFIG.dungeon.maxFloors
    
    if (isFinalFloor) {
      // Only show the final boss at Floor 100
      const finalBoss = bossEvents.find(e => (e as any).isFinalBoss)
      if (finalBoss) return finalBoss
    } else {
      // Exclude final boss from appearing before Floor 100
      bossEvents = bossEvents.filter(e => !(e as any).isFinalBoss)
    }
    
    // For major bosses (every 10 floors), look for zone-specific boss
    if (isMajorBoss && !isFinalFloor) {
      const zoneBoss = bossEvents.find(e => (e as any).zoneBossFloor === floor)
      if (zoneBoss) return zoneBoss
      
      // Fallback to random boss if no zone boss found
      const sortedBosses = [...bossEvents]
        .filter(e => !(e as any).isZoneBoss) // Exclude other zone bosses
      if (sortedBosses.length > 0) {
        return sortedBosses[Math.floor(Math.random() * sortedBosses.length)]
      }
    }
    
    if (bossEvents.length > 0) {
      // For regular floor bosses, random selection (exclude zone bosses)
      const regularBosses = bossEvents.filter(e => !(e as any).isZoneBoss)
      if (regularBosses.length > 0) {
        return regularBosses[Math.floor(Math.random() * regularBosses.length)]
      }
      // Fallback to any boss if no regular bosses
      return bossEvents[Math.floor(Math.random() * bossEvents.length)]
    }
  }
  
  // Filter regular events available at current floor (using depth property as minFloor)
  const availableEvents = ALL_EVENTS.filter(e => 
    e.type !== 'boss' && 
    e.depth <= floor && 
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
