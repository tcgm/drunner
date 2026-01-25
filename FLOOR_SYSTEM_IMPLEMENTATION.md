# Floor-Based Progression System

## Summary

Converted the dungeon progression from a simple depth-based system (1 event = 1 depth) to a more meaningful floor-based system where multiple events occur per floor, culminating in a boss event before descending to the next floor.

## Configuration

Added to `GAME_CONFIG.dungeon`:
- **`eventsPerFloor: 4`** - Number of normal events before floor boss
- **`allowMerchantBeforeBoss: true`** - Can merchant appear before boss
- **`allowRestBeforeBoss: true`** - Can rest appear before boss

## Data Structure Changes

### Dungeon Interface
```typescript
interface Dungeon {
  depth: number // Total events completed (for backwards compatibility)
  floor: number // Current floor number
  eventsThisFloor: number // Events completed on current floor (0-4)
  isNextEventBoss?: boolean // Indicates if next event is a floor boss
  // ... existing fields
}
```

### Run Interface
```typescript
interface Run {
  startFloor?: number // Floor when run started
  finalFloor?: number // Final floor reached
  // ... existing fields
}
```

## Migration System

Created `src/utils/migration.ts` with:
- **`migrateDungeon()`** - Converts old depth-only dungeons to floor-based
- **`migrateRun()`** - Adds floor tracking to old runs
- **`migrateGameState()`** - Migrates entire game state
- **`floorToDepth()`** - Conversion helper
- **`depthToFloor()`** - Conversion helper

Migration runs automatically when loading save data in `gameStore.ts`.

## Progression Flow

**Old System:**
```
Event 1 (Depth 1) → Event 2 (Depth 2) → Event 3 (Depth 3) → ...
```

**New System:**
```
Floor 1:
  ├─ Event 1 (normal)
  ├─ Event 2 (normal)  
  ├─ Event 3 (normal)
  ├─ Event 4 (normal)
  └─ Event 5 (BOSS) → Descend to Floor 2

Floor 2:
  ├─ Event 1 (harder)
  ...
```

## Benefits

1. **Meaningful Milestones** - Boss fights mark real progress
2. **Better Pacing** - Floors feel substantial (5 events each)
3. **Clearer Difficulty Scaling** - Floor-based jumps create "bumps" in difficulty curve
4. **Strategic Depth** - Players must manage resources across multiple events before boss
5. **Backwards Compatible** - All existing saves automatically migrate

## Implementation Details

- **Depth tracking** maintained for backwards compatibility
- **Floor tracking** introduced as primary progression metric
- **Boss events** triggered when `eventsThisFloor >= eventsPerFloor`
- **Floor transition** occurs after boss event completion
- All dungeon resets (start, victory, retreat) initialize with floor system
- Migration runs on every save load to ensure consistency
