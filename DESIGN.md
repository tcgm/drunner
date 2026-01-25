# Dungeon Runner - Design Document

## Project Overview

**Dungeon Runner** is an event-based, procedurally generated dungeon crawler built with React, TypeScript, and Chakra UI. It can run as a web application in any modern browser or be packaged as a desktop app with Electron. Players manage a party of customizable heroes as they descend through a dungeon, making strategic choices at each event node, collecting loot, and engaging in turn-based combat encounters.

---

## Technology Stack

### Core Technologies
- **React 18+**: UI framework with functional components and hooks
- **TypeScript**: Type-safe development
- **Chakra UI v2**: Modern, accessible component library
- **React-icons**: Comprehensive icon library (includes game-icons via react-icons/gi)
- **Vite**: Fast build tooling and dev server

### Additional Libraries
- **Zustand** or **Redux Toolkit**: State management
- **React Router**: Navigation between screens
- **Framer Motion**: Animations (built into Chakra UI)
- **uuid**: Unique ID generation
- **immer**: Immutable state updates

### Optional (Desktop Build)
- **Electron**: Desktop application framework for cross-platform packaging
- **electron-builder**: Build and package Electron apps

---

## Game Architecture

### High-Level Flow
```
Main Menu → Party Setup → Dungeon Run → Event Resolution → Combat (if applicable) → Continue/Game Over → Results
```

### Core Systems
1. **Party Management System**
2. **Dungeon Generation System**
3. **Event System**
4. **Combat System** (Stretch Goal)
5. **Inventory & Equipment System**
6. **Progression System**

---

## 1. Party Management System

### Hero Structure
```typescript
interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  level: number;
  experience: number;
  
  // Stats
  stats: {
    maxHealth: number;
    currentHealth: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
  };
  
  // Customization
  appearance: {
    icon: string; // game-icons reference
    color: string;
    portrait?: string;
  };
  
  // Equipment
  equipment: {
    // Core slots (MVP)
    weapon?: Item;
    armor?: Item;
    helmet?: Item;
    boots?: Item;
    accessory1?: Item;
    accessory2?: Item;
    
    // Stretch goal slots
    offhand?: Item;      // Shield, tome, second weapon
    belt?: Item;         // Utility items, potions
    cloak?: Item;        // Movement/stealth bonuses
    gloves?: Item;       // Attack speed, dexterity
  };
  
  // Inventory
  inventory: Item[];
  
  // Abilities/Traits
  traits: Trait[];
  abilities: Ability[];
  
  // Status
  statusEffects: StatusEffect[];
}

interface HeroClass {
  name: string; // "Warrior", "Mage", "Rogue", "Cleric", "Ranger", "Paladin", "Necromancer", "Bard", etc.
  description: string;
  baseStats: Stats;
  startingAbilities: string[];
  icon: string;
}
```

### Hero Classes (8 Total)

1. **Warrior**: Frontline tank with high HP and attack. Excels at absorbing damage and dealing physical damage.
   - Base Stats: High HP, High Attack, Medium Defense, Low Speed, Low Luck
   - Starting Abilities: Power Strike, Defend, Taunt

2. **Mage**: Glass cannon with devastating magical abilities but low survivability.
   - Base Stats: Low HP, Low Attack, High Magic Power, Medium Speed, Medium Luck
   - Starting Abilities: Fireball, Magic Missile, Mana Shield

3. **Rogue**: High-risk, high-reward class focused on speed, crits, and evasion.
   - Base Stats: Medium HP, Medium Attack, Low Defense, High Speed, High Luck
   - Starting Abilities: Backstab, Dodge, Poison Blade

4. **Cleric**: Primary healer and support with defensive capabilities.
   - Base Stats: Medium HP, Low Attack, Medium Defense, Low Speed, Medium Luck
   - Starting Abilities: Heal, Bless, Holy Light

5. **Ranger**: Balanced physical damage dealer with mobility and utility.
   - Base Stats: Medium HP, Medium-High Attack, Medium Defense, High Speed, High Luck
   - Starting Abilities: Aimed Shot, Quick Shot, Track

6. **Paladin**: Holy warrior combining durability with healing and support.
   - Base Stats: High HP, Medium Attack, High Defense, Low Speed, Medium Luck
   - Starting Abilities: Smite, Lay on Hands, Divine Shield

7. **Necromancer**: Dark mage specializing in summoning undead, debuffs, and damage over time.
   - Base Stats: Low HP, Medium Attack, Low Defense, Medium Speed, Low Luck
   - Starting Abilities: Summon Skeleton, Curse, Drain Life
   - Special: Summoned minions fight alongside the party

8. **Bard**: Versatile support class that buffs allies and weakens enemies.
   - Base Stats: Medium HP, Low Attack, Low Defense, High Speed, High Luck
   - Starting Abilities: Inspire, Song of Rest, Discordant Note

### Additional Classes (Stretch Goal - 12 More)

9. **Artificer**: Inventor and crafter who creates mechanical constructs and enhances items.
   - Base Stats: Medium HP, Low Attack, Medium Defense, Medium Speed, High Luck
   - Starting Abilities: Deploy Turret, Repair, Alchemical Bomb
   - Special: Can modify and enhance equipment, summon mechanical constructs

10. **Sorcerer**: Wild magic caster with unpredictable but powerful spells.
    - Base Stats: Low HP, Very High Magic Power, Low Defense, High Speed, Very High Luck
    - Starting Abilities: Chaos Bolt, Wild Surge, Spell Flux
    - Special: All spells have chance for wild magic surge (random bonus or penalty)

11. **Berserker**: Raging warrior that grows stronger as HP decreases..
    - Base Stats: High HP, Very High Attack, Low Defense, Medium Speed, Low Luck
    - Starting Abilities: Rage, Reckless Attack, Bloodlust
    - Special: Gains attack bonus when below 50% HP

11. **Druid**: Nature magic user with shapeshifting abilities.
    - Base Stats: Medium HP, Medium Attack, Medium Defense, Medium Speed, High Luck
    - Starting Abilities: Wild Shape, Thorn Whip, Nature's Blessing
    - Special: Can transform for different stat boosts

12. **Monk**: Martial artist relying on speed, precision, and inner energy.
    - Base Stats: Medium HP, Medium Attack, Low Defense, Very High Speed, Medium Luck
    - Starting Abilities: Flurry of Blows, Deflect, Ki Strike
    - Special: Counterattack chance on dodged attacks

13. **Warlock**: Dark pact magic with powerful but risky abilities.
    - Base Stats: Low HP, High Attack, Low Defense, Medium Speed, High Luck
    - Starting Abilities: Eldritch Blast, Dark Pact, Life Sacrifice
    - Special: Can sacrifice HP for powerful effects

14. **Assassin**: Stealth-focused killer with execution mechanics.
    - Base Stats: Low HP, High Attack, Low Defense, Very High Speed, Very High Luck
    - Starting Abilities: Assassinate, Vanish, Shadow Step
    - Special: Bonus damage against low-HP targets

15. **Shaman**: Elemental caster who buffs through totems.
    - Base Stats: Medium HP, Medium Attack, Medium Defense, Low Speed, High Luck
    - Starting Abilities: Lightning Bolt, Totem of Strength, Chain Heal
    - Special: Totems provide persistent area buffs

16. **Knight**: Ultimate defensive class with shield mastery.
    - Base Stats: Very High HP, Medium Attack, Very High Defense, Low Speed, Low Luck
    - Starting Abilities: Shield Bash, Fortify, Protect Ally
    - Special: Can redirect damage from allies to self

17. **Witch**: Chaos magic user with unpredictable effects.
    - Base Stats: Low HP, Medium Attack, Low Defense, High Speed, Very High Luck
    - Starting Abilities: Hex, Brew Potion, Wild Magic
    - Special: Abilities have random bonus effects

18. **Berserker**: Primal fury warrior specializing in dual-wielding.
    - Base Stats: Very High HP, High Attack, Medium Defense, Medium Speed, Low Luck
    - Starting Abilities: Dual Strike, Primal Roar, Savage Charge
    - Special: Gains bonus damage when wearing light/no armor

19. **Alchemist**: Master of potions, transmutation, and explosive chemistry.
    - Base Stats: Medium HP, Medium Attack, Low Defense, High Speed, High Luck
    - Starting Abilities: Throw Flask, Transmute, Brew Potion
    - Special: Can craft consumables during dungeon runs

### Features
- Create and customize 1-4 heroes for your party
- Choose from 8 unique classes with distinct stats and abilities (20 total with stretch goals)
- Customize names, icons, and colors
- Manage equipment and inventory per hero
- Track health, experience, and progression

---

## 2. Dungeon Generation System

### Dungeon Structure
```typescript
interface Dungeon {
  id: string;
  name: string;
  difficulty: number;
  currentDepth: number;
  maxDepth: number;
  seed?: string; // Optional for reproducible dungeons
  
  // Current state
  visitedEvents: string[];
  currentEvent: DungeonEvent | null;
  
  // Rewards & Progress
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
  
  // Optional combat encounter
  encounter?: CombatEncounter;
  
  // Event modifiers
  tags: string[]; // "dangerous", "treasure", "rest", "mysterious"
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
  
  // Requirements
  requires?: {
    stat?: { hero: string; stat: keyof Stats; min: number };
    item?: string;
    trait?: string;
  };
  
  // Outcomes
  outcomes: EventOutcome[];
  successChance?: number; // 0-100, if random
}

interface EventOutcome {
  type: "damage" | "heal" | "loot" | "combat" | "continue" | "status" | "nothing";
  
  // Outcome data
  damage?: { target: "random" | "all" | "choice"; amount: number };
  heal?: { target: "random" | "all" | "choice"; amount: number };
  loot?: Item[];
  combat?: CombatEncounter;
  status?: { effect: StatusEffect; target: string };
  
  text: string; // Result description
}
```

### Generation Algorithm
1. **Depth-Based Difficulty**: Events scale with dungeon depth
2. **Event Pool System**: Random selection from weighted event pools
3. **Rarity System**: Common, uncommon, rare, legendary events
4. **Guarantee System**: Ensure rest points, merchants at intervals
5. **Boss Events**: Every 10 floors or at specified checkpoints

### Event Variety (Initial Set)
- **Combat Events** (40%): Fight monsters
- **Treasure Events** (20%): Find loot, chests, hidden caches
- **Choice Events** (20%): Moral/strategic decisions with consequences
- **Rest Events** (10%): Heal party, manage resources
- **Merchant Events** (5%): Buy/sell items
- **Trap Events** (5%): Avoid or trigger environmental hazards

---

## 3. Event System

### Event Resolution Flow
```
1. Display Event → 2. Show Choices → 3. Player Selects → 4. Calculate Outcome → 5. Apply Results → 6. Next Event
```

### Event Templates
Each event type has multiple templates with variations:

**Example: Treasure Event**
```typescript
{
  type: "treasure",
  title: "Glittering Cache",
  description: "You discover a chest hidden in the shadows. It appears locked.",
  icon: "treasure-chest",
  choices: [
    {
      text: "Force it open (STR check)",
      requires: { stat: { stat: "attack", min: 10 } },
      outcomes: [
        { type: "loot", loot: [generateRandomItem()], text: "Success! You pry open the chest." },
        { type: "damage", damage: { target: "choice", amount: 5 }, text: "The lock explodes! You take damage." }
      ],
      successChance: 70
    },
    {
      text: "Pick the lock (LUCK check)",
      requires: { stat: { stat: "luck", min: 8 } },
      outcomes: [
        { type: "loot", loot: [generateRandomItem(), generateRandomItem()], text: "You carefully unlock it without triggering traps!" }
      ],
      successChance: 60
    },
    {
      text: "Leave it alone",
      outcomes: [
        { type: "nothing", text: "You continue onward, leaving the chest behind." }
      ]
    }
  ]
}
```

### Dynamic Events
- Events can reference party state (injured heroes, low resources)
- Events can chain (one choice leads to another event)
- Events can have persistent effects (curses, blessings)

---

## 4. Combat System (Stretch Goal)

### Combat Structure
```typescript
interface CombatEncounter {
  id: string;
  enemies: Enemy[];
  environment: string;
  
  // Combat state
  turnOrder: Combatant[];
  currentTurn: number;
  round: number;
  
  // Special events
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

interface CombatEvent {
  trigger: "round" | "health" | "death" | "random";
  condition: any; // Round 3, enemy <50% HP, etc.
  
  title: string;
  description: string;
  
  effects: EventOutcome[];
}

type ActionType = "attack" | "defend" | "ability" | "item" | "pass";

interface CombatAction {
  actor: string; // Hero or Enemy ID
  type: ActionType;
  target?: string;
  ability?: Ability;
  item?: Item;
}
```

### Combat Flow
1. **Initiative**: Determine turn order based on speed stat
2. **Turn-Based**: Each combatant acts in order
3. **Player Actions**: Attack, use ability, use item, defend, pass
4. **Enemy AI**: Simple behavior patterns (aggressive, defensive, support)
5. **Combat Events**: Random mid-combat events for variety
6. **Victory/Defeat**: Distribute rewards or handle game over

### Combat Events (Stretch Goal)
During combat, random events can occur:
- **Environmental**: "The ceiling begins to crumble!" - AOE damage
- **Reinforcements**: "More enemies appear!"
- **Opportunity**: "You spot a weakness!" - Bonus to next attack
- **Hazard**: "A trap activates!" - Status effect on random target

---

## 5. Inventory & Equipment System

### Item Structure
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  type: ItemType;
  
  // Core rarities (MVP)
  rarity: 
    | "junk"       // 0★ - Worthless, vendor trash
    | "common"     // 1★ - Basic items
    | "uncommon"   // 2★ - Slightly better
    | "rare"       // 3★ - Good items
    | "epic"       // 4★ - Powerful items
    | "legendary"  // 5★ - Very rare, powerful
    | "mythic";    // 6★ - Extremely rare, best in slot
  
  // Stretch goal rarities
  // | "artifact"   // 7★ - Unique named items, one per game
  // | "cursed"     // Special - Powerful but with drawbacks
  // | "set"        // Special - Part of a set with bonuses
  
  // Equipment stats
  stats?: Partial<Stats>;
  
  // Consumable effects
  effects?: ItemEffect[];
  
  // Metadata
  value: number; // Gold value
  stackable: boolean;
  quantity?: number;
}

// Core item types (MVP)
type ItemType = 
  | "weapon"      // Swords, axes, staffs, bows, daggers
  | "armor"       // Chest armor, robes, leather
  | "helmet"      // Head protection
  | "boots"       // Footwear
  | "accessory"   // Rings, amulets, trinkets
  | "consumable"  // Potions, scrolls, food
  | "quest"       // Quest items
  | "material";   // Crafting materials

// Stretch goal item types
type AdvancedItemType = ItemType
  | "offhand"     // Shields, tomes, daggers (dual-wield)
  | "belt"        // Utility belts, potion holders
  | "cloak"       // Cloaks, capes
  | "gloves";     // Gauntlets, gloves

interface ItemEffect {
  type: "heal" | "damage" | "buff" | "debuff" | "revive";
  value: number;
  duration?: number; // For buffs/debuffs
  stat?: keyof Stats;
}

// Stretch goal: Cursed items
interface CursedItem extends Item {
  rarity: "cursed";
  curse: {
    description: string;
    effect: ItemEffect; // Negative effect
  };
  canBePurified: boolean;
}

// Stretch goal: Set items
interface SetItem extends Item {
  rarity: "set";
  setName: string;
  setBonus: {
    pieces: number;      // Required pieces for bonus
    bonus: Partial<Stats> | Ability;
    description: string;
  }[];
}
```

### Loot Generation

**Core Rarity Weights (MVP):**
- **Junk** (15%): Vendor trash, minimal value - "Rusty Sword", "Torn Cloth"
- **Common** (40%): Basic usable items - "Iron Sword", "Leather Armor"
- **Uncommon** (25%): Decent items with small bonuses - "Steel Sword", "Reinforced Armor"
- **Rare** (12%): Good items with notable bonuses - "Enchanted Blade", "Mage Robes"
- **Epic** (5%): Powerful items with special effects - "Flaming Sword", "Dragon Scale Armor"
- **Legendary** (2.5%): Very rare, powerful items - "Sword of Heroes", "Celestial Plate"
- **Mythic** (0.5%): Extremely rare, best items - "Godslayer", "Armor of Eternity"

**Stretch Goal Rarities:**
- **Artifact** (0.1%): Unique named items, only one exists per playthrough
  - Examples: "Excalibur", "The One Ring", "Mjolnir"
  - Cannot be found multiple times
  - Guaranteed at specific boss defeats or depths

- **Cursed** (Special): Powerful but with significant drawbacks
  - Examples: "Blade of Madness" (+50 ATK, -20 HP per turn)
  - Can be purified through special events
  - Risk/reward gameplay

- **Set Items** (Special): Part of themed equipment sets
  - Examples: "Dragon Knight Set", "Shadow Assassin Set"
  - 2-piece: Small bonus
  - 4-piece: Medium bonus
  - 6-piece: Large bonus + special ability

**Generation Rules:**
- **Depth Scaling**: Better loot at deeper floors
- **Class-Appropriate**: Weight items toward party composition
- **Random Properties**: Procedurally generated modifiers

### Equipment System

**Core Slots (MVP - 6 total):**
1. **Weapon**: Primary damage source (swords, axes, staffs, bows, daggers)
   - Stats: +Attack, +Magic Power, special effects
   - Examples: Iron Sword (+5 ATK), Fire Staff (+8 Magic, burn chance)

2. **Armor**: Body protection (plate, leather, robes)
   - Stats: +Defense, +HP
   - Class-specific: Heavy (Warrior), Medium (Ranger), Light (Mage)
   - Examples: Steel Plate (+12 DEF), Leather Vest (+5 DEF, +2 SPD)

3. **Helmet**: Head protection
   - Stats: +Defense, +HP, resistance
   - Examples: Iron Helm (+3 DEF, +10 HP), Wizard Hat (+5 Magic)

4. **Boots**: Footwear
   - Stats: +Speed, +Evasion
   - Examples: Leather Boots (+2 SPD), Boots of Haste (+5 SPD)

5. **Accessory Slot 1**: First trinket slot
   - Stats: Various bonuses
   - Examples: Lucky Charm (+3 LUCK), Ring of Strength (+3 ATK)

6. **Accessory Slot 2**: Second trinket slot
   - Allows for build variety with multiple trinkets
   - Examples: Amulet of Health (+20 HP), Ring of Protection (+2 DEF)

**Stretch Goal Slots (4 additional):**
7. **Offhand**: Secondary weapon or shield
   - Shield: +Defense, +Block chance
   - Tome: +Magic Power for casters
   - Second Weapon: Dual-wield for rogues/warriors
   - Examples: Wooden Shield (+5 DEF, 10% block), Spellbook (+6 Magic)

8. **Belt**: Utility and quick-use items
   - Potion slots, utility bonuses
   - Examples: Adventurer's Belt (+2 inventory slots), Potion Belt (auto-use)

9. **Cloak**: Movement and stealth
   - Stats: +Speed, +Evasion, special abilities
   - Examples: Shadow Cloak (+evasion, stealth bonus), Cape of Flight (+3 SPD)

10. **Gloves**: Attack speed and precision
    - Stats: +Attack Speed, +Crit Chance, +Luck
    - Examples: Gauntlets of Power (+4 ATK), Nimble Gloves (+crit)

**System Features:**
- Equipping items modifies base stats in real-time
- Visual feedback showing stat changes (green +, red -)
- Compare items before equipping
- Drag-and-drop interface
- Set bonuses (stretch goal): Wearing matching sets grants extra bonuses

---

## 6. Progression System

### Experience & Leveling
```typescript
interface LevelSystem {
  level: number;
  currentXP: number;
  xpToNextLevel: number; // Formula: level * 100
  
  // Rewards per level
  statPoints: number; // Distribute manually
  abilityPoints: number; // Unlock new abilities
}
```

### Progression Features
- Gain XP from combat and event successes
- Level up increases base stats
- Unlock new abilities at milestones
- Permanent upgrades (meta-progression - future feature)

### Traits System
```typescript
interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Effects
  statModifiers?: Partial<Stats>;
  eventModifiers?: { eventType: string; bonus: number };
  
  // Special abilities
  special?: {
    type: "reroll" | "extra_loot" | "avoid_trap" | "discount";
    value: number;
  };
}
```

Examples:
- **Lucky**: +2 Luck, 10% bonus to loot rarity
- **Tank**: +5 Defense, -1 Speed
- **Greedy**: Start with extra gold, merchants cost more
- **Cautious**: Reveal trap events before triggering

---

## UI/UX Design (Chakra UI v2)

### Screen Layout

#### 1. Main Menu
- **Start New Run**
- **Party Setup**
- **Settings**
- **Quit**

#### 2. Party Setup Screen
- Grid of hero cards
- Add/Remove heroes (1-4)
- Click to customize: Name, Class, Icon, Color
- Class selection with stat preview
- Confirm and start

#### 3. Dungeon Run Screen
```
┌─────────────────────────────────────────┐
│  Party Status Bar (Top)                 │
│  [Hero1 HP] [Hero2 HP] [Hero3 HP]       │
│  Floor: 5    Gold: 250                  │
├─────────────────────────────────────────┤
│                                         │
│        Event Card (Center)              │
│                                         │
│   ┌─────────────────────────────┐      │
│   │  [Icon]  Event Title        │      │
│   │                             │      │
│   │  Description text...        │      │
│   │                             │      │
│   │  ┌─────────┐ ┌─────────┐   │      │
│   │  │Choice 1 │ │Choice 2 │   │      │
│   │  └─────────┘ └─────────┘   │      │
│   └─────────────────────────────┘      │
│                                         │
├─────────────────────────────────────────┤
│  Action Buttons (Bottom)                │
│  [Inventory] [Party] [Map] [Settings]   │
└─────────────────────────────────────────┘
```

#### 4. Combat Screen (Stretch)
```
┌─────────────────────────────────────────┐
│  Combat Status                          │
│  Round: 3                               │
├─────────────────────────────────────────┤
│  Enemies (Top)                          │
│  [Enemy1 HP] [Enemy2 HP]                │
├─────────────────────────────────────────┤
│  Combat Log (Middle)                    │
│  - Hero attacks Enemy for 15 damage     │
│  - Enemy casts fireball!                │
├─────────────────────────────────────────┤
│  Heroes (Bottom)                        │
│  [Hero1 HP] [Hero2 HP]                  │
│  [Attack][Ability][Item][Defend]        │
└─────────────────────────────────────────┘
```

#### 5. Inventory Screen
- Tabbed interface: All Items / Weapons / Armor / Consumables
- Grid or list view
- Filter and sort options
- Drag-and-drop equipping
- Item tooltips with stats

#### 6. Results Screen
- Run summary: Floors cleared, enemies defeated, treasure found
- Final party state
- Total XP gained
- Option to return to main menu

### Chakra UI Components Used
- **Card, CardHeader, CardBody**: Event cards, hero cards
- **Button, IconButton**: Actions, choices
- **Progress**: Health bars, XP bars
- **Badge**: Rarity indicators, status effects
- **Modal**: Item details, ability descriptions
- **Tooltip**: Hover information
- **Grid, Stack, Flex**: Layouts
- **Text, Heading**: Typography
- **useToast**: Notifications for loot, level ups
- **useDisclosure**: Modals and drawers

### Theme & Styling
- **Dark Theme**: Dungeon atmosphere
- **Color Palette**:
  - Primary: Purple/Blue for UI
  - Success: Green for heals, bonuses
  - Danger: Red for damage, warnings
  - Warning: Yellow/Orange for caution
  - Rarity Colors (MVP):
    - Junk: Dark Gray (#4A4A4A)
    - Common: Light Gray (#9E9E9E)
    - Uncommon: Green (#4CAF50)
    - Rare: Blue (#2196F3)
    - Epic: Purple (#9C27B0)
    - Legendary: Orange (#FF9800)
    - Mythic: Red/Pink (#E91E63)
  - Rarity Colors (Stretch):
    - Artifact: Gold (#FFD700) with glow effect
    - Cursed: Dark Purple (#4A148C) with red glow
    - Set: Cyan (#00BCD4) with indicator
- **Icons**: react-icons/gi for all game elements
- **Animations**: Smooth transitions, combat effects, loot reveals

---

## Data Models & State Management

### Global State (Zustand/Redux)
```typescript
interface GameState {
  // Game session
  gameActive: boolean;
  isPaused: boolean;
  
  // Party
  party: Hero[];
  gold: number;
  
  // Dungeon
  dungeon: Dungeon;
  
  // UI
  currentScreen: Screen;
  selectedHero: string | null;
  
  // Settings
  settings: GameSettings;
}

interface GameSettings {
  volume: number;
  sfxVolume: number;
  animationSpeed: "slow" | "normal" | "fast";
  autoSave: boolean;
}
```

### Actions
- `createParty(heroes: Hero[])`
- `startDungeon(difficulty: number)`
- `resolveEvent(choice: EventChoice)`
- `equipItem(heroId: string, item: Item, slot: string)`
- `useItem(heroId: string, itemId: string)`
- `progressDungeon()`
- `endRun()`

---

## File Structure

```
drunner/
├── electron/                    # Optional Electron wrapper
│   ├── main.ts                 # Electron main process
│   └── preload.ts              # Electron preload script
├── src/                         # React web app
│   │   ├── common/              # Reusable components
│   │   │   ├── HeroCard.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── HealthBar.tsx
│   │   │   └── StatDisplay.tsx
│   │   ├── party/
│   │   │   ├── PartySetup.tsx
│   │   │   ├── HeroCreator.tsx
│   │   │   └── ClassSelector.tsx
│   │   ├── dungeon/
│   │   │   ├── DungeonView.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventChoice.tsx
│   │   │   └── PartyStatus.tsx
│   │   ├── combat/              # Stretch goal
│   │   │   ├── CombatView.tsx
│   │   │   ├── CombatantCard.tsx
│   │   │   └── ActionBar.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryView.tsx
│   │   │   ├── ItemSlot.tsx
│   │   │   └── EquipmentPanel.tsx
│   │   └── layout/
│   │       ├── MainMenu.tsx
│   │       ├── GameLayout.tsx
│   │       └── ResultsScreen.tsx
│   ├── data/
│   │   ├── classes.ts           # Hero class definitions
│   │   ├── events.ts            # Event templates
│   │   ├── items.ts             # Item templates
│   │   ├── enemies.ts           # Enemy templates
│   │   ├── abilities.ts         # Ability definitions
│   │   └── traits.ts            # Trait definitions
│   ├── engine/
│   │   ├── dungeonGenerator.ts
│   │   ├── eventResolver.ts
│   │   ├── combatEngine.ts      # Stretch goal
│   │   ├── lootGenerator.ts
│   │   └── progressionSystem.ts
│   ├── store/
│   │   ├── gameStore.ts         # Zustand store
│   │   └── selectors.ts
│   ├── types/
│   │   ├── hero.ts
│   │   ├── dungeon.ts
│   │   ├── event.ts
│   │   ├── combat.ts
│   │   ├── item.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── random.ts            # RNG utilities
│   │   ├── calculations.ts      # Damage, stat calculations
│   │   ├── storage.ts           # LocalStorage wrapper
│   │   └── formatters.ts        # Display helpers
│   ├── theme/
│   │   └── theme.ts             # Chakra UI theme
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── assets/
│   ├── icons/                   # Game-icons integration
│   └── sounds/                  # Future: sound effects
├── electron-builder.json        # Electron packaging config
├── package.json
├── tsconfig.json
├── vite.config.ts               # Vite for React
└── README.md
```

---

## Development Phases

### Phase 1: Core Foundation (MVP)
- [ ] Project setup: Electron + React + TypeScript + Chakra UI
- [ ] Basic UI: Main menu, party setup, dungeon view
- [ ] Hero creation and customization
- [ ] Basic state management with Zustand
- [ ] Game-icons integration

### Phase 2: Event System
- [ ] Dungeon generation algorithm
- [ ] Event templates (5-10 initial events per type)
- [ ] Event resolution system
- [ ] Choice mechanics with requirements
- [ ] Outcome application (damage, heal, loot)

### Phase 3: Items & Progression
- [ ] Item system: weapons, armor, accessories, consumables
- [ ] Loot generation with rarity
- [ ] Equipment system
- [ ] Inventory UI
- [ ] Basic XP and leveling

### Phase 4: Polish & Content
- [ ] Additional events (30+ total)
- [ ] More item variety (50+ items)
- [ ] Boss events
- [ ] Merchant system
- [ ] Save/load system (LocalStorage or file-based)
- [ ] Results screen with statistics
- [ ] Animations and visual polish

### Phase 5: Combat System (Stretch Goal)
- [ ] Combat engine
- [ ] Turn-based combat UI
- [ ] Enemy AI
- [ ] Abilities system
- [ ] Combat events
- [ ] Balance and testing

### Phase 6: Advanced Features (Future)
- [ ] Meta-progression (permanent upgrades)
- [ ] Multiple dungeon themes
- [ ] Achievements
- [ ] Leaderboards
- [ ] Custom dungeon seeds
- [ ] Mod support

---

## Technical Considerations

### Deployment Options

**Web Application (Primary)**
- Host on static hosting (Vercel, Netlify, GitHub Pages)
- Use LocalStorage for save data
- Service worker for offline play (PWA)
- No installation required

**Electron Desktop (Optional)**
- Wrap the web app with minimal Electron shell
- Use `electron-builder` for packaging
- File system access for advanced save features
- Native desktop integration (menus, notifications)
- Consider code signing for distribution

### Performance
- Lazy load event templates
- Memoize components with React.memo
- Virtualize long lists (inventory)
- Optimize re-renders with proper state management

### Accessibility
- Chakra UI provides good defaults
- Keyboard navigation for all choices
- Screen reader support
- High contrast mode

### Testing
- Unit tests for game logic (dungeon generation, combat calculations)
- Component tests with React Testing Library
- E2E tests with Playwright for critical flows

### Save System
- **Web**: LocalStorage for persistent saves
- **Web**: IndexedDB for larger save data (optional)
- **Electron**: File system for advanced features
- Auto-save after each event
- Export/import save files as JSON
- Versioning for save compatibility
- Cloud sync support (future feature)

---

## Content Design Guidelines

### Writing Events
- Keep descriptions concise but flavorful (2-3 sentences)
- Choices should be clear and meaningful
- Outcomes should feel fair (clear risk/reward)
- Vary difficulty and tone

### Balancing
- Hero stats: Scale linearly with level
- Item power: Rarity determines stat bonuses
- Event difficulty: Match to dungeon depth
- Economy: Gold should feel valuable but not scarce

### Theming
- Classic fantasy dungeon aesthetic
- Dark, atmospheric, with moments of humor
- Variety in encounters (not just combat)

---

## Future Expansion Ideas

1. **Additional Classes**: 12 more classes (Artificer, Sorcerer, Barbarian, Druid, Monk, Warlock, Assassin, Shaman, Knight, Witch, Berserker, Alchemist) beyond the core 8
2. **Multiple Dungeons**: Different themes (crypt, forest, volcano)
3. **Daily Challenges**: Special modifiers, leaderboards
3. **Endless Mode**: See how deep you can go
4. **Ironman Mode**: Permadeath, no saves
5. **Co-op**: Share party with others (async or real-time)
6. **Workshop**: Community-created events and items
7. **Narrative Campaign**: Linked dungeons with story
8. **New Classes**: Expand beyond initial 4
9. **Crafting System**: Combine materials into items
10. **Pet/Companion System**: Additional party member

---

## Success Metrics

### Core Gameplay Loop
- Players should complete a basic run in 20-30 minutes
- Each event should take 30-60 seconds to resolve
- Meaningful choices in 70%+ of events
- Smooth progression with clear feedback

### Engagement
- Multiple playthroughs with different strategies
- Party composition matters
- Items and upgrades feel impactful
- Events remain interesting on repeat runs

---

## Conclusion

**Dungeon Runner** combines strategic party management, procedural generation, and meaningful choice-driven gameplay in a polished Electron desktop experience. By focusing on event variety and player agency, each run will feel unique while maintaining a tight, replayable core loop. The turn-based combat system serves as an excellent stretch goal to add depth without compromising the core event-based design.

The use of modern technologies (React, TypeScript, Chakra UI) ensures maintainable, type-safe code, while game-icons provides rich visual feedback. The modular architecture allows for easy expansion with new events, items, and systems.

---

## Next Steps

1. Set up development environment
2. Create project scaffolding
3. Implement core type definitions
4. Build basic UI layouts
5. Develop dungeon generation prototype
6. Test and iterate on core loop
