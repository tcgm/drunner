# Project Handoff - Dungeon Runner

**Date:** January 24, 2026  
**Status:** Phase 1 In Progress - UI Implementation  
**Current Focus:** Party Setup Screen Componentization

---

## 🔴 ARCHITECTURE VITAL WARNING

**ALL content data files MUST follow the Individual File Principle:**

- ✅ **DO:** One class per file (`warrior.ts`, `mage.ts`, etc.)
- ✅ **DO:** One event per file in category folders (see event structure below)
- ✅ **DO:** Use `index.ts` with auto-discovery (`import.meta.glob`) to collect exports
- ❌ **DON'T:** Create monolithic files (`allClasses.ts`, `allEvents.ts`, `data.ts`)
- ❌ **DON'T:** Put multiple classes/events in one file
- ❌ **DON'T:** Manually maintain imports in index files (use auto-discovery)

**Auto-Discovery Pattern (REQUIRED):**
```typescript
// Example: src/data/events/combat/index.ts
const eventModules = import.meta.glob<{ [key: string]: unknown }>('./*.ts', { eager: true })
export const COMBAT_EVENTS: DungeonEvent[] = Object.values(eventModules)
  .filter(module => module !== undefined)
  .flatMap(module => Object.values(module).filter((exp): exp is DungeonEvent => 
    exp !== null && typeof exp === 'object' && 'id' in exp && 'type' in exp && 'title' in exp))
```

**This is not a suggestion - it's a hard requirement. See `docs/technical/architecture.md` and `docs/GUIDELINES.md` for full details.**

---

## Project Overview

**Dungeon Runner** is an event-based, procedurally generated roguelike dungeon crawler built with React, TypeScript, and Chakra UI. Players manage a party of customizable heroes, making strategic choices as they descend through a dangerous dungeon filled with events, loot, and challenges.

**Platform:** Web-first (runs in browser), optional Electron desktop packaging  
**Tech Stack:** React 18+, TypeScript, Chakra UI v2, Zustand, Vite, react-icons/gi

---

## Current Status

### ✅ Completed (Phase 1 - Core Foundation)

#### Project Setup & Infrastructure
- ✅ Vite 7.3.1 project initialized with React 18+ and TypeScript (strict mode)
- ✅ Chakra UI v2.8.2 installed and configured with dark theme
- ✅ Zustand state management set up
- ✅ react-icons/gi for game icons (includes game-icons subset)
- ✅ File structure created following architecture guidelines
- ✅ No-scroll constraint enforced at app level (100vh viewport lock)

#### Data Layer (Individual File Architecture)
- ✅ **8 Core Classes** implemented in `src/data/classes/`:
  - Individual files: warrior.ts, mage.ts, rogue.ts, cleric.ts, ranger.ts, paladin.ts, necromancer.ts, bard.ts
  - Auto-discovery index using `import.meta.glob`
  - Type-safe filtering with predicates
  - Each class has full stats, abilities, and icon mappings

- ✅ **35 Event Files** across 7 categories in `src/data/events/`:
  - `combat/`: goblinAmbush, skeletonPatrol, giantRatSwarm, caveTroll, darkCultists
  - `treasure/`: ancientChest, hiddenCache, abandonedArmory, jeweledStatue, mysteriousFountain
  - `choice/`: woundedTraveler, prisonersDilemma, mysteriousMerchant, ancientAltar, rivalAdventurers
  - `rest/`: safeCampfire, healingFountain, abandonedCamp, meditationChamber, mysticalGarden
  - `merchant/`: travelingMerchant, blackMarket, weaponSmith, potionMaster, fortuneTeller
  - `trap/`: poisonDartTrap, pitTrap, magicalWard, collapsingCeiling, cursedDoor
  - `boss/`: undeadChampion, dragonWyrmling, demonLord, ancientLich, dungeonGuardian
  - Each category has auto-discovery index
  - Zero manual import maintenance required

#### Type System
- ✅ Complete TypeScript interfaces in `src/types/`:
  - Hero, HeroClass, Stats, Ability
  - DungeonEvent, EventChoice, EventOutcome
  - Item, ItemType, ItemRarity (placeholder)
  - Strict type checking enabled

#### State Management (Zustand)
- ✅ `gameStore.ts` with full game loop:
  - Party management (addHero, removeHero, updateHero)
  - Dungeon progression (startDungeon, advanceDungeon)
  - Event resolution (selectChoice)
  - Game state tracking (isGameOver, depth, gold)

#### Event System
- ✅ **Event Selector** (`src/systems/events/eventSelector.ts`):
  - Weighted random event selection
  - Depth-based filtering
  - Boss events at every 10th floor
  - Recent event tracking to avoid repetition
  
- ✅ **Event Resolver** (`src/systems/events/eventResolver.ts`):
  - Damage calculation with defense mitigation
  - Healing with max HP caps
  - XP rewards with automatic level-ups (+5 all stats per level)
  - Gold rewards
  - Target selection (random, all, weakest, strongest)
  - Requirement checking (class, stats, items)

#### UI Components (Fully Responsive)
- ✅ **MainMenuScreen** - Centered menu with New Game button
- ✅ **PartySetupScreen** - 3-column layout with componentized architecture:
  - **Left Sidebar (280px):** Hero class selection (single column, scrollable)
    - `ClassCard.tsx` component with tooltips showing full stats
    - Compact cards with minimal info, detail on hover
  - **Center Area (flex):** Party lineup (2x2 grid, main focus)
    - `HeroSlot.tsx` component with fancy card design
    - Double icon effect (large bg + main icon with glow)
    - 2x2 stat grid (HP, ATK, DEF, SPD)
    - Remove button always visible
    - Empty state with "+" icon
  - **Right Sidebar (300px):** Reserved for equipment/powers (placeholder)
  - `PartySummary.tsx` component showing aggregate stats
  - Top bar with Back and Enter Dungeon buttons
  - All headers minimized for vertical space optimization

- ✅ **DungeonScreen** - Complete event-driven gameplay:
  - **Left Sidebar:** Party status with live HP/stats
  - **Center Area:** Dynamic event display with choices
  - **Right Sidebar:** Dungeon info and statistics
  - `EventDisplay.tsx` - Shows event title, description, and choices
  - `OutcomeDisplay.tsx` - Shows outcome text and resolved effects
  - Game over screen when party is defeated
  - Smooth flow: Event → Choice → Outcome → Continue

#### Utility Functions
- ✅ `heroUtils.ts`: createHero (generates heroes with level, XP, stats)

### 🔄 In Progress
- **Loot Integration**: Systems exist but not connected - events give gold but no items yet

### ⏳ Next Up (Phase 1 Finalization)
- **🔴 CRITICAL: Event → Loot Integration**
  - Connect loot generator to treasure events (Ancient Chest, Hidden Cache, etc.)
  - Update event resolver to process `{ type: 'item', item: generatedItem }` effects
  - Add actual item rewards to treasure event outcomes (currently only gold)
  - Test complete gameplay loop: party → dungeon → events → loot → equipment
- Save/load system
- Balance testing and tuning

---

## Key Design Decisions

### Architecture
- **Web-First:** Primary platform is browser, Electron is optional
- **Event-Driven Gameplay:** Focus on choice-based events, not constant combat
- **Modular Design:** Systems separated for easy testing and expansion
- **Type-Safe:** Comprehensive TypeScript interfaces for all game data
- **🔴 CRITICAL - Individual File Principle:** All content data MUST be in separate files with auto-discovery indexes (see docs/technical/architecture.md)
- **No-Scroll Design:** App locked to 100vh with `overflow: hidden` at document level
- **Component-Per-File:** Each UI component in its own file for maintainability

### UI/UX Patterns Established
- **3-Column Layout:** Selection sidebar (left) + Main content (center) + Future expansion (right)
- **Responsive Sizing:** Uses viewport units (vh/vw) and flex, no fixed pixel heights
- **Visual Hierarchy:** 
  - Hero slots: Fancy cards with double icon effect, gradients, glows
  - Class cards: Compact with detail-on-demand via tooltips
  - Stats: Color-coded (HP=cyan, ATK=red, DEF=blue, SPD=green)
- **Interaction Patterns:**
  - Select class → Click slot → Hero added
  - Hover for tooltips/highlights
  - Direct remove buttons on hero cards

### Content Scope
- **MVP (Current):** 8 classes, 35 events, party setup, event flow
- **Phase 1 Target:** Playable loop (party → events → loot → progression)
- **Stretch Goals:** Turn-based combat, 12 additional classes, meta-progression

### Technical Choices
- **State Management:** Zustand (lightweight, simple API)
- **UI Framework:** Chakra UI v2 (accessible, themeable, dark mode ready)
- **Icons:** react-icons/gi (includes game-icons subset)
- **Build Tool:** Vite 7.3.1 (fast dev server, optimized builds)
- **Auto-Discovery:** Vite's `import.meta.glob` for zero-maintenance content indexes

---

## Critical Files & Locations

### Implemented Structure
```
src/
├── components/
│   ├── party/
│   │   ├── HeroSlot.tsx           # Fancy hero card with stats/remove
│   │   ├── ClassCard.tsx          # Compact class selector with tooltip
│   │   ├── PartySummary.tsx       # Aggregate party stats display
│   │   └── PartyMemberCard.tsx    # Compact party member for dungeon view
│   ├── dungeon/
│   │   ├── EventDisplay.tsx       # Event presentation with choices
│   │   └── OutcomeDisplay.tsx     # Outcome results with effects
│   └── screens/
│       ├── MainMenuScreen.tsx     # Simple centered menu
│       ├── PartySetupScreen.tsx   # 3-column layout orchestrator
│       └── DungeonScreen.tsx      # Full dungeon gameplay loop
├── data/
│   ├── classes/
│   │   ├── index.ts               # Auto-discovery export
│   │   ├── warrior.ts             # Individual class files
│   │   ├── mage.ts
│   │   └── ... (8 total)
│   └── events/
│       ├── combat/
│       │   ├── index.ts           # Auto-discovery for combat events
│       │   ├── goblinAmbush.ts
│       │   └── ... (5 events)
│       ├── treasure/
│       │   ├── index.ts
│       │   └── ... (5 events)
│       ├── choice/, rest/, merchant/, trap/, boss/
│       │   └── ... (5 events each, 35 total)
├── store/
│   └── gameStore.ts               # Zustand state (full game loop)
├── systems/
│   └── events/
│       ├── eventSelector.ts       # Event selection logic
│       └── eventResolver.ts       # Outcome resolution & effects
├── types/
│   └── index.ts                   # All TypeScript interfaces
├── utils/
│   └── heroUtils.ts               # createHero function
├── theme.ts                       # Chakra dark theme config
├── App.tsx                        # Screen routing, no-scroll wrapper
└── main.tsx                       # ChakraProvider setup

index.html                         # overflow:hidden styles
```

### Key Implementation Patterns

**Auto-Discovery Index Pattern:**
```typescript
// src/data/classes/index.ts
const classModules = import.meta.glob<{ [key: string]: unknown }>('./*.ts', { eager: true })
export const CORE_CLASSES: HeroClass[] = Object.values(classModules)
  .filter(module => module !== undefined)
  .flatMap(module => Object.values(module).filter((exp): exp is HeroClass => 
    exp !== null && typeof exp === 'object' && 'id' in exp && 'name' in exp))
```

**Component Structure:**
```typescript
// Each component exports default function
export default function ComponentName({ props }: Props) {
  // Implementation
}
```

**No-Scroll Enforcement:**
```typescript
// App.tsx
<Box h="100vh" w="100vw" bg="gray.900" overflow="hidden">
  {/* Content */}
</Box>
```

---
│   ├── combat.md                  # Turn-based combat (stretch)
│   ├── progression.md             # XP, leveling, abilities
│   └── balance.md                 # Formulas and tuning
├── technical/
│   ├── architecture.md            # System design and data flow
│   ├── data-models.md             # TypeScript interfaces (CRITICAL)
│   ├── state-management.md        # Zustand store patterns
│   ├── file-structure.md          # Project organization
│   └── ui-design.md               # Chakra UI patterns
└── development/
    ├── roadmap.md                 # 5-phase plan with timelines
    ├── setup.md                   # Installation instructions
    └── deployment.md              # Build and deploy
```

### Legacy Files (Can Archive)
- `DESIGN.md` (1062 lines) - Original technical design, now split into docs/technical/
- `GAME_DESIGN.md` (723 lines) - Original game design, now split into docs/game-design/

---

## Important Design Details

### Hero Class System
- **8 Core Classes:** Warrior, Mage, Rogue, Cleric, Ranger, Paladin, Necromancer, Bard
- **12 Stretch Classes:** Artificer, Sorcerer, Barbarian, Druid, Monk, Warlock, Assassin, Shaman, Knight, Witch, Berserker, Alchemist
- **Base Stats:** HP, Attack, Defense, Speed, Luck (Magic Power for stretch)
- **Leveling:** `level × 100` XP per level, +5 all stats per level
- **Abilities:** Unlock at levels 1, 3, 5, 7, 10, 15, 20

### Equipment & Loot
- **Core Slots (6):** Weapon, Armor, Helmet, Boots, 2× Accessory
- **Stretch Slots (4):** Offhand, Belt, Cloak, Gloves
- **Core Rarities (7):** Junk (15%) → Mythic (0.5%)
- **Stretch Rarities (3):** Artifact (0.1%), Cursed, Set Items
- **Depth Scaling:** Better loot deeper in dungeon

### Event System
- **Combat (40%)** - Battle enemies for XP/loot
- **Treasure (20%)** - Find chests and rewards
- **Choice (20%)** - Moral/strategic decisions
- **Rest (10%)** - Heal party
- **Merchant (5%)** - Buy/sell items
- **Trap (5%)** - Environmental hazards
- **Boss (Special)** - Every 10 floors

### Combat (Stretch Goal)
- Turn-based with initiative (speed-based)
- 5 actions: Attack, Defend, Ability, Item, Pass
- 4 AI behaviors: Aggressive, Defensive, Support, Random
- Combat events: 20% chance after round 3
- Damage formula: `ATK - DEF/2`

---

## Next Steps (Immediate)

### 1. Project Initialization
```powershell
# Create Vite project
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install zustand react-icons

# Install dev dependencies
npm install -D @types/node
```

### 2. Configure TypeScript Paths
Update `tsconfig.json` with path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@systems/*": ["src/systems/*"],
      "@store/*": ["src/store/*"],
      "@data/*": ["src/data/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### 3. Create Directory Structure
```powershell
mkdir src\components\screens
mkdir src\components\party
mkdir src\components\dungeon
mkdir src\components\ui
mkdir src\systems\events
mkdir src\systems\loot
mkdir src\store
mkdir src\data\classes
mkdir src\data\events
mkdir src\types
mkdir src\utils
mkdir src\theme
```

### 4. Implement Core Types & Data Files

**🔴 CRITICAL: Follow Individual File Architecture**

**DO NOT create monolithic files like:**
- ❌ `allClasses.ts` with all hero classes
- ❌ `allEvents.ts` with all events
- ❌ `data.ts` with everything

**DO create individual files with auto-discovery:**

#### Hero Classes (One class per file)
```
src/data/classes/
├── index.ts          # Auto-discovers all classes using import.meta.glob
├── warrior.ts        # export const WARRIOR: HeroClass = { ... }
├── mage.ts           # export const MAGE: HeroClass = { ... }
├── rogue.ts          # export const ROGUE: HeroClass = { ... }
├── cleric.ts         # export const CLERIC: HeroClass = { ... }
├── ranger.ts         # export const RANGER: HeroClass = { ... }
├── paladin.ts        # export const PALADIN: HeroClass = { ... }
├── necromancer.ts    # export const NECROMANCER: HeroClass = { ... }
└── bard.ts           # export const BARD: HeroClass = { ... }
```

**Adding a new class is as simple as creating a new file - no index updates needed!**

#### Event Data (One event per file - auto-discovered)
```
src/data/events/
├── index.ts              # Master aggregator for all event types
├── combat/
│   ├── index.ts          # Auto-discovers all .ts files, exports COMBAT_EVENTS
│   ├── goblinAmbush.ts   # export const GOBLIN_AMBUSH: DungeonEvent = { ... }
│   ├── skeletonPatrol.ts # Just add new files here - no index updates!
│   └── ...               # Auto-discovered on build
├── treasure/
│   ├── index.ts          # Auto-discovers all treasure events
│   └── ...
├── choice/
│   ├── index.ts
│   └── ...
├── rest/
│   ├── index.ts
│   └── ...
├── merchant/
│   ├── index.ts
│   └── ...
├── trap/
│   ├── index.ts
│   └── ...
└── boss/
    ├── index.ts
    └── ...
```

**Adding a new event:** Just create a new .ts file in the appropriate category folder. The index automatically finds and includes it!

**Rationale:** Individual files prevent git merge conflicts, enable parallel development, make content ownership clear, and scale better as the game grows.

Start with `src/types/index.ts` - copy interfaces from `docs/technical/data-models.md`:
- Hero, HeroClass, Stats, Ability
- Dungeon, DungeonEvent, EventChoice, EventOutcome
- Item, ItemType, ItemRarity

### 5. Setup Chakra UI Provider
Update `src/main.tsx` with ChakraProvider and theme

### 6. Create First Components (One component per file)
- `MainMenuScreen.tsx` - Simple start screen
- `PartySetupScreen.tsx` - Basic hero creation
- `App.tsx` - Route between screens

**Remember:** Each component gets its own file. Never bundle multiple components into one file.

---

## Development Phases Summary

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| **Phase 1** | 4-6 weeks | MVP Core | Party system, event system, loot, basic UI |
| **Phase 2** | 2-3 weeks | Polish | Balance, save/load, animations, stats |
| **Phase 3** | 3-4 weeks | Content | 100+ events, more classes, achievements |
| **Phase 4** | 6-10 weeks | Stretch | Turn-based combat, advanced items, meta-progression |
| **Phase 5** | 1-2 weeks | Electron | Desktop packaging (optional) |

**Target MVP:** 6-9 weeks  
**Full Featured:** 16-25 weeks

---

## Key Resources

### External Libraries
- [Chakra UI v2 Docs](https://chakra-ui.com/) - Component library
- [Zustand Docs](https://github.com/pmndrs/zustand) - State management
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library (use `react-icons/gi` for game-icons)
- [Vite Guide](https://vitejs.dev/guide/) - Build tool

### Internal Documentation
- **Start Here:** `docs/OVERVIEW.md`
- **For Implementation:** `docs/technical/data-models.md` (TypeScript interfaces)
- **For Game Logic:** `docs/game-design/` (all files)
- **For Setup:** `docs/development/setup.md`

---

## Known Issues / Decisions

### Resolved
- ✅ **Class Naming:** Barbarian (#11) has rage mechanic, Berserker (#19) has dual-wield
- ✅ **Icon Library:** Use react-icons/gi (includes game-icons), not separate package
- ✅ **Platform Priority:** Web-first, Electron optional
- ✅ **Documentation:** Split into 14 files for maintainability

### Pending Decisions
- Event system implementation approach (see `docs/technical/architecture.md`)
- Loot generation algorithms
- Combat resolution details (auto-resolve complexity)
- Meta-progression: Deferred to later phase

---

## Development Progress & Lessons Learned

### What Worked Well
- ✅ Auto-discovery pattern eliminates merge conflicts and manual index maintenance
- ✅ Component-per-file architecture keeps code organized and reusable
- ✅ Chakra UI provides excellent responsive layout primitives
- ✅ TypeScript strict mode caught errors early
- ✅ Individual event files make content creation straightforward

### Challenges Resolved
- **Issue:** Initial MOBA-style horizontal layout caused scrolling issues
  - **Solution:** Switched to 3-column layout with fixed sidebars and flexible center
- **Issue:** Remove buttons getting hidden by flex compression
  - **Solution:** Added `flexShrink={0}` to buttons and proper `minH={0}` to flex containers
- **Issue:** Viewport height calculations inconsistent across screen sizes
  - **Solution:** Used percentage-based sizing with fixed minimums where needed
- **Issue:** Duplicate ALL_CLASSES declaration
  - **Solution:** Removed old manual exports when implementing auto-discovery

### Patterns to Continue
1. **Always use auto-discovery** for content collections (classes, events, items)
2. **One component per file** - never bundle multiple components
3. **Viewport units** over fixed pixels for responsive layouts
4. **flexShrink={0}** on elements that must maintain size
5. **Tooltips for detail-on-demand** to keep UI compact

---

## Testing Strategy

### Phase 1 Testing
- Unit tests for game logic (loot generation, damage calculation, XP formulas)
- Component tests for UI elements
- Manual testing for gameplay feel

### Later Phases
- Integration tests for full event flow
- E2E tests for critical user paths
- Balance testing with playtesters

---

## Deployment Targets

### Web (Primary)
- **Hosting:** Vercel, Netlify, or GitHub Pages
- **Storage:** LocalStorage for saves
- **Build Command:** `npm run build`

### Desktop (Optional)
- **Platform:** Electron with electron-builder
- **Storage:** File system for saves
- **Target Platforms:** Windows, macOS, Linux

---

## Contact / Handoff Notes

**Current State:** Project has a complete playable game loop! Party setup is fully functional and componentized. Event system is implemented with proper selection, display, and outcome resolution. Players can create parties, enter dungeons, encounter events, make choices, and see the consequences. Heroes gain XP, level up automatically, and the game ends when the party is defeated.

**Next Session Should Begin With:**
1. Test the current gameplay loop by running the dev server
2. Implement loot generation system in `src/systems/loot/`:
   - Item generation based on depth and rarity
   - Equipment stat calculation
   - Item pool definitions
3. Add inventory management to gameStore
4. Create equipment UI components:
   - Equipment slots display
   - Item equip/unequip actions
   - Inventory grid/list view
5. Implement merchant event interactions (buy/sell)
6. Add save/load functionality using localStorage

**Immediate Priorities:**
1. ✅ Event system (select and present events)
2. ✅ DungeonScreen implementation
3. ✅ Event outcome resolution with effects
4. ⏳ Loot generation system
5. ⏳ Item/equipment management
6. ⏳ Save/load functionality

**Code Quality Notes:**
- All TypeScript interfaces are strictly typed
- Components follow Chakra UI patterns consistently
- Auto-discovery is working correctly for all content
- No scrolling anywhere except class selection sidebar and event area (intentional)
- Event system fully functional with damage, healing, XP, and gold
- Level-up system working (auto-level at XP threshold, +5 all stats)
- Game over detection when all party members die

**Estimated Time to Playable MVP:** 1-2 weeks from current state (loot system + basic inventory)

**Test the Game:**
1. Run `npm start`
2. Click "New Game" on main menu
3. Select up to 4 heroes from class list
4. Click "Enter Dungeon"
5. Experience events, make choices, see outcomes
6. Progress through dungeon floors until party wipes or you exit

---

**End of Handoff Document**

**Last Updated:** January 24, 2026 - Core Gameplay Loop Complete (Event System + Dungeon Progression)
