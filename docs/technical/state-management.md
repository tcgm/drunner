# State Management with Zustand

State management architecture using Zustand for Dungeon Runner.

---

## Store Architecture

### Option 1: Single Store (Simpler)
```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  // Game State
  gameActive: boolean;
  isPaused: boolean;
  currentScreen: Screen;
  
  // Party
  party: Hero[];
  selectedHero: string | null;
  gold: number;
  
  // Dungeon
  dungeon: Dungeon;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  addHero: (hero: Hero) => void;
  removeHero: (heroId: string) => void;
  selectHero: (heroId: string | null) => void;
  
  startDungeon: (difficulty: number) => void;
  progressDungeon: () => void;
  resolveEvent: (choiceId: string) => void;
  
  equipItem: (heroId: string, item: Item, slot: keyof Equipment) => void;
  addGold: (amount: number) => void;
  
  saveGame: (slot: number) => void;
  loadGame: (slot: number) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      gameActive: false,
      isPaused: false,
      currentScreen: 'main-menu',
      party: [],
      selectedHero: null,
      gold: 0,
      dungeon: null,
      
      // Actions
      startGame: () => set({ gameActive: true, currentScreen: 'party-setup' }),
      
      pauseGame: () => set({ isPaused: true }),
      
      addHero: (hero) => set((state) => ({
        party: [...state.party, hero]
      })),
      
      removeHero: (heroId) => set((state) => ({
        party: state.party.filter(h => h.id !== heroId)
      })),
      
      selectHero: (heroId) => set({ selectedHero: heroId }),
      
      startDungeon: (difficulty) => {
        const dungeon = generateDungeon(difficulty);
        set({ 
          dungeon, 
          currentScreen: 'dungeon',
          gameActive: true 
        });
      },
      
      progressDungeon: () => {
        const { dungeon } = get();
        const newEvent = generateEvent(dungeon.currentDepth);
        set((state) => ({
          dungeon: {
            ...state.dungeon,
            currentEvent: newEvent,
            currentDepth: state.dungeon.currentDepth + 1
          }
        }));
      },
      
      resolveEvent: (choiceId) => {
        const { dungeon, party } = get();
        const outcome = executeEventChoice(dungeon.currentEvent, choiceId, party);
        
        set((state) => ({
          party: outcome.updatedParty,
          gold: state.gold + (outcome.goldReward || 0),
          dungeon: {
            ...state.dungeon,
            visitedEvents: [...state.dungeon.visitedEvents, dungeon.currentEvent.id]
          }
        }));
      },
      
      equipItem: (heroId, item, slot) => set((state) => ({
        party: state.party.map(hero =>
          hero.id === heroId
            ? { ...hero, equipment: { ...hero.equipment, [slot]: item } }
            : hero
        )
      })),
      
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      
      saveGame: (slot) => {
        const state = get();
        localStorage.setItem(`save_${slot}`, JSON.stringify({
          party: state.party,
          gold: state.gold,
          dungeon: state.dungeon,
          timestamp: Date.now()
        }));
      },
      
      loadGame: (slot) => {
        const saved = localStorage.getItem(`save_${slot}`);
        if (saved) {
          const data = JSON.parse(saved);
          set({
            party: data.party,
            gold: data.gold,
            dungeon: data.dungeon,
            gameActive: true,
            currentScreen: 'dungeon'
          });
        }
      }
    }),
    {
      name: 'dungeon-runner-storage',
      partialize: (state) => ({
        party: state.party,
        gold: state.gold,
        dungeon: state.dungeon
      })
    }
  )
);
```

### Option 2: Multiple Domain Stores (Better Separation)
```typescript
// gameStore.ts
export const useGameStore = create<GameStore>((set) => ({
  gameActive: false,
  isPaused: false,
  currentScreen: 'main-menu',
  
  startGame: () => set({ gameActive: true, currentScreen: 'party-setup' }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  navigateTo: (screen) => set({ currentScreen: screen })
}));

// partyStore.ts
export const usePartyStore = create<PartyStore>()(
  persist(
    (set) => ({
      heroes: [],
      selectedHero: null,
      gold: 0,
      
      addHero: (hero) => set((state) => ({
        heroes: [...state.heroes, hero]
      })),
      
      removeHero: (heroId) => set((state) => ({
        heroes: state.heroes.filter(h => h.id !== heroId)
      })),
      
      updateHero: (heroId, updates) => set((state) => ({
        heroes: state.heroes.map(h =>
          h.id === heroId ? { ...h, ...updates } : h
        )
      })),
      
      selectHero: (heroId) => set({ selectedHero: heroId }),
      
      equipItem: (heroId, item, slot) => set((state) => ({
        heroes: state.heroes.map(hero =>
          hero.id === heroId
            ? { ...hero, equipment: { ...hero.equipment, [slot]: item } }
            : hero
        )
      })),
      
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      spendGold: (amount) => set((state) => ({ gold: state.gold - amount }))
    }),
    { name: 'party-storage' }
  )
);

// dungeonStore.ts
export const useDungeonStore = create<DungeonStore>()(
  persist(
    (set, get) => ({
      currentDungeon: null,
      
      startDungeon: (difficulty) => {
        const dungeon = generateDungeon(difficulty);
        set({ currentDungeon: dungeon });
      },
      
      nextEvent: () => {
        const { currentDungeon } = get();
        const newEvent = generateEvent(currentDungeon.currentDepth);
        set((state) => ({
          currentDungeon: {
            ...state.currentDungeon,
            currentEvent: newEvent,
            currentDepth: state.currentDungeon.currentDepth + 1
          }
        }));
      },
      
      resolveEvent: (choiceId, outcome) => {
        set((state) => ({
          currentDungeon: {
            ...state.currentDungeon,
            visitedEvents: [...state.currentDungeon.visitedEvents, state.currentDungeon.currentEvent.id],
            currentEvent: null
          }
        }));
      },
      
      endDungeon: () => set({ currentDungeon: null })
    }),
    { name: 'dungeon-storage' }
  )
);
```

---

## Usage in Components

### Accessing State
```typescript
import { useStore } from '@/store';

function PartyScreen() {
  const party = useStore((state) => state.party);
  const gold = useStore((state) => state.gold);
  const addHero = useStore((state) => state.addHero);
  
  return (
    <Box>
      <Text>Gold: {gold}</Text>
      <VStack>
        {party.map(hero => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </VStack>
      <Button onClick={() => addHero(createNewHero())}>
        Add Hero
      </Button>
    </Box>
  );
}
```

### Selective Subscriptions (Performance)
```typescript
// Only re-render when party changes, not when gold changes
function PartyList() {
  const party = useStore((state) => state.party);
  
  return (
    <VStack>
      {party.map(hero => <HeroCard key={hero.id} hero={hero} />)}
    </VStack>
  );
}
```

### Multiple Stores
```typescript
import { useGameStore, usePartyStore, useDungeonStore } from '@/store';

function DungeonScreen() {
  const isPaused = useGameStore((state) => state.isPaused);
  const party = usePartyStore((state) => state.heroes);
  const currentEvent = useDungeonStore((state) => state.currentDungeon?.currentEvent);
  
  const resolveChoice = useDungeonStore((state) => state.resolveEvent);
  const updateHero = usePartyStore((state) => state.updateHero);
  
  const handleChoice = (choiceId: string) => {
    const outcome = calculateOutcome(currentEvent, choiceId, party);
    resolveChoice(choiceId, outcome);
    
    // Update affected heroes
    outcome.heroChanges.forEach(({ heroId, changes }) => {
      updateHero(heroId, changes);
    });
  };
  
  return <EventCard event={currentEvent} onChoice={handleChoice} />;
}
```

---

## Persistence Strategy

### Auto-Save
```typescript
// In store definition
export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ... state and actions
      
      // Wrapper actions that trigger auto-save
      resolveEvent: (choiceId) => {
        // ... resolve logic
        set(newState);
        
        // Auto-save after significant actions
        if (get().settings.autoSave) {
          get().saveGame(0); // Slot 0 = auto-save
        }
      },
      
      levelUp: (heroId) => {
        // ... level up logic
        set(newState);
        
        if (get().settings.autoSave) {
          get().saveGame(0);
        }
      }
    }),
    {
      name: 'dungeon-runner-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle version migrations
        if (version === 0) {
          // Upgrade from v0 to v1
          return {
            ...persistedState,
            newField: defaultValue
          };
        }
        return persistedState;
      }
    }
  )
);
```

### Manual Save Slots
```typescript
interface SaveFile {
  slot: number;
  timestamp: number;
  party: Hero[];
  gold: number;
  dungeon: Dungeon;
  depth: number;
}

const saveGame = (slot: number) => {
  const state = get();
  const saveData: SaveFile = {
    slot,
    timestamp: Date.now(),
    party: state.party,
    gold: state.gold,
    dungeon: state.dungeon,
    depth: state.dungeon?.currentDepth || 0
  };
  
  localStorage.setItem(`save_${slot}`, JSON.stringify(saveData));
};

const loadGame = (slot: number) => {
  const saved = localStorage.getItem(`save_${slot}`);
  if (!saved) return;
  
  const data: SaveFile = JSON.parse(saved);
  set({
    party: data.party,
    gold: data.gold,
    dungeon: data.dungeon,
    gameActive: true,
    currentScreen: 'dungeon'
  });
};

const listSaves = (): SaveFile[] => {
  const saves: SaveFile[] = [];
  for (let i = 0; i < 10; i++) {
    const saved = localStorage.getItem(`save_${i}`);
    if (saved) {
      saves.push(JSON.parse(saved));
    }
  }
  return saves.sort((a, b) => b.timestamp - a.timestamp);
};
```

---

## Computed Values (Selectors)

```typescript
// In component
const totalPartyHealth = useStore((state) =>
  state.party.reduce((sum, hero) => sum + hero.stats.currentHealth, 0)
);

const isPartyDead = useStore((state) =>
  state.party.every(hero => hero.stats.currentHealth <= 0)
);

const canAfford = (cost: number) => useStore((state) => state.gold >= cost);

// Or as separate selector functions
export const selectTotalPartyHealth = (state: AppStore) =>
  state.party.reduce((sum, hero) => sum + hero.stats.currentHealth, 0);

export const selectIsPartyDead = (state: AppStore) =>
  state.party.every(hero => hero.stats.currentHealth <= 0);

// Usage
const totalHealth = useStore(selectTotalPartyHealth);
```

---

## Middleware & Devtools

```typescript
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ... state and actions
      }),
      { name: 'dungeon-runner-storage' }
    ),
    { name: 'DungeonRunner' }
  )
);
```

---

See [architecture.md](./architecture.md) for system overview and [data-models.md](./data-models.md) for TypeScript interfaces.
