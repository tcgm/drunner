import type { DungeonEvent } from '@/types'

// Import all event type arrays from subdirectories
import { COMBAT_EVENTS } from './combat'
import { TREASURE_EVENTS } from './treasure'
import { CHOICE_EVENTS } from './choice'
import { REST_EVENTS } from './rest'
import { MERCHANT_EVENTS } from './merchant'
import { TRAP_EVENTS } from './trap'
import { BOSS_EVENTS } from './boss'

// Export all event arrays
export {
  COMBAT_EVENTS,
  TREASURE_EVENTS,
  CHOICE_EVENTS,
  REST_EVENTS,
  MERCHANT_EVENTS,
  TRAP_EVENTS,
  BOSS_EVENTS,
}

// Combined array of all events
export const ALL_EVENTS: DungeonEvent[] = [
  ...COMBAT_EVENTS,
  ...TREASURE_EVENTS,
  ...CHOICE_EVENTS,
  ...REST_EVENTS,
  ...MERCHANT_EVENTS,
  ...TRAP_EVENTS,
  ...BOSS_EVENTS,
]

// Event type distribution percentages (from GAME_DESIGN.md)
export const EVENT_TYPE_WEIGHTS = {
  combat: 40,
  treasure: 20,
  choice: 20,
  rest: 10,
  merchant: 5,
  trap: 5,
  boss: 0, // Special - only at specific depths
}

// Helper function to get events by type
export function getEventsByType(type: DungeonEvent['type']): DungeonEvent[] {
  switch (type) {
    case 'combat':
      return COMBAT_EVENTS
    case 'treasure':
      return TREASURE_EVENTS
    case 'choice':
      return CHOICE_EVENTS
    case 'rest':
      return REST_EVENTS
    case 'merchant':
      return MERCHANT_EVENTS
    case 'trap':
      return TRAP_EVENTS
    case 'boss':
      return BOSS_EVENTS
    default:
      return []
  }
}

// Helper function to get events by depth
export function getEventsByDepth(depth: number, type?: DungeonEvent['type']): DungeonEvent[] {
  const events = type ? getEventsByType(type) : ALL_EVENTS
  return events.filter(event => event.depth <= depth)
}

// Helper function to get random event from array
export function getRandomEvent(events: DungeonEvent[]): DungeonEvent | null {
  if (events.length === 0) return null
  const index = Math.floor(Math.random() * events.length)
  return events[index]
}

// Helper function to check if hero meets choice requirements
export function meetsRequirements(
  choice: DungeonEvent['choices'][0],
  heroClass: string,
  stats: { [key: string]: number },
  gold: number
): boolean {
  if (!choice.requirements) return true

  const req = choice.requirements

  // Check class requirement
  if (req.class && heroClass !== req.class) {
    return false
  }

  // Check stat requirement
  if (req.stat && req.minValue) {
    const statValue = stats[req.stat] || 0
    if (statValue < req.minValue) {
      return false
    }
  }

  // Check gold requirement (simplified - would need actual gold check)
  if (req.item === 'gold' && gold <= 0) {
    return false
  }

  return true
}
