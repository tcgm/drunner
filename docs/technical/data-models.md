# Data Models - TypeScript Interfaces

Core TypeScript interfaces and types for Dungeon Runner.

---

## Hero System

```typescript
interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  level: number;
  experience: number;
  
  stats: {
    maxHealth: number;
    currentHealth: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
  };
  
  appearance: {
    icon: string;
    color: string;
    portrait?: string;
  };
  
  equipment: {
    weapon?: Item;
    armor?: Item;
    helmet?: Item;
    boots?: Item;
    accessory1?: Item;
    accessory2?: Item;
    // Stretch goal slots
    offhand?: Item;
    belt?: Item;
    cloak?: Item;
    gloves?: Item;
  };
  
  inventory: Item[];
  traits: Trait[];
  abilities: Ability[];
  statusEffects: StatusEffect[];
}

interface HeroClass {
  name: string;
  description: string;
  baseStats: Stats;
  startingAbilities: string[];
  icon: string;
}

interface Ability {
  id: string;
  name: string;
  description: string;
  type: "active" | "passive" | "ultimate";
  cooldown?: number;
  usesPerRun?: number;
  effect: AbilityEffect;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  statModifiers?: Partial<Stats>;
  eventModifiers?: { eventType: string; bonus: number };
  special?: {
    type: "reroll" | "extra_loot" | "avoid_trap" | "discount";
    value: number;
  };
}

interface StatusEffect {
  id: string;
  name: string;
  type: "buff" | "debuff" | "dot" | "hot";
  duration: number;
  effect: any;
}
```

---

## Dungeon & Events

```typescript
interface Dungeon {
  id: string;
  name: string;
  difficulty: number;
  currentDepth: number;
  maxDepth: number;
  seed?: string;
  
  visitedEvents: string[];
  currentEvent: DungeonEvent | null;
  
  floorsCleared: number;
  monstersDefeated: number;
  treasureFound: number;
}

interface DungeonEvent {
  id: string;
  type: EventType;
  depth: number;
  
  title: string;
  description: string;
  icon: string;
  
  choices: EventChoice[];
  encounter?: CombatEncounter;
  tags: string[];
}

type EventType = 
  | "combat"
  | "treasure"
  | "merchant"
  | "rest"
  | "trap"
  | "mystery"
  | "boss"
  | "choice";

interface EventChoice {
  id: string;
  text: string;
  icon?: string;
  
  requires?: {
    stat?: { hero: string; stat: keyof Stats; min: number };
    item?: string;
    trait?: string;
  };
  
  outcomes: EventOutcome[];
  successChance?: number;
}

interface EventOutcome {
  type: "damage" | "heal" | "loot" | "combat" | "continue" | "status" | "nothing";
  
  damage?: { target: "random" | "all" | "choice"; amount: number };
  heal?: { target: "random" | "all" | "choice"; amount: number };
  loot?: Item[];
  combat?: CombatEncounter;
  status?: { effect: StatusEffect; target: string };
  
  text: string;
}
```

---

## Combat System

```typescript
interface CombatEncounter {
  id: string;
  enemies: Enemy[];
  environment: string;
  
  turnOrder: Combatant[];
  currentTurn: number;
  round: number;
  
  combatEvents?: CombatEvent[];
}

interface Enemy {
  id: string;
  name: string;
  type: string;
  level: number;
  
  stats: Stats;
  currentHealth: number;
  
  icon: string;
  abilities: Ability[];
  behavior: AIBehavior;
  loot: LootTable;
}

type AIBehavior = "aggressive" | "defensive" | "support" | "random";

interface CombatAction {
  actor: string;
  type: "attack" | "defend" | "ability" | "item" | "pass";
  target?: string;
  ability?: Ability;
  item?: Item;
}

interface CombatEvent {
  trigger: "round" | "health" | "death" | "random";
  condition: any;
  title: string;
  description: string;
  effects: EventOutcome[];
}
```

---

## Items & Equipment

```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  type: ItemType;
  rarity: ItemRarity;
  
  stats?: Partial<Stats>;
  effects?: ItemEffect[];
  
  value: number;
  stackable: boolean;
  quantity?: number;
  
  // Item generation metadata
  materialId?: string;        // Material used (for procedural items)
  baseTemplateId?: string;    // Base template used (for procedural items)
  isUnique?: boolean;         // True for unique/set items
  statVersion?: number;       // Stat calculation version (for migrations)
}

/**
 * Stat Calculation & Versioning
 * 
 * Items generated procedurally use this formula:
 *   Stat Value = Base Template × Material Multiplier × Rarity Multiplier
 * 
 * The statVersion field tracks which formula version was used:
 *   - Version 1 (current): base × material × rarity
 *   - Future versions: may include depth scaling, modifiers, etc.
 * 
 * On save load, items with outdated statVersion are automatically
 * recalculated using the current formula and marked with the new version.
 * This ensures game balance remains consistent across updates.
 * 
 * See: src/utils/itemMigration.ts, src/systems/loot/lootGenerator.ts
 */

type ItemType = 
  | "weapon" | "armor" | "helmet" | "boots" | "accessory"
  | "consumable" | "quest" | "material"
  // Stretch goal types
  | "offhand" | "belt" | "cloak" | "gloves";

type ItemRarity =
  | "junk" | "common" | "uncommon" | "rare" 
  | "epic" | "legendary" | "mythic"
  // Stretch goal rarities
  | "artifact" | "cursed" | "set";

interface ItemEffect {
  type: "heal" | "damage" | "buff" | "debuff" | "revive";
  value: number;
  duration?: number;
  stat?: keyof Stats;
}

interface LootTable {
  guaranteed: Item[];
  possible: Array<{
    item: Item;
    chance: number;
  }>;
}
```

---

## Game State

```typescript
interface GameState {
  gameActive: boolean;
  isPaused: boolean;
  
  party: Hero[];
  gold: number;
  
  dungeon: Dungeon;
  
  currentScreen: Screen;
  selectedHero: string | null;
  
  settings: GameSettings;
}

interface GameSettings {
  volume: number;
  sfxVolume: number;
  animationSpeed: "slow" | "normal" | "fast";
  autoSave: boolean;
}

type Screen = 
  | "main-menu"
  | "party-setup"
  | "dungeon"
  | "combat"
  | "inventory"
  | "results"
  | "settings";
```

---

## Utility Types

```typescript
interface Stats {
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  speed: number;
  luck: number;
  magicPower?: number; // Stretch goal
}

type Combatant = Hero | Enemy;

interface Position {
  x: number;
  y: number;
}

interface Modifier {
  stat: keyof Stats;
  value: number;
  duration?: number;
}
```

---

See [architecture.md](./architecture.md) for system architecture and [state-management.md](./state-management.md) for Zustand store structure.
