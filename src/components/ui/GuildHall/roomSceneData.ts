export interface RoomSpot { id: string; x: number; y: number; label: string; flavor: string }

export const ROOM_SPOTS: RoomSpot[] = [
  { id: 'fireplace',   x: 13, y: 47, label: 'Fireplace',   flavor: 'warming by the fire' },
  { id: 'table_l',     x: 33, y: 52, label: 'Table',       flavor: 'sharing tales of glory' },
  { id: 'table_r',     x: 48, y: 52, label: 'Table',       flavor: 'plotting the next run' },
  { id: 'bar',         x: 73, y: 48, label: 'Bar',         flavor: 'drinking hard-earned ale' },
  { id: 'noticeboard', x: 62, y: 20, label: 'Notice Board',flavor: 'scouting available quests' },
  { id: 'entrance',    x: 31, y: 76, label: 'Entrance',    flavor: 'just arrived from the dungeon' },
  { id: 'corner',      x: 17, y: 28, label: 'Corner',      flavor: 'keeping a watchful eye' },
]

/** Level → hex border/glow color for hero tokens */
export function heroLevelColor(level: number): string {
  if (level >= 18) return '#ffa500'
  if (level >= 14) return '#ffd700'
  if (level >= 10) return '#a855f7'
  if (level >= 6)  return '#3b82f6'
  if (level >= 3)  return '#22c55e'
  return '#9ca3af'
}
