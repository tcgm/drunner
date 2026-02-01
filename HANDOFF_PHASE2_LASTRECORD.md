# Project Handoff - Dungeon Runner

**Date:** February 1, 2026  
**Status:** Phase 2 Active - 75% Complete  
**Phase 1:** ✅ COMPLETE

---

## 📊 Phase 2 Progress Report (Updated: Feb 1, 2026)

**Overall Status: 75% Complete** 🎯

### ✅ Fully Completed (4/6 major features)
1. **Enhanced UI Animations** - 100% Done
2. **Combat Feedback** - 95% Done (comprehensive implementation)
3. **Statistics & Tracking** - 100% Done (20+ metrics)
4. **Save System** - 100% Done (auto-save + backups)

### ⚠️ Partially Complete (1/6)
5. **Balance Pass** - 50% Done (systems in place, needs tuning)

### ❌ Not Started (1/6)
6. **Audio** - 0% Done (deprioritized to Phase 3)

**Recommendation:** Focus on balance tuning and playtesting to reach 100% Phase 2 completion.

---

## 🎉 Phase 1 Completed!

Phase 1 MVP Foundation is fully implemented and working. All core systems are operational:
- Party setup with 8 classes
- Event system with 7 types and 50+ templates
- Auto-resolve combat
- Loot generation with rarities and equipment
- XP/leveling progression
- Death penalty system
- Full UI flow (menu → setup → dungeon → game over)

---

## 🔴 ARCHITECTURE VITAL WARNING

**ALL content data files MUST follow the Individual File Principle:**

- ✅ **DO:** One class per file (`warrior.ts`, `mage.ts`, etc.)
- ✅ **DO:** One event per file in category folders
- ✅ **DO:** One material per file in rarity folders
- ✅ **DO:** Use `index.ts` with auto-discovery or explicit re-exports
- ❌ **DON'T:** Create monolithic files (`allClasses.ts`, `allEvents.ts`, `data.ts`)
- ❌ **DON'T:** Put multiple classes/events in one file
- ❌ **DON'T:** Manually maintain imports without clear structure

**This is not a suggestion - it's a hard requirement. See `docs/technical/architecture.md` and `docs/GUIDELINES.md` for full details.**

---

## Project Overview

**Dungeon Runner** is an event-based, procedurally generated roguelike dungeon crawler built with React, TypeScript, and Chakra UI. Players manage a party of customizable heroes, making strategic choices as they descend through a dangerous dungeon filled with events, loot, and challenges.

**Platform:** Web-first (runs in browser), optional Electron desktop packaging  
**Tech Stack:** React 18+, TypeScript, Chakra UI v2, Zustand, Vite, react-icons/gi

---

## Current Phase: Phase 2 - Polish & Balance

### Goals
1. Enhanced UI with animations and better visual feedback ✅ IN PROGRESS
2. Balance tuning for combat, loot, and progression
3. Improved save system reliability
4. Combat feedback and statistics
5. Optional audio implementation

### Priority Features
- [x] **Enhanced UI Animations** ✅ COMPLETED
  - Item hover effects with smooth transitions and rarity glows
  - FloatingNumber component created and integrated
  - Floating numbers on party member cards during events
  - Health bar animations with pulse effects on change
  - Rarity-colored borders and pulsing effects on items
  - Screen transitions with spring animations
  - Event choice buttons with hover animations
  - Party member card animations
  - Game over screen entrance animations
  
- [ ] **Balance Pass** ⚠️ PARTIAL
  - ✅ Defense formula system implemented (4 formulas: flat, percentage, logarithmic, hybrid)
  - ✅ Damage scaling configured (35% base, 45% floor bosses, 60% zone bosses)
  - ✅ Loot drop rates by depth configured
  - ✅ Stat requirements scaling (15% per depth)
  - ⚠️ Needs playtesting and tuning
  - ⚠️ Class balance review needed
  - ⚠️ Difficulty curve validation needed

- [x] **Combat Feedback** ✅ MOSTLY COMPLETE
  - ✅ Damage numbers integrated on party member cards
  - ✅ Combat log modal implemented (CombatLogModal.tsx)
  - ✅ Event log tracking all event details
  - ✅ Visual indicators for crits/dodges in text descriptions
  - ✅ Event outcome animations with staggered effects
  - ✅ Damage breakdown shown in outcomes

- [x] **Statistics & Tracking** ✅ COMPLETED
  - ✅ Comprehensive run statistics (20+ metrics tracked)
  - ✅ Event type breakdown (combat, treasure, rest, merchant, traps, bosses, choice)
  - ✅ Death/victory summary screens with detailed stats
  - ✅ Run history with expanded statistics display
  - ✅ Death details tracking (killer event, hero damage breakdown)
  - ✅ Meta stats: XP mentored, alkahest gained, items discarded, level-ups
  - ⚠️ Achievement tracking not implemented (stretch goal)

- [x] **Save System** ✅ COMPLETED
  - ✅ Auto-save functionality (triggers after each event)
  - ✅ Automatic backups on game load
  - ✅ Export/import save files
  - ✅ Save file management UI in main menu
  - ✅ Backup history with restore capability
  - ⚠️ Manual save slots not implemented (using single auto-save)

- [ ] **Audio** ❌ NOT STARTED (Optional)
  - No audio files in project
  - Background music not implemented
  - Sound effects not implemented
  - Volume controls not implemented
  - Deprioritized to Phase 3

---

## Recent Session Summary (Jan 25, 2026)

### UI Animations Implementation ✅ COMPLETED
**Goal:** Add polish and visual feedback to enhance player experience with smooth, professional animations.

**Implementation:**
1. **Item Slot Animations** ([ItemSlot.tsx](src/components/ui/ItemSlot.tsx)):
   - Framer Motion integration with spring physics
   - Scale and glow effects on hover (rarity-based colors)
   - Icon wiggle animation on hover
   - Pulsing rarity indicator dot
   - Radial gradient glow background that fades in/out
   - Tap feedback with scale animation
   - Smooth entrance animation (fade + scale)

2. **Health Bar Animations** ([StatBar.tsx](src/components/ui/StatBar.tsx)):
   - Animated value counting (smooth transitions between HP values)
   - Pulse effect on damage (red flash)
   - Pulse effect on healing (green flash)
   - Color change on value update
   - Smooth progress bar width transitions

3. **Floating Number Component** ([FloatingNumber.tsx](src/components/ui/FloatingNumber.tsx)):
   - NEW component for displaying damage/heal/xp/gold numbers
   - Float-up animation with fade out
   - Type-specific colors (red=damage, green=heal, purple=xp, yellow=gold)
   - Scale animation (bounce in, fade out)
   - Ready for combat integration

4. **Event Outcome Animations** ([OutcomeDisplay.tsx](src/components/dungeon/OutcomeDisplay.tsx)):
   - Staggered effect card entrance (cascade animation)
   - Icon rotation on entrance
   - Hover effects on effect cards with glow
   - Slide-in animation for outcome text
   - Delayed continue button appearance

5. **Event Display Animations** ([EventDisplay.tsx](src/components/dungeon/EventDisplay.tsx)):
   - Choice button slide-in with stagger
   - Hover effects with glow and slide
   - Tap feedback
   - Header fade-in animation

6. **Screen Transitions** ([App.tsx](src/App.tsx)):
   - AnimatePresence for smooth screen changes
   - Spring-based transitions
   - Slide and fade animations between screens
   - Wait mode to prevent overlap

7. **Party Member Card Animations** ([PartyMemberCard.tsx](src/components/party/PartyMemberCard.tsx)):
   - Hover effects with slide and glow
   - Icon wiggle on hover
   - Tap feedback
   - Box shadow based on alive state

8. **Game Over Screen** ([GameOverScreen.tsx](src/components/dungeon/GameOverScreen.tsx)):
   - Dramatic skull entrance (rotate + scale)
   - Floating skull animation (continuous bounce)
   - Staggered text reveal
   - Penalty card cascade animation
   - Delayed button appearance

**Technical Details:**
- Used Framer Motion (already installed)
- Spring physics for natural feel
- Consistent timing (300-500ms transitions)
- Respect reduced motion preferences (Framer Motion handles this)
- No performance impact (GPU-accelerated transforms)

**Files Modified:**
- [src/components/ui/ItemSlot.tsx](src/components/ui/ItemSlot.tsx) - Enhanced hover effects
- [src/components/ui/StatBar.tsx](src/components/ui/StatBar.tsx) - Animated health bars
- [src/components/ui/FloatingNumber.tsx](src/components/ui/FloatingNumber.tsx) - NEW component
- [src/components/dungeon/OutcomeDisplay.tsx](src/components/dungeon/OutcomeDisplay.tsx) - Staggered effects
- [src/components/dungeon/EventDisplay.tsx](src/components/dungeon/EventDisplay.tsx) - Choice animations
- [src/components/party/PartyMemberCard.tsx](src/components/party/PartyMemberCard.tsx) - Card effects
- [src/components/dungeon/GameOverScreen.tsx](src/components/dungeon/GameOverScreen.tsx) - Dramatic entrance
- [src/App.tsx](src/App.tsx) - Screen transitions

---

## Previous Session Summary (Jan 25, 2026)

### Item Generation System Overhaul ✅
**Problem:** Items generated with generic names ("Dragonscale Item"), missing icons, inconsistent generation across different code paths.

**Solution Implemented:**
1. **Metadata System**: Items now store `materialId`, `baseTemplateId`, `isUnique` for self-identification
2. **Auto-Repair on Load**: 
   - `repairItemNames()` fixes generic names using stored metadata
   - `repairItemIcon()` restores correct icons from base templates
   - Integrated into localStorage hydration in `gameStore.ts`
3. **Material Organization**: Split monolithic materials file into organized structure:
   ```
   src/data/items/materials/
     junk/       (rusty.ts, broken.ts, worn.ts)
     common/     (iron.ts, leather.ts, bronze.ts)
     uncommon/   (steel.ts, reinforcedLeather.ts, silver.ts)
     rare/       (mithril.ts, dragonscale.ts, enchanted.ts)
     epic/       (adamantine.ts, celestial.ts, demon.ts)
     legendary/  (divine.ts, ancient.ts, void.ts)
     mythic/     (primordial.ts, cosmic.ts, eternal.ts)
     index.ts    (re-exports with allMaterials array)
   ```
4. **Blacklist System**: Materials can specify incompatible item types (e.g., leather can't be accessory2/talismans)
5. **Centralized Generation**: All item creation now goes through `generateItem()` in `lootGenerator.ts`
   - Name generation with keyword matching
   - Repair attempt for generic names before alkahest fallback
   - Icon restoration from base templates
6. **Smart Generic Detection**: Only flags truly generic names ("Material Weapon/Armor/Item"), not valid matches like "Bronze Helmet"

**Files Modified:**
- `src/systems/loot/lootGenerator.ts` - Core generation, repair functions, generic detection
- `src/systems/events/eventResolver.ts` - Removed duplicate item generation logic
- `src/store/gameStore.ts` - Integrated repair into localStorage hydration
- `src/types/index.ts` - Added metadata fields to Item interface
- `src/data/items/materials/*` - Split into individual files by rarity
- `src/data/items/bases/index.ts` - Added allBases export for repair lookups

### Death Penalty System Fix ✅
**Problem:** Death penalty displayed on game over screen but didn't actually apply; heroes stayed at high level for next run.

**Solution:**
1. **Immediate Application**: `endGame()` now applies penalty directly when run ends
2. **Correct Display**: Game over screen shows accurate before/after using `activeRun.heroesUsed` data
3. **Hero Revival**: `startDungeon()` now revives all heroes and heals them to full

**Files Modified:**
- `src/store/gameStore.ts` - Apply penalty in `endGame()`, revive in `startDungeon()`
- `src/components/dungeon/GameOverScreen.tsx` - Use `activeRun` data for accurate level display

### UI Improvements ✅
- Compacted game over screen to fit viewport (reduced spacing, smaller fonts)
- Event displays more compact with overflow scrolling
- Better visual hierarchy in outcome displays

### Bonus Features ✅
- Documented "risky revive instant re-death" as intentionally hilarious feature in `necromanticRitual.ts`

---

## Key Architecture Patterns

### Data Organization (CRITICAL)

**Individual File Pattern:**
```
src/data/
  classes/
    warrior.ts      → export const WARRIOR: HeroClass = {...}
    mage.ts         → export const MAGE: HeroClass = {...}
    index.ts        → export { WARRIOR, MAGE, ... }; export const ALL_CLASSES = [...]
  
  events/
    combat/
      goblinAmbush.ts     → export const GOBLIN_AMBUSH: DungeonEvent = {...}
      orcWarband.ts       → export const ORC_WARBAND: DungeonEvent = {...}
      index.ts            → Re-export all, provide COMBAT_EVENTS array
    boss/
    choice/
    merchant/
    rest/
    trap/
    treasure/
    index.ts              → Aggregate all event types
  
  items/
    materials/
      junk/
        rusty.ts          → export const RUSTY: Material = {...}
      common/
      [... by rarity]
      index.ts            → export { RUSTY, ... }; export const allMaterials = [...]
    bases/
      weapon/
      armor/
      [... by slot]
      index.ts            → export const allBases = [...]
    uniques/
    sets/
```

**Benefits:**
- Easy to add new content (one file per entity)
- Clear organization by type/category
- Git-friendly (minimal merge conflicts)
- Index files provide convenient aggregation

### State Management

**Zustand Store (`src/store/gameStore.ts`):**
- Single source of truth for game state
- Persist middleware for localStorage
- Sanitization middleware to fix NaN stats
- Actions for all game state mutations

**Key State Sections:**
```typescript
interface GameState {
  party: Hero[]               // Current active party (1-4 heroes)
  heroRoster: Hero[]          // All heroes ever created
  dungeon: Dungeon            // Current run state
  bankGold: number            // Persistent gold
  alkahest: number            // Crafting currency from discarded items
  bankInventory: Item[]       // Persistent storage
  bankStorageSlots: number    // Capacity
  overflowInventory: Item[]   // Temporary overflow from last run
  isGameOver: boolean
  hasPendingPenalty: boolean
  activeRun: Run | null       // Current/just-completed run data
  runHistory: Run[]           // Past runs
  lastOutcome: ResolvedOutcome | null
}
```

### Item Generation Flow

```
generateItem(depth, forceType?) 
  ↓
selectRarity(depth) → selectItemType()
  ↓
Check for set/unique items (depth-based chances)
  ↓
Generate procedural item:
  - getCompatibleMaterial(rarity, type)
  - getCompatibleBase(type)
  - generateItemName(material.prefix, base)
  ↓
Check if name is generic
  ↓
  YES → repairItemName(tempItem)
    ↓
    Still generic? → Return alkahest shard
    ↓
    Fixed? → Return repaired item
  ↓
  NO → Return item with metadata
```

### Event Resolution Flow

```
selectChoice(choice)
  ↓
resolveEventOutcome(outcome, party, depth)
  ↓
Process effects in order:
  - damage → heal → xp → gold → item → status → revive
  ↓
Scale values by depth (damage 10%, healing 8%, rewards 15%)
  ↓
Update party stats, gold, inventory
  ↓
Check for game over (all dead?)
  ↓
Return resolved outcome with effects
```

---

## File Structure Highlights

```
src/
  components/
    screens/          # Full-screen views
      MainMenuScreen.tsx
      PartySetupScreen.tsx
      DungeonScreen.tsx
      RunHistoryScreen.tsx
    
    party/            # Party setup components
      ClassCard.tsx
      HeroSlot.tsx
      PartySetupHeader.tsx
      [... equipment/inventory panels]
    
    dungeon/          # Dungeon exploration components
      EventDisplay.tsx
      OutcomeDisplay.tsx
      GameOverScreen.tsx
      DungeonActionBar.tsx
      [... sidebars, modals]
    
    ui/               # Reusable UI components
      ItemSlot.tsx
      ItemDetailModal.tsx
      DevTools.tsx
  
  systems/
    combat/           # Combat resolution (future expansion)
    events/
      eventResolver.ts    # Effect processing
      eventSelector.ts    # Event selection logic
    loot/
      lootGenerator.ts    # Item generation & repair
      inventoryManager.ts # Inventory operations
      lootOutcomes.ts     # Loot table logic
  
  data/
    classes/          # Hero class definitions
    events/           # Event templates (by type)
    items/            # Materials, bases, uniques, sets
  
  store/
    gameStore.ts      # Zustand state management
  
  types/
    index.ts          # TypeScript interfaces
  
  config/
    game.ts           # Balance constants & config
```

---

## Critical Systems

### Loot Generation (src/systems/loot/lootGenerator.ts)

**Key Functions:**
- `generateItem(depth, forceType?)` - Main generation with repair flow
- `generateItemName(materialPrefix, baseTemplate)` - Keyword-based naming
- `repairItemName(item)` - Fixes generic names using metadata
- `repairItemIcon(item)` - Restores correct icons
- `repairItemNames(items[])` - Batch repair for inventory arrays

**Rarity System:**
```typescript
baseRarityWeights: {
  junk: 15,
  common: 40,
  uncommon: 25,
  rare: 12,
  epic: 5,
  legendary: 2.5,
  mythic: 0.5
}
// Adjusted by depth for scaling
```

**Material Blacklists:**
```typescript
// Example: Leather can't be used for accessory2 (talismans/amulets)
LEATHER: Material = {
  blacklist: ['accessory2']
}
```

### Event System (src/systems/events/)

**Event Types:**
1. **Combat** - Fight enemies, auto-resolved
2. **Treasure** - Find items/gold
3. **Choice** - Multiple options with outcomes
4. **Rest** - Heal/recover resources
5. **Merchant** - Buy/sell items
6. **Trap** - Hazards with stat checks
7. **Boss** - Major encounters every 10 floors

**Event Selection:**
- Random weighted selection by type
- Depth-based filtering (bosses at 10, 20, 30...)
- Avoids recent events (last 10)
- Special events at key depths

**Effect Scaling:**
```typescript
scaleValue(baseValue, depth, scaleRate) {
  return Math.floor(baseValue * (1 + depth * scaleRate))
}

// Damage: 10% per depth
// Healing: 8% per depth  
// Rewards (XP/Gold): 15% per depth
```

### Death Penalty (src/config/game.ts)

**Types:**
- `none` - Keep everything
- `halve-levels` - Lose half levels (min 1) ⚙️ CURRENT
- `reset-levels` - Back to level 1
- `lose-equipment` - Keep levels, lose gear

**Application:**
- Triggers in `endGame()` when all heroes dead
- Updates both `party` and `heroRoster` immediately
- `activeRun` preserved to show accurate before/after on game over screen

---

## Development Workflow

### Adding New Content

**New Hero Class:**
1. Create `src/data/classes/yourclass.ts`
2. Export const with HeroClass interface
3. Add to `src/data/classes/index.ts` exports and ALL_CLASSES array

**New Event:**
1. Identify type (combat, choice, etc.)
2. Create `src/data/events/{type}/yourEvent.ts`
3. Export const with DungeonEvent interface
4. Ensure index.ts re-exports it

**New Material:**
1. Determine rarity tier
2. Create `src/data/items/materials/{rarity}/yourMaterial.ts`
3. Export const with Material interface
4. Add to index.ts exports and grouped arrays

**New Base Item:**
1. Determine slot (weapon, armor, etc.)
2. Create in `src/data/items/bases/{slot}/yourBase.ts`
3. Export const with BaseItemTemplate interface
4. Add to index.ts exports and type-grouped arrays

### Running the Project

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

### Testing Item Generation

Use DevTools (Ctrl+D) to:
- Generate items at specific depths
- Test repair functions
- Apply death penalties
- Jump floors
- View state

---

## Known Issues & Quirks

### Intentional "Bugs"
- **Risky Revive Death**: Necromantic ritual's risky option can instantly re-kill revived heroes at deep floors due to damage scaling. This is intentional humor.

### Areas Needing Attention (Phase 2)
- [ ] Balance pass on enemy stats
- [ ] Loot drop rates feel too generous at high depths
- [ ] Some event choices need better stat scaling
- [ ] UI animations missing (should add transitions)
- [ ] No audio/sound effects
- [ ] Combat resolution happens instantly (no visual feedback)
- [ ] Run history screen is basic (needs more detail)

---

## Configuration & Balance

See `src/config/game.ts` for all tunable values:

```typescript
export const GAME_CONFIG = {
  levelUp: {
    maxLevel: 20,
    xpPerLevel: 100,  // level * 100 XP needed
    healToFull: false
  },
  
  statGains: {
    attack: 5,
    defense: 5,
    speed: 5,
    luck: 5,
    maxHp: 5
  },
  
  dungeon: {
    maxDepth: 100,
    bossFloorInterval: 10
  },
  
  deathPenalty: {
    type: 'halve-levels',
    loseAllGoldOnDefeat: true
  },
  
  scaling: {
    damage: 0.1,    // 10% per depth
    healing: 0.08,  // 8% per depth
    rewards: 0.15   // 15% per depth
  }
}
```

---

## Testing Checklist (Phase 1 Complete ✅)

- [x] Create party with 1-4 heroes
- [x] Start dungeon and encounter events
- [x] Make choices and see outcomes
- [x] Combat resolves correctly
- [x] Loot generates with proper names and icons
- [x] Items equip to heroes
- [x] XP and leveling work
- [x] Heroes die and game over triggers
- [x] Death penalty applies correctly
- [x] Can start new run after defeat
- [x] Bank inventory persists
- [x] Overflow inventory handles excess items
- [x] Run history tracks completed runs

---

## Phase 2 Next Steps

### Immediate Priorities
1. **Visual Polish**
   - Add smooth transitions for screen changes
   - Item hover effects with scale/glow
   - Health bar animations
   - Damage number popups
   
2. **Balance Pass**
   - Review enemy scaling formulas
   - Test loot rates at various depths
   - Adjust class starting stats
   - Fine-tune event difficulty
   
3. **Combat Feedback**
   - Show damage calculations
   - Display combat "replay" with events
   - Visual indicators for crits/misses
   - Better death animations
   
4. **Statistics**
   - Expand run summary
   - Track lifetime stats
   - Add achievements (stretch)

### Resources
- See `docs/development/roadmap.md` for full Phase 2 scope
- Balance spreadsheet: TBD
- Player feedback doc: TBD

---

## Questions for Next Session

1. **Balance Direction**: Should we focus on difficulty curve or content variety first?
2. **UI Framework**: Keep with Chakra UI animations or add Framer Motion?
3. **Audio**: Priority for Phase 2 or push to Phase 3?
4. **Save System**: Multiple slots or single auto-save?
5. **Statistics**: What metrics are most important to track?

---

## Contact & Handoff Notes

**Previous Phase:** HANDOFF_PHASE1_COMPLETE.md (archived)  
**Current Phase:** Phase 2 - Polish & Balance  
**Next Phase:** Phase 3 - Content Expansion

**Development Philosophy:**
- Code clarity over cleverness
- Extensibility over premature optimization
- Player experience over feature count
- Individual files over monoliths

**Git Workflow:**
- Commit frequently with clear messages
- Tag major milestones (phase completions)
- Use branches for experimental features

---

*Last Updated: February 1, 2026*  
*Phase 1 Status: ✅ COMPLETE*  
*Phase 2 Status: 🟡 75% COMPLETE - Balance tuning remaining*
