# File Structure

Recommended project structure for Dungeon Runner.

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
│   │   ├── classes/               # Hero class definitions
│   │   │   ├── index.ts
│   │   │   ├── warrior.ts
│   │   │   ├── mage.ts
│   │   │   ├── rogue.ts
│   │   │   └── ... (17 more classes)
│   │   │
│   │   ├── abilities/             # Ability definitions
│   │   │   ├── index.ts
│   │   │   ├── warriorAbilities.ts
│   │   │   ├── mageAbilities.ts
│   │   │   └── ...
│   │   │
│   │   ├── events/                # Event templates
│   │   │   ├── index.ts
│   │   │   ├── combatEvents.ts
│   │   │   ├── treasureEvents.ts
│   │   │   ├── choiceEvents.ts
│   │   │   ├── restEvents.ts
│   │   │   ├── merchantEvents.ts
│   │   │   ├── trapEvents.ts
│   │   │   └── bossEvents.ts
│   │   │
│   │   ├── items/                 # Item templates
│   │   │   ├── index.ts
│   │   │   ├── weapons.ts
│   │   │   ├── armor.ts
│   │   │   ├── accessories.ts
│   │   │   └── consumables.ts
│   │   │
│   │   └── enemies/               # Enemy definitions
│   │       ├── index.ts
│   │       ├── basic.ts
│   │       ├── elite.ts
│   │       └── bosses.ts
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

### Class Definitions
```typescript
// src/data/classes/warrior.ts
import { HeroClass } from '@types/hero';

export const WARRIOR: HeroClass = {
  name: 'Warrior',
  description: 'A melee powerhouse...',
  baseStats: {
    maxHealth: 50,
    attack: 12,
    defense: 8,
    speed: 5,
    luck: 3
  },
  startingAbilities: ['power_strike', 'defensive_stance'],
  icon: 'GiCrossedSwords'
};
```

### Event Templates
```typescript
// src/data/events/combatEvents.ts
import { DungeonEvent } from '@types/event';

export const GOBLIN_AMBUSH: DungeonEvent = {
  id: 'goblin_ambush',
  type: 'combat',
  title: 'Goblin Ambush!',
  description: 'A group of goblins leap out...',
  icon: 'GiGoblin',
  encounter: {
    enemies: [/* ... */]
  },
  tags: ['combat', 'common', 'goblins']
};
```

---

See [architecture.md](./architecture.md) for system overview and [ui-design.md](./ui-design.md) for component guidelines.
