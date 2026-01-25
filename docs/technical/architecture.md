# Architecture

System architecture and high-level design for Dungeon Runner.

---

## System Overview

```
┌─────────────────────────────────────────────────┐
│              User Interface (Chakra UI)         │
│  ┌──────────┬──────────┬──────────┬──────────┐ │
│  │   Main   │  Party   │ Dungeon  │ Inventory│ │
│  │   Menu   │  Setup   │  Screen  │  Screen  │ │
│  └──────────┴──────────┴──────────┴──────────┘ │
└───────────────────┬─────────────────────────────┘
                    │ React Components
                    ▼
┌─────────────────────────────────────────────────┐
│         State Management (Zustand)              │
│  ┌────────────┬─────────────┬──────────────┐   │
│  │ Game State │ Party State │ Dungeon State│   │
│  │   Store    │    Store    │    Store     │   │
│  └────────────┴─────────────┴──────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │ Actions & Logic
                    ▼
┌─────────────────────────────────────────────────┐
│            Core Systems (TypeScript)            │
│  ┌──────────┬──────────┬──────────┬─────────┐  │
│  │ Event    │ Combat   │  Loot    │  Save   │  │
│  │ Generator│  Engine  │ System   │ System  │  │
│  └──────────┴──────────┴──────────┴─────────┘  │
└───────────────────┬─────────────────────────────┘
                    │ Data Access
                    ▼
┌─────────────────────────────────────────────────┐
│           Persistence Layer                     │
│   LocalStorage (Web) / FileSystem (Electron)    │
└─────────────────────────────────────────────────┘
```

---

## Core Systems

### Event Generation System
- **Purpose**: Procedurally generate dungeon events based on depth and event type distribution
- **Responsibilities**:
  - Roll event type based on percentages (Combat 40%, Treasure 20%, Choice 20%, etc.)
  - Select appropriate event template from pool
  - Scale difficulty/rewards based on current depth
  - Ensure variety (avoid repeating recent events)
- **Key Functions**:
  - `generateEvent(depth: number): DungeonEvent`
  - `selectEventType(): EventType`
  - `scaleRewards(baseRewards: any, depth: number): any`

### Combat Engine (Stretch Goal)
- **Purpose**: Execute turn-based tactical combat encounters
- **Responsibilities**:
  - Initiative calculation and turn order management
  - Action execution (attack, defend, ability, item)
  - Damage calculation with formulas: `damage = (attacker.attack - defender.defense/2) * (1 + luck/100)`
  - Status effect processing
  - Combat event triggers
  - Victory/defeat conditions
- **Key Functions**:
  - `startCombat(encounter: CombatEncounter): void`
  - `executeTurn(action: CombatAction): CombatResult`
  - `calculateDamage(attacker: Combatant, defender: Combatant): number`
  - `processStatusEffects(): void`

### Loot System
- **Purpose**: Generate items with appropriate rarity, stats, and effects
- **Responsibilities**:
  - Rarity determination using weighted random (Junk 15%, Common 40%, ..., Mythic 0.5%)
  - Stat generation based on rarity power budget
  - Special item types (Cursed, Set, Artifact) for stretch goals
  - Depth-based scaling
- **Key Functions**:
  - `generateLoot(depth: number, quantity: number): Item[]`
  - `rollRarity(depthBonus: number): ItemRarity`
  - `generateItem(type: ItemType, rarity: ItemRarity, depth: number): Item`

### Progression System
- **Purpose**: Handle XP, leveling, and ability unlocks
- **Responsibilities**:
  - XP tracking with formula: `xpRequired = level * 100`
  - Stat increases on level up (+5 to all stats)
  - Ability unlocks at levels 1, 3, 5, 7, 10, 15, 20
  - Trait assignment and management
- **Key Functions**:
  - `addExperience(hero: Hero, amount: number): void`
  - `levelUp(hero: Hero): void`
  - `unlockAbility(hero: Hero, level: number): void`

### Save System
- **Purpose**: Persist game state between sessions
- **Responsibilities**:
  - Serialize/deserialize GameState
  - Auto-save on critical events (level up, floor clear)
  - Manual save option
  - Multiple save slots
  - Web: LocalStorage
  - Electron: JSON files in user data directory
- **Key Functions**:
  - `saveGame(slot: number): void`
  - `loadGame(slot: number): GameState`
  - `listSaves(): SaveFile[]`

---

## Data Flow

### Typical Event Flow
```
1. User clicks "Continue" or "Next Floor"
   ↓
2. EventGenerator.generateEvent(depth) called
   ↓
3. Event displayed with choices
   ↓
4. User selects choice
   ↓
5. Choice validation (stat checks, requirements)
   ↓
6. Outcome executed:
   - Combat → Launch Combat Engine
   - Loot → Generate items, add to inventory
   - Damage → Reduce hero health
   - Status → Apply effect to hero
   ↓
7. State updated via Zustand actions
   ↓
8. UI re-renders with new state
   ↓
9. Auto-save triggered (if enabled)
```

### Combat Flow (Stretch Goal)
```
1. Combat event triggered
   ↓
2. CombatEncounter created with enemies
   ↓
3. Initiative calculated, turn order determined
   ↓
4. Loop: Each combatant's turn
   - Player selects action (attack/defend/ability/item)
   - AI selects action based on behavior
   - Action executed, damage calculated
   - Effects applied
   - Check victory/defeat conditions
   ↓
5. Combat ends → Distribute loot/XP
   ↓
6. Return to dungeon screen
```

---

## Module Organization

```
src/
├── components/        # React UI components
│   ├── screens/       # Full-screen views
│   ├── ui/            # Reusable UI elements
│   └── party/         # Hero management components
│
├── systems/           # Core game logic
│   ├── events.ts      # Event generation
│   ├── combat.ts      # Combat engine
│   ├── loot.ts        # Item generation
│   ├── progression.ts # XP and leveling
│   └── save.ts        # Persistence
│
├── store/             # Zustand state management
│   ├── gameStore.ts   # Main game state
│   ├── partyStore.ts  # Hero party state
│   └── dungeonStore.ts# Dungeon state
│
├── data/              # Static game data
│   ├── classes.ts     # Hero class definitions
│   ├── abilities.ts   # Ability definitions
│   ├── events/        # Event templates
│   └── items.ts       # Item templates
│
├── types/             # TypeScript interfaces
│   └── index.ts       # All type definitions
│
└── utils/             # Utility functions
    ├── random.ts      # RNG helpers
    ├── formulas.ts    # Game formulas
    └── validation.ts  # Input validation
```

---

## Technology Integration

### React + TypeScript
- Functional components with hooks (useState, useEffect, useMemo)
- Type-safe props and state
- Custom hooks for game logic encapsulation

### Chakra UI v2
- Theme customization for fantasy aesthetic
- Responsive layout with Stack, Grid, Flex
- Pre-built components (Button, Card, Modal, Toast)
- Dark mode support

### Zustand
- Lightweight state management (alternative: Redux Toolkit)
- Single store or multiple domain-specific stores
- Simple actions without boilerplate
- Persist middleware for save system

### react-icons/gi
- Game Icons subset for fantasy/RPG iconography
- Icon components with props (size, color)
- Thousands of icons available

### Vite
- Fast HMR during development
- Optimized production builds
- TypeScript support out-of-the-box
- Dev server with proxy support

### Electron (Optional)
- Package web app as desktop application
- File system access for robust save system
- Native menus and notifications
- electron-builder for distribution

---

## Scalability Considerations

### Performance
- Event pool pre-generated at dungeon start to reduce computation during gameplay
- Combat calculations optimized with memoization
- Item generation cached when possible
- React component memoization for complex UI

### Extensibility
- Event templates in JSON for easy content expansion
- Class/ability definitions data-driven
- Modding support via JSON overrides (stretch goal)
- Plugin architecture for custom events/items

### Testing
- Unit tests for formulas and generators
- Integration tests for combat engine
- E2E tests for critical user flows
- Snapshot tests for UI components

---

See [state-management.md](./state-management.md) for Zustand store details and [data-models.md](./data-models.md) for TypeScript interfaces.
