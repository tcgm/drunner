# File Structure

Recommended project structure for Dungeon Runner.

> **CRITICAL DESIGN PRINCIPLE:**  
> **Individual Files Over Monolithic Aggregations**  
> - ✅ One hero class per file: `warrior.ts`, `mage.ts`, etc.  
> - ✅ One event type per file: `combat.ts`, `treasure.ts`, etc.  
> - ✅ One item category per file: `weapons.ts`, `armor.ts`, etc.  
> - ✅ Aggregate via `index.ts` files that import and re-export  
> - ❌ Never create files like `allClasses.ts` or `allEvents.ts` with all content  
> 
> **Benefits:**  
> - Clear ownership and responsibility  
> - Better git merge handling  
> - Easier to find and edit specific content  
> - Parallel development without conflicts  
> - Smaller, focused files that are easier to test

---

## Directory Layout

```
drunner/
├── docs/                          # Documentation
│   ├── OVERVIEW.md                # Game concept overview
│   ├── game-design/               # Game design documents
│   │   ├── classes.md             # Hero classes
│   │   ├── equipment.md           # Items & equipment
│   │   ├── events.md              # Event system
│   │   ├── combat.md              # Combat system (stretch)
│   │   ├── progression.md         # XP & leveling
│   │   └── balance.md             # Balance & formulas
│   ├── technical/                 # Technical docs
│   │   ├── architecture.md        # System architecture
│   │   ├── data-models.md         # TypeScript interfaces
│   │   ├── state-management.md    # Zustand stores
│   │   ├── file-structure.md      # This file
│   │   └── ui-design.md           # UI/UX guidelines
│   └── development/               # Development guides
│       ├── roadmap.md             # Development phases
│       ├── setup.md               # Setup instructions
│       └── deployment.md          # Build & deploy
│
├── src/                           # Source code
│   ├── components/                # React components
│   │   ├── screens/               # Full-screen views
│   │   │   ├── MainMenuScreen.tsx
│   │   │   ├── PartySetupScreen.tsx
│   │   │   ├── DungeonScreen.tsx
│   │   │   ├── CombatScreen.tsx   # Stretch goal
│   │   │   ├── InventoryScreen.tsx
│   │   │   └── ResultsScreen.tsx
│   │   │
│   │   ├── party/                 # Hero/party components
│   │   │   ├── HeroCard.tsx
│   │   │   ├── HeroCreator.tsx
│   │   │   ├── PartyList.tsx
│   │   │   ├── ClassSelector.tsx
│   │   │   └── StatDisplay.tsx
│   │   │
│   │   ├── dungeon/               # Dungeon/event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventChoice.tsx
│   │   │   ├── DepthTracker.tsx
│   │   │   └── FloorProgress.tsx
│   │   │
│   │   ├── combat/                # Combat UI (stretch)
│   │   │   ├── BattleField.tsx
│   │   │   ├── CombatantCard.tsx
│   │   │   ├── ActionMenu.tsx
│   │   │   └── TurnOrder.tsx
│   │   │
│   │   ├── inventory/             # Inventory/items
│   │   │   ├── InventoryGrid.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemTooltip.tsx
│   │   │   ├── EquipmentSlots.tsx
│   │   │   └── MerchantShop.tsx
│   │   │
│   │   └── ui/                    # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── HealthBar.tsx
│   │       ├── ResourceBar.tsx
│   │       └── IconDisplay.tsx
│   │
│   ├── systems/                   # Core game logic
│   │   ├── events/                # Event generation
│   │   │   ├── eventGenerator.ts
│   │   │   ├── eventResolver.ts
│   │   │   └── eventScaling.ts
│   │   │
│   │   ├── combat/                # Combat engine (stretch)
│   │   │   ├── combatEngine.ts
│   │   │   ├── turnManager.ts
│   │   │   ├── damageCalculator.ts
│   │   │   └── ai.ts
│   │   │
│   │   ├── loot/                  # Loot system
│   │   │   ├── lootGenerator.ts
│   │   │   ├── itemGenerator.ts
│   │   │   ├── rarityRoller.ts
│   │   │   └── statGenerator.ts
│   │   │
│   │   ├── progression/           # XP & leveling
│   │   │   ├── experienceManager.ts
│   │   │   ├── levelUpHandler.ts
│   │   │   └── abilityUnlocker.ts
│   │   │
│   │   └── save/                  # Persistence
│   │       ├── saveManager.ts
│   │       ├── localStorageAdapter.ts
│   │       └── fileSystemAdapter.ts  # Electron only
│   │
│   ├── store/                     # Zustand state management
│   │   ├── index.ts               # Store exports
│   │   ├── gameStore.ts           # Main game state
│   │   ├── partyStore.ts          # Hero party state
│   │   ├── dungeonStore.ts        # Dungeon state
│   │   └── combatStore.ts         # Combat state (stretch)
│   │
│   ├── data/                      # Static game data
│   │   ├── classes/               # Hero class definitions (ONE FILE PER CLASS)
│   │   │   ├── index.ts           # Aggregates and exports all classes
│   │   │   ├── warrior.ts         # Warrior class only
│   │   │   ├── mage.ts            # Mage class only
│   │   │   ├── rogue.ts           # Rogue class only
│   │   │   ├── cleric.ts          # Cleric class only
│   │   │   ├── ranger.ts          # Ranger class only
│   │   │   ├── paladin.ts         # Paladin class only
│   │   │   ├── necromancer.ts     # Necromancer class only
│   │   │   ├── bard.ts            # Bard class only
│   │   │   └── ... (12 more stretch classes, each in own file)
│   │   │
│   │   ├── abilities/             # Ability definitions (ONE FILE PER CLASS)
│   │   │   ├── index.ts           # Aggregates all abilities
│   │   │   ├── warriorAbilities.ts
│   │   │   ├── mageAbilities.ts
│   │   │   └── ... (one file per class)
│   │   │
│   │   ├── events/                # Event templates (ONE FILE PER EVENT TYPE)
│   │   │   ├── index.ts           # Aggregates all event types
│   │   │   ├── combat.ts          # Combat event templates only
│   │   │   ├── treasure.ts        # Treasure event templates only
│   │   │   ├── choice.ts          # Choice event templates only
│   │   │   ├── rest.ts            # Rest event templates only
│   │   │   ├── merchant.ts        # Merchant event templates only
│   │   │   ├── trap.ts            # Trap event templates only
│   │   │   └── boss.ts            # Boss event templates only
│   │   │
│   │   ├── items/                 # Item templates (ONE FILE PER SLOT/CATEGORY)
│   │   │   ├── index.ts           # Aggregates all items
│   │   │   ├── weapons.ts         # Weapon templates only
│   │   │   ├── armor.ts           # Armor templates only
│   │   │   ├── helmets.ts         # Helmet templates only
│   │   │   ├── boots.ts           # Boot templates only
│   │   │   ├── accessories.ts     # Accessory templates only
│   │   │   └── consumables.ts     # Consumable templates only
│   │   │
│   │   └── enemies/               # Enemy definitions (ONE FILE PER CATEGORY)
│   │       ├── index.ts           # Aggregates all enemies
│   │       ├── basic.ts           # Basic enemy types
│   │       ├── elite.ts           # Elite enemy types
│   │       └── bosses.ts          # Boss enemy types
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── index.ts               # Main type exports
│   │   ├── hero.ts                # Hero-related types
│   │   ├── dungeon.ts             # Dungeon types
│   │   ├── combat.ts              # Combat types
│   │   ├── item.ts                # Item types
│   │   └── event.ts               # Event types
│   │
│   ├── utils/                     # Utility functions
│   │   ├── random.ts              # RNG helpers
│   │   ├── formulas.ts            # Game formulas
│   │   ├── validation.ts          # Input validation
│   │   ├── formatting.ts          # Text/number formatting
│   │   └── arrays.ts              # Array helpers
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useHero.ts
│   │   ├── useDungeon.ts
│   │   ├── useCombat.ts
│   │   └── useInventory.ts
│   │
│   ├── theme/                     # Chakra UI theme
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── components.ts
│   │   └── fonts.ts
│   │
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point (web)
│   └── electron.ts                # Electron entry (optional)
│
├── public/                        # Static assets
│   ├── index.html
│   └── favicon.ico
│
├── electron/                      # Electron-specific (optional)
│   ├── main.ts                    # Electron main process
│   ├── preload.ts                 # Preload script
│   └── package.json               # Electron package config
│
├── tests/                         # Test files
│   ├── unit/
│   │   ├── systems/
│   │   └── utils/
│   ├── integration/
│   └── e2e/
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── DESIGN.md                      # Legacy, can be archived
```

---

## Data Organization Pattern

### Individual Content Files

**REQUIRED PATTERN:** Each piece of game content must be in its own file.

#### Hero Classes Example
```typescript
// ❌ BAD: src/data/classes/allClasses.ts (monolithic)
export const ALL_CLASSES = [
  { id: 'warrior', name: 'Warrior', ... },
  { id: 'mage', name: 'Mage', ... },
  // ... all classes in one file
]

// ✅ GOOD: src/data/classes/warrior.ts (individual)
import type { HeroClass } from '@/types'

export const WARRIOR: HeroClass = {
  id: 'warrior',
  name: 'Warrior',
  description: 'Tank / Frontline Fighter',
  baseStats: { attack: 10, defense: 8, speed: 5, luck: 4 },
  abilities: [/* ... */],
  icon: 'GiSwordman',
}

// ✅ GOOD: src/data/classes/mage.ts (individual)
import type { HeroClass } from '@/types'

export const MAGE: HeroClass = {
  id: 'mage',
  name: 'Mage',
  // ... mage-specific data
}

// ✅ GOOD: src/data/classes/index.ts (aggregator)
import { WARRIOR } from './warrior'
import { MAGE } from './mage'
import { ROGUE } from './rogue'
// ... import all classes

export const CORE_CLASSES = [WARRIOR, MAGE, ROGUE, /* ... */]
export const STRETCH_CLASSES = [/* ... */]
export const ALL_CLASSES = [...CORE_CLASSES, ...STRETCH_CLASSES]

// Re-export for direct imports
export { WARRIOR, MAGE, ROGUE }
```

#### Events Example
```typescript
// ❌ BAD: All events in one file
// src/data/events/allEvents.ts - DON'T DO THIS

// ✅ GOOD: One file per event type
// src/data/events/combat.ts
import type { DungeonEvent } from '@/types'

export const COMBAT_EVENTS: DungeonEvent[] = [
  {
    id: 'goblin-ambush',
    type: 'combat',
    title: 'Goblin Ambush!',
    description: 'A group of goblins leaps out...',
    // ... event data
  },
  {
    id: 'skeleton-patrol',
    type: 'combat',
    // ... event data
  },
  // All combat events together
]

// src/data/events/treasure.ts
export const TREASURE_EVENTS: DungeonEvent[] = [
  // All treasure events together
]

// src/data/events/index.ts (aggregator)
import { COMBAT_EVENTS } from './combat'
import { TREASURE_EVENTS } from './treasure'
import { CHOICE_EVENTS } from './choice'
// ... import all event types

export const ALL_EVENTS = [
  ...COMBAT_EVENTS,
  ...TREASURE_EVENTS,
  ...CHOICE_EVENTS,
  // ... all event types
]

export { COMBAT_EVENTS, TREASURE_EVENTS, CHOICE_EVENTS }
```

#### Items Example
```typescript
// ✅ GOOD: src/data/items/weapons.ts
import type { Item } from '@/types'

export const WEAPON_TEMPLATES: Partial<Item>[] = [
  {
    name: 'Iron Sword',
    type: 'weapon',
    description: 'A sturdy iron blade',
    stats: { attack: 5 },
  },
  {
    name: 'Steel Axe',
    type: 'weapon',
    stats: { attack: 7, speed: -1 },
  },
  // All weapon templates
]

// src/data/items/armor.ts
export const ARMOR_TEMPLATES: Partial<Item>[] = [
  // All armor templates
]

// src/data/items/index.ts
import { WEAPON_TEMPLATES } from './weapons'
import { ARMOR_TEMPLATES } from './armor'
// ... import all item types

export const ALL_ITEM_TEMPLATES = [
  ...WEAPON_TEMPLATES,
  ...ARMOR_TEMPLATES,
  // ... all item types
]
```

### Index File Pattern

Every `data/` subdirectory MUST have an `index.ts` that:
1. Imports all individual content files
2. Aggregates them into collections (arrays, objects)
3. Re-exports individual items for direct import
4. Provides helper functions (getById, getRandom, etc.)

```typescript
// src/data/classes/index.ts - Standard Pattern
import type { HeroClass } from '@/types'

// Import all individual files
import { WARRIOR } from './warrior'
import { MAGE } from './mage'
import { ROGUE } from './rogue'
import { CLERIC } from './cleric'
import { RANGER } from './ranger'
import { PALADIN } from './paladin'
import { NECROMANCER } from './necromancer'
import { BARD } from './bard'

// Aggregate into collections
export const CORE_CLASSES: HeroClass[] = [
  WARRIOR, MAGE, ROGUE, CLERIC,
  RANGER, PALADIN, NECROMANCER, BARD,
]

export const STRETCH_CLASSES: HeroClass[] = [
  // Stretch classes when added
]

export const ALL_CLASSES: HeroClass[] = [
  ...CORE_CLASSES,
  ...STRETCH_CLASSES,
]

// Helper functions
export function getClassById(id: string): HeroClass | undefined {
  return ALL_CLASSES.find(c => c.id === id)
}

export function getRandomClass(): HeroClass {
  return ALL_CLASSES[Math.floor(Math.random() * ALL_CLASSES.length)]
}

// Re-export individual classes
export { WARRIOR, MAGE, ROGUE, CLERIC, RANGER, PALADIN, NECROMANCER, BARD }
```

---

## Naming Conventions

### Files
- **Components**: PascalCase with `.tsx` extension
  - `HeroCard.tsx`, `EventChoice.tsx`, `MainMenuScreen.tsx`
- **Utilities/Logic**: camelCase with `.ts` extension
  - `eventGenerator.ts`, `damageCalculator.ts`, `random.ts`
- **Data**: camelCase with `.ts` extension
  - `warrior.ts`, `combatEvents.ts`, `weapons.ts`
- **Types**: camelCase with `.ts` extension
  - `hero.ts`, `item.ts`, `event.ts`

### Folders
- **Lowercase with hyphens** for multi-word: `game-design/`, `state-management.md`
- **Single lowercase word** preferred: `components/`, `systems/`, `data/`

### Code
- **Interfaces/Types**: PascalCase
  - `Hero`, `DungeonEvent`, `CombatAction`
- **Functions**: camelCase
  - `generateEvent()`, `calculateDamage()`, `levelUp()`
- **Constants**: UPPER_SNAKE_CASE
  - `MAX_PARTY_SIZE`, `BASE_GOLD_REWARD`, `COMBAT_EVENT_CHANCE`
- **React Components**: PascalCase
  - `<HeroCard>`, `<EventChoice>`, `<InventoryGrid>`

---

## Import Aliases (tsconfig.json)

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
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@theme/*": ["src/theme/*"]
    }
  }
}
```

**Usage:**
```typescript
import { Hero } from '@types/hero';
import { generateEvent } from '@systems/events/eventGenerator';
import { usePartyStore } from '@store/partyStore';
import { HeroCard } from '@components/party/HeroCard';
import { rollDice } from '@utils/random';
```

---

## Component Organization

### Screen Components
- One file per screen
- Handle routing/navigation logic
- Compose smaller components
- Connect to Zustand stores

```typescript
// src/components/screens/DungeonScreen.tsx
import { useDungeonStore } from '@store/dungeonStore';
import { EventCard } from '@components/dungeon/EventCard';
import { DepthTracker } from '@components/dungeon/DepthTracker';

export function DungeonScreen() {
  const currentEvent = useDungeonStore(state => state.currentDungeon?.currentEvent);
  // ... implementation
}
```

### Feature Components
- Grouped by feature domain (party, dungeon, combat, inventory)
- Single responsibility
- Reusable across screens

```typescript
// src/components/party/HeroCard.tsx
interface HeroCardProps {
  hero: Hero;
  onClick?: () => void;
  showDetails?: boolean;
}

export function HeroCard({ hero, onClick, showDetails }: HeroCardProps) {
  // ... implementation
}
```

### UI Components
- Generic, reusable across all features
- No game logic
- Chakra UI wrappers or custom implementations

```typescript
// src/components/ui/HealthBar.tsx
interface HealthBarProps {
  current: number;
  max: number;
  colorScheme?: string;
}

export function HealthBar({ current, max, colorScheme = 'red' }: HealthBarProps) {
  // ... implementation
}
```

---

## System Modules

### Event Generation
```typescript
// src/systems/events/eventGenerator.ts
export function generateEvent(depth: number): DungeonEvent {
  const type = selectEventType();
  const template = selectTemplate(type, depth);
  return scaleEvent(template, depth);
}
```

### Loot System
```typescript
// src/systems/loot/lootGenerator.ts
export function generateLoot(depth: number, quantity: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < quantity; i++) {
    const rarity = rollRarity(depth);
    const type = rollItemType();
    items.push(generateItem(type, rarity, depth));
  }
  return items;
}
```

---

## Data Files

### Class Definitions (ONE PER FILE)
```typescript
// src/data/classes/warrior.ts
import type { HeroClass } from '@/types'

export const WARRIOR: HeroClass = {
  id: 'warrior',
  name: 'Warrior',
  description: 'Tank / Frontline Fighter - Absorbs damage, deals consistent physical damage',
  baseStats: {
    attack: 10,
    defense: 8,
    speed: 5,
    luck: 4,
  },
  abilities: [
    {
      id: 'power-strike',
      name: 'Power Strike',
      description: 'High damage single attack',
      cooldown: 2,
      currentCooldown: 0,
      effect: { type: 'damage', value: 20, target: 'enemy' },
    },
    // ... more abilities
  ],
  icon: 'GiSwordman',
}
```

### Event Templates (ONE FILE PER TYPE)
```typescript
// src/data/events/combat.ts
import type { DungeonEvent } from '@/types'

export const COMBAT_EVENTS: DungeonEvent[] = [
  {
    id: 'goblin-ambush',
    type: 'combat',
    title: 'Goblin Ambush!',
    description: 'A group of goblins leaps out from behind the rocks!',
    choices: [
      {
        text: 'Fight them head-on',
        outcome: {
          text: 'You engage the goblins in combat!',
          effects: [
            { type: 'xp', value: 50 },
            { type: 'gold', value: 25 },
          ],
        },
      },
      // ... more choices
    ],
    depth: 1,
  },
  // ... more combat events
]
```

### Item Templates (ONE FILE PER CATEGORY)
```typescript
// src/data/items/weapons.ts
import type { Item } from '@/types'

export const WEAPON_TEMPLATES: Partial<Item>[] = [
  {
    name: 'Iron Sword',
    type: 'weapon',
    description: 'A sturdy iron blade',
    stats: { attack: 5 },
    value: 50,
  },
  {
    name: 'Steel Axe',
    type: 'weapon',
    description: 'A heavy two-handed axe',
    stats: { attack: 7, speed: -1 },
    value: 75,
  },
  // ... more weapon templates
]
```

---

See [architecture.md](./architecture.md) for system overview and [ui-design.md](./ui-design.md) for component guidelines.

