# Development Guidelines - Quick Reference

Essential rules and patterns for Dungeon Runner development.

---

## 🔴 CRITICAL: Individual File Principle

**NEVER create monolithic content files. Always use individual files.**

### ✅ CORRECT Pattern
```
src/data/classes/
  ├── index.ts       # Aggregates all classes
  ├── warrior.ts     # Warrior only
  ├── mage.ts        # Mage only
  └── rogue.ts       # Rogue only
```

### ❌ INCORRECT Pattern
```
src/data/classes/
  └── allClasses.ts  # ❌ All classes in one file - DON'T DO THIS
```

### Why This Matters
- **Git conflicts:** Massive files = constant merge conflicts
- **Ownership:** Clear who owns what content
- **Parallel dev:** Multiple people can work on different classes simultaneously
- **Maintainability:** Easy to find and edit specific content
- **Testing:** Smaller, focused files are easier to test

---

## 📁 Required File Structure

### Data Files (Content)
- **One class per file**: `warrior.ts`, `mage.ts`, etc.
- **One event type per file**: `combat.ts`, `treasure.ts`, etc.
- **One item category per file**: `weapons.ts`, `armor.ts`, etc.
- **Aggregator**: `index.ts` imports all, exports collections

### Component Files
- **One component per file**: `HeroCard.tsx`, `EventChoice.tsx`
- **Colocate tests**: `HeroCard.test.tsx` next to `HeroCard.tsx`
- **Group by feature**: `components/party/`, `components/dungeon/`

### System Files
- **One system per file**: `eventGenerator.ts`, `lootGenerator.ts`
- **Pure functions**: No React dependencies in systems
- **Stateless**: Side effects isolated

---

## 🎯 Import Patterns

### Type Imports
```typescript
// ✅ CORRECT: Type-only import
import type { HeroClass, Hero } from '@/types'

// ❌ WRONG: Regular import of types
import { HeroClass } from '@/types'
```

### Path Aliases
```typescript
// ✅ CORRECT: Use path aliases
import { WARRIOR } from '@data/classes'
import { createHero } from '@utils/heroUtils'
import { HeroCard } from '@components/party/HeroCard'

// ❌ WRONG: Relative imports
import { WARRIOR } from '../../data/classes/warrior'
```

### Data Imports
```typescript
// ✅ CORRECT: Import from aggregator
import { ALL_CLASSES, WARRIOR, MAGE } from '@data/classes'

// ✅ ALSO CORRECT: Import specific file
import { WARRIOR } from '@data/classes/warrior'

// ❌ WRONG: Import from non-existent monolithic file
import { ALL_CLASSES } from '@data/classes/allClasses'
```

---

## 📦 Aggregator Pattern

Every `data/` subdirectory MUST have an `index.ts`:

```typescript
// src/data/classes/index.ts

import type { HeroClass } from '@/types'

// 1. Import all individual files
import { WARRIOR } from './warrior'
import { MAGE } from './mage'
import { ROGUE } from './rogue'

// 2. Create collections
export const CORE_CLASSES: HeroClass[] = [
  WARRIOR,
  MAGE,
  ROGUE,
]

export const ALL_CLASSES: HeroClass[] = [
  ...CORE_CLASSES,
]

// 3. Helper functions
export function getClassById(id: string): HeroClass | undefined {
  return ALL_CLASSES.find(c => c.id === id)
}

// 4. Re-export individuals
export { WARRIOR, MAGE, ROGUE }
```

---

## 🎨 Naming Conventions

### Files
- **Components**: `PascalCase.tsx` → `HeroCard.tsx`
- **Utilities**: `camelCase.ts` → `heroUtils.ts`
- **Data**: `camelCase.ts` → `warrior.ts`, `combat.ts`
- **Types**: `camelCase.ts` → `hero.ts`, `item.ts`

### Code
- **Types/Interfaces**: `PascalCase` → `Hero`, `HeroClass`
- **Functions**: `camelCase` → `createHero()`, `generateEvent()`
- **Constants**: `UPPER_SNAKE_CASE` → `MAX_PARTY_SIZE`
- **Exports**: `UPPER_SNAKE_CASE` → `WARRIOR`, `COMBAT_EVENTS`

### Folders
- **Single word**: `components/`, `systems/`, `data/`
- **Multi-word**: `game-design/`, `state-management.md`

---

## 🧪 Component Patterns

### Props Interface
```typescript
// ✅ CORRECT: Define props interface
interface HeroCardProps {
  hero: Hero
  onClick?: () => void
  showDetails?: boolean
}

export function HeroCard({ hero, onClick, showDetails }: HeroCardProps) {
  // ...
}
```

### Type Imports in Components
```typescript
// ✅ CORRECT
import type { Hero, HeroClass } from '@/types'
import { createHero } from '@utils/heroUtils'
import { WARRIOR } from '@data/classes'

// ❌ WRONG: Missing 'type' keyword
import { Hero, HeroClass } from '@/types'
```

---

## 🗄️ State Management

### Store Pattern
```typescript
// src/store/gameStore.ts
import { create } from 'zustand'
import type { GameState, Hero } from '@/types'

interface GameStore extends GameState {
  // Actions
  addHero: (hero: Hero) => void
  removeHero: (id: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  party: [],
  
  // Actions
  addHero: (hero) => set((state) => ({ 
    party: [...state.party, hero] 
  })),
  
  removeHero: (id) => set((state) => ({
    party: state.party.filter(h => h.id !== id)
  })),
}))
```

### Using Store in Components
```typescript
// ✅ CORRECT: Selector pattern
const party = useGameStore((state) => state.party)
const addHero = useGameStore((state) => state.addHero)

// ✅ ALSO CORRECT: Destructure pattern
const { party, addHero } = useGameStore()
```

---

## 🚫 Common Mistakes to Avoid

1. ❌ Creating `allClasses.ts`, `allEvents.ts`, or similar monolithic files
2. ❌ Using `import { Type } from '@types/index'` (conflicts with TypeScript)
3. ❌ Relative imports instead of path aliases
4. ❌ Missing `type` keyword for type-only imports
5. ❌ Mixing multiple content pieces in one file
6. ❌ No `index.ts` aggregator in data directories
7. ❌ React dependencies in system files
8. ❌ Not re-exporting individual items from aggregator

---

## ✅ Quick Checklist

Before committing, verify:

- [ ] Each class/event/item is in its own file
- [ ] `index.ts` aggregator exists and exports collections
- [ ] Using `import type` for TypeScript types
- [ ] Using path aliases (`@/types`, `@data`, etc.)
- [ ] No monolithic content files
- [ ] Files follow naming conventions
- [ ] Components have props interfaces
- [ ] No TypeScript errors

---

## 📚 Reference Documents

- **Full Details**: `docs/technical/architecture.md`
- **File Structure**: `docs/technical/file-structure.md`
- **Setup Guide**: `SETUP_INSTRUCTIONS.md`
- **Game Design**: `docs/game-design/`
- **Roadmap**: `docs/development/roadmap.md`
