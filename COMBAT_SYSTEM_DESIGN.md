# Combat System Design - Turn-Based Boss Battles

## Overview
A turn-based combat system focused on boss encounters where depth (turns) increases during combat, creating dynamic difficulty scaling within a single battle.

## Core Concepts

### 1. Boss Base Stats
Instead of manually defining stats for each boss, we use default base stat templates based on boss tier:

```typescript
bossStats: {
  // Regular floor bosses (every floor)
  floorBoss: {
    baseHp: 200,
    baseAttack: 30,
    baseDefense: 10,
    baseSpeed: 15,
    baseLuck: 10,
  },
  
  // Zone bosses (every 10 floors)
  zoneBoss: {
    baseHp: 500,
    baseAttack: 50,
    baseDefense: 20,
    baseSpeed: 20,
    baseLuck: 15,
  },
  
  // Final boss (floor 100)
  finalBoss: {
    baseHp: 2000,
    baseAttack: 100,
    baseDefense: 40,
    baseSpeed: 30,
    baseLuck: 25,
  },
},
```

**Boss Stat Overrides:**
Individual bosses can define custom base stats to override the tier defaults:

```typescript
export const UNIQUE_BOSS: DungeonEvent = {
  id: 'unique-dragon-boss',
  type: 'boss',
  title: 'Ancient Dragon',
  
  // Override tier defaults with custom stats
  customBaseStats: {
    baseHp: 1500,    // More HP than zone boss default
    baseAttack: 80,
    baseDefense: 35,
    baseSpeed: 40,   // Much faster!
    baseLuck: 20,
  },
  
  // ... rest of boss definition
}
```

This allows unique/special bosses to have distinct stat profiles while most bosses use the convenient tier defaults.

### 2. Unified Danger Scaling System
The game tracks three types of progression that all contribute to overall danger:
- **dungeon.floor**: Current floor (1-100) - PRIMARY scaling factor (most impact)
- **dungeon.depth**: Total events completed - SECONDARY scaling factor (gradual increase)
- **combatDepth**: Turns in current combat (temporary, resets each battle) - TERTIARY scaling factor (tension in long fights)

#### Effective Danger Level
All enemies/bosses scale based on a unified danger calculation:

```typescript
effectiveDanger = floor + (depth * depthWeight) + (combatDepth * combatDepthWeight)
```

Where weights control the relative impact:
```typescript
dangerWeights: {
  floor: 1.0,        // Floors contribute 1:1 (floor 10 = +10 danger)
  depth: 0.05,       // Depth contributes minimally (100 events = +5 danger)
  combatDepth: 0.05, // Combat turns contribute moderately (100 turns = +5 danger)
}
```

#### Example Danger Levels
- **Floor 1, 0 events, Turn 0**: `1 + 0*0.05 + 0*0.05 = 1.0`
- **Floor 1, 0 events, Turn 10**: `1 + 0*0.05 + 10*0.05 = 1.5` (long fight = +50% danger!)
- **Floor 10, 50 events, Turn 0**: `10 + 50*0.05 + 0*0.05 = 12.5`
- **Floor 10, 50 events, Turn 10**: `10 + 50*0.05 + 10*0.05 = 13.0` (turn impact reduced)
- **Floor 50, 300 events, Turn 0**: `50 + 300*0.05 + 0*0.05 = 65.0`
- **Floor 50, 300 events, Turn 20**: `50 + 300*0.05 + 20*0.05 = 66.0` (turns barely matter)

This creates natural tension curves:
- **Early floors**: Combat depth matters A LOT (clutch turn-by-turn gameplay)
- **Mid floors**: Depth and combat both contribute meaningfully
- **Late floors**: Floor dominates, but combat still adds pressure

### 3. Boss Scaling Formula

Bosses scale their stats based on effective danger:

```typescript
scaledStat = baseStat * (1 + (effectiveDanger - 1) * scalingFactor)
```

This means danger level 1 (floor 1, no events, no turns) uses base stats with no scaling.

With separate scaling factors for each stat:

```typescript
bossScaling: {
  // Stats locked at combat start (calculated once with combatDepth=0)
  hp: 0.15,        // 15% HP per danger point (max HP fixed at start)
  
  // Stats that scale dynamically during combat (recalculated each turn)
  attack: 0.12,    // 12% attack per danger point (gets stronger each turn)
  defense: 0.10,   // 10% defense per danger point (gets tankier each turn)
  speed: 0.08,     // 8% speed per danger point (gets faster each turn)
  luck: 0.05,      // 5% luck per danger point (gets luckier each turn)
},
```

This creates escalating pressure - the boss starts with fixed HP but becomes more dangerous as combat drags on.

#### Example Calculations

**Floor Boss - Floor 5, 20 events, Turn 0 (Battle Start)**
- Danger: `5 + (20 × depthWeight) + (0 × combatDepthWeight) = 5 + 1.0 + 0.0 = 6.0`
- HP: `200 × (1 + (6.0-1) × hpScaling) = 200 × (1 + 5×0.15) = 200 × 1.75 = 350`
- Attack: `30 × (1 + (6.0-1) × attackScaling) = 30 × (1 + 5×0.12) = 30 × 1.60 = 48`

**Floor Boss - Floor 5, 20 events, Turn 10**
- Danger: `5 + (20 × 0.05) + (10 × 0.05) = 5 + 1.0 + 0.5 = 6.5`
- HP: `200 × (1 + (6.5-1) × 0.15) = 200 × (1 + 5.5×0.15) = 200 × 1.825 = 365` (+15 HP from 10 turns!)
- Attack: `30 × (1 + (6.5-1) × 0.12) = 30 × (1 + 5.5×0.12) = 30 × 1.66 = 49.8` (+1.8 damage from 10 turns!)

**Zone Boss - Floor 50, 300 events, Turn 0**
- Danger: `50 + (300 × 0.05) + (0 × 0.05) = 50 + 15.0 + 0.0 = 65.0`
- HP: `500 × (1 + (65.0-1) × 0.15) = 500 × (1 + 64×0.15) = 500 × 10.60 = 5,300`
- Attack: `50 × (1 + (65.0-1) × 0.12) = 50 × (1 + 64×0.12) = 50 × 8.68 = 434`

**Zone Boss - Floor 50, 300 events, Turn 20**
- Danger: `50 + (300 × 0.05) + (20 × 0.05) = 50 + 15.0 + 1.0 = 66.0`
- HP: `500 × (1 + (66.0-1) × 0.15) = 500 × (1 + 65×0.15) = 500 × 10.75 = 5,375` (+75 HP from 20 turns)
- Attack: `50 × (1 + (66.0-1) × 0.12) = 50 × (1 + 65×0.12) = 50 × 8.80 = 440` (+6 damage from 20 turns)

Notice: Early game turns add massive percentages, late game they add smaller absolute amounts but still matter!

### 4. Multi-Turn Combat Event System

#### Event Structure Changes
Boss events gain a new `combatState` to track multi-turn battles:

```typescript
interface BossCombatState {
  currentHp: number        // Boss's current HP
  maxHp: number           // Boss's max HP (locked at combat start)
  baseStats: {            // Base stats for recalculation
    attack: number
    defense: number
    speed: number
    luck: number
  }
  abilities: BossAbility[] // Boss's available abilities
  attackPatterns: BossAttackPattern[] // Boss's basic attack options
  phases?: BossPhase[]    // Optional phase transitions at HP thresholds
  currentPhase: number    // Current boss phase (starts at 1)
  combatChoices: EventChoice[] // Custom combat actions for this boss (optional)
  healPerTurn?: number    // Optional passive healing per turn (for regenerating bosses)
  combatDepth: number     // Rounds completed (increments after all combatants act)
  floor: number           // Floor when combat started (for danger calc)
  depth: number           // Total depth when combat started (for danger calc)
  itemCooldowns: Map<string, number>    // Track item cooldowns during combat
  abilityCooldowns: Map<string, number> // Track ability cooldowns during combat
  activeEffects: CombatEffect[]         // Active buffs/debuffs with durations
  turnOrder: Combatant[]  // Current turn order sorted by speed
  currentTurnIndex: number // Index of current actor in turn order
}

interface CombatEffect {
  id: string
  type: 'buff' | 'debuff' | 'status'
  name: string            // Display name (e.g., "Poison", "Stunned", "Burning")
  stat?: 'attack' | 'defense' | 'speed' | 'luck' | 'hp' // For buff/debuff only
  value?: number          // Modifier value (for buffs/debuffs)
  duration: number        // Rounds remaining (999 = permanent/until combat ends)
  target: 'self' | 'all' | 'boss' | string // Target identifier
  behavior?: EffectBehavior // For status effects (custom logic)
}

interface EffectBehavior {
  type: 'skipTurn' | 'damagePerTurn' | 'healPerTurn' | 'custom'
  onTurnStart?: (combatant: Combatant, state: BossCombatState) => void
  onTurnEnd?: (combatant: Combatant, state: BossCombatState) => void
  onRoundEnd?: (combatant: Combatant, state: BossCombatState) => void
  damageAmount?: number   // For damagePerTurn (true damage, ignores defense)
  healAmount?: number     // For healPerTurn
  skipTurns?: boolean     // For skipTurn (prevents action)
}

interface Combatant {
  id: string              // Hero ID or 'boss'
  type: 'hero' | 'boss'
  speed: number           // Current speed stat (for turn order)
  isAlive: boolean        // Dead combatants skip turns
}

interface BossAbility {
  id: string
  name: string
  description: string
  cooldown: number         // Turns between uses
  lastUsed: number        // Turn number when last used (-cooldown to allow first turn use)
  trigger: 'onTurnStart' | 'onHpThreshold' | 'onPlayerAction' | 'always' | 'onPhaseChange'
  hpThreshold?: number    // For onHpThreshold triggers (e.g., 0.5 = 50% HP)
  phase?: number          // For onPhaseChange triggers (boss phase number)
  effects: AbilityEffect[]
}

interface BossPhase {
  phase: number           // Phase number (1, 2, 3, etc.)
  hpThreshold: number     // HP percentage to trigger phase (e.g., 0.75 = 75% HP)
  name?: string           // Optional phase name ("Enraged Form", "Final Form")
  description?: string    // Optional phase description
  onEnter?: BossAbility[] // Abilities that trigger when entering this phase
  replaceAbilities?: BossAbility[]  // Replace boss ability set with these
  replaceAttackPatterns?: BossAttackPattern[] // Replace attack patterns
  addAbilities?: BossAbility[]      // Add these abilities to existing set
  addAttackPatterns?: BossAttackPattern[] // Add these patterns
  statModifiers?: {       // Phase-specific stat changes
    attack?: number       // Additive or multiplicative?
    defense?: number
    speed?: number
    luck?: number
  }
  healPerTurn?: number    // Change passive healing in this phase
}

interface BossAttackPattern {
  id: string
  name: string
  weight: number          // Probability weight for random selection
  attackType: 'single' | 'aoe' | 'multi' | 'cleave'
  damageMultiplier: number // Multiplier of boss attack stat
  critChance?: number     // Override crit chance for this attack
  targetCount?: number    // For multi-hit attacks
  aoeDamageReduction?: number // Damage multiplier for AOE (e.g., 0.6 = 60% damage to all)
  description: string
  condition?: (state: BossCombatState, party: Hero[]) => boolean // Optional condition check
}
```

#### Combat Flow

1. **Boss Event Triggered (Opening Move)**
   - Calculate danger with combatDepth=0
   - Lock maxHP based on initial danger (doesn't change during fight)
   - Store base stats and danger factors in `combatState`
   - Calculate initial dynamic stats (attack, defense, speed, luck)
   - Present initial combat choices (defined in boss event)
   - Player selects opening move strategy
   - Opening move resolves (damage to boss, buffs, positioning, etc.)

2. **Turn-Based Combat Loop**
   - **Turn Order**: All combatants (heroes + boss) sorted by **speed stat** (highest first)
   - Each hero gets **one action per turn**
   - Boss gets **one action per turn**
   - Turn order recalculated each round based on current speed (speed buffs/debuffs matter!)
   
3. **Hero Turn (Individual)**
   - Present combat actions:
     - If boss defines **custom combatChoices**: Use those (unique tactics)
     - Otherwise use **default actions**:
       - **Attack**: Basic attack on boss
       - **Defend**: Increase defense for this turn
       - **Use Ability**: Select hero ability to use (tracks cooldowns)
       - **Use Item**: Use consumable from inventory (tracks cooldowns)
       - **Flee**: Escape the dungeon (lose inventory items, keep equipped items and gold)
   - Combat choices support **variance** (random text/descriptions each turn)
   - Player selects action for this hero
   - Hero action resolves immediately
   - **Revive consumables count as 1 full turn action**
   - **Other consumables count as 1/3 turn action** (can use 3 per hero action)
   - **Overflow allowed**: Use consumables + another action in same turn
   - Abilities and items with cooldowns track turns in combat
   
4. **Boss Turn**
   - Occurs in speed-based turn order (may be between heroes or after all heroes)
   - Apply passive healing (if boss has `healPerTurn` defined)
   - Check for boss ability triggers (HP thresholds, turn-based, etc.)
   - Execute triggered abilities (damage, buffs, special effects, healing)
   - Select boss attack pattern (weighted random or conditional)
   - **Target Selection** (for single-target attacks):
     - Boss intelligence scales with danger rating
     - High-danger bosses prioritize healers/support heroes
     - **Frontline heroes guard** backline (Yugioh-style protection)
     - Must defeat/bypass frontline to target backline directly
   - Execute attack based on pattern type:
     - **Single**: Target one hero (see targeting rules), normal/crit damage
     - **AOE**: Hit all heroes with reduced damage
     - **Multi**: Hit multiple random heroes
     - **Cleave**: Hit front heroes (positional)
   - Recalculate dynamic stats (attack, defense, speed, luck) with new danger
   - HP stays same (only current/max HP, max doesn't increase)
   - Decrement item and ability cooldowns
   
5. **Round End**
   - After all combatants have acted (based on speed order), increment `combatDepth`
   - Process buff/debuff durations (decrement by 1)
   - Recalculate turn order for next round
   - Check victory/defeat conditions

6. **Victory/Defeat/Flee/Continue**
   - Boss HP reaches 0 → Victory, give rewards (existing boss rewards), advance floor
   - All heroes dead → Defeat, game over
   - Player flees → Exit dungeon, keep gold and equipped items, lose inventory items
   - Otherwise → Next combatant's turn in speed order

#### Opening Move Choices
Boss events define initial combat choices that let heroes make strategic opening moves:

```typescript
choices: [
  {
    // Supports variance (array of strings for random selection)
    text: [
      'Strike first! Attack before it can act!',
      'Seize the initiative and attack!',
      'Don\'t give it time to prepare - strike now!'
    ],
    outcome: {
      text: [
        'You land a solid opening blow!',
        'Your strike connects!',
        'First blood is yours!'
      ],
      effects: [
        { type: 'bossDamage', value: 50 },
        { type: 'message', text: 'Combat begins!' }
      ]
    }
  },
  {
    text: [
      'Take defensive positions',
      'Form up and brace for impact',
      'Shield wall!'
    ],
    outcome: {
      text: [
        'Your party braces for the coming assault!',
        'You form a defensive line!',
        'Everyone readies their defenses!'
      ],
      effects: [
        { type: 'buff', target: 'all', stat: 'defense', value: 10, duration: 3 },
        { type: 'bossDamage', value: 20 },
        { type: 'message', text: 'Defense increased!' }
      ]
    }
  },
  {
    text: 'Ranger: Aim for weak points',
    requirements: { class: 'Ranger' },
    outcome: {
      text: [
        'You identify vulnerabilities!',
        'Your trained eye spots a weakness!',
        'You find a critical weak point!'
      ],
      effects: [
        { type: 'bossDamage', value: 80 },
        { type: 'debuff', target: 'boss', stat: 'defense', value: -5, duration: 5 },
        { type: 'message', text: 'The boss is vulnerable!' }
      ]
    }
  }
]
```

After the opening move resolves, the turn-based combat loop begins.

#### Combat Phase Choices
Bosses can define **custom combat actions** for the turn-based phase via `combatChoices`:

- If `combatChoices` is defined: Use boss-specific actions (unique tactics per boss)
- If `combatChoices` is omitted: Use default actions (Attack/Defend/Ability/Item)
- All choices support **variance** - array of text strings for random selection each turn
- Prevents repetitive text during long battles

**Variance System:**
```typescript
// Single string (no variance)
text: 'Attack the boss'

// Array of strings (random selection)
text: [
  'Strike at the boss',
  'Attack with your weapon',
  'Launch an assault',
  'Press the attack'
]

// Same for outcomes
outcome: {
  text: [
    'You hit the boss!',
    'Your attack connects!',
    'A solid strike!'
  ]
}
```

### 5. Combat Mechanics

#### Turn Order & Speed System
- **Turn order calculated by speed stat**: Heroes and boss are sorted by speed (highest first)
- Each combatant acts once per round
- Boss may act between heroes, before all heroes, or after all heroes depending on speed
- **Speed ties**: Random resolution (extremely rare, not worth complex tiebreaker)
- **Speed buffs/debuffs affect turn order**: Recalculated each round
- Dead combatants skip their turns
- **Round completes** when all living combatants have acted
- `combatDepth` increments at end of each round

#### Damage Calculation
- **Uses existing damage formula**: Same calculation as current game
- Attack and Defense are **literal values** (not percentages)
- Damage = `Attacker.attack - Defender.defense` (with additional modifiers/formulas from existing system)
- **Critical hits**: Based on luck stat and attack pattern crit chance
- Crit damage multiplier follows existing game formula

#### Buff/Debuff & Status Effect System
- Effects tracked in `activeEffects` array
- **Three effect types**:
  - **Buff**: Positive stat modifier (attack +20, defense +10, etc.)
  - **Debuff**: Negative stat modifier (attack -15, speed -5, etc.)
  - **Status**: Custom behavior effects (poison, stun, burn, etc.)
- **Duration decrements at end of each round** (after all combatants act)
- Duration measured in **rounds**, not individual turns
- Effects process as if they were **depth-based** (combat turns = depth for effect purposes)
- Duration `999` = permanent/lasts until combat ends
- **Effects can stack**: Multiple buffs/debuffs of same type accumulate
- Effects apply to stat calculations immediately
- **Stat boundaries**: Stats cannot go below 0 (debuffs floor at 0)
- **No upper caps**: Buffs can stack indefinitely

**Status Effect Examples:**
```typescript
// Poison: Deals true damage each round
{
  id: 'poison-1',
  type: 'status',
  name: 'Poisoned',
  duration: 5,
  target: 'hero-123',
  behavior: {
    type: 'damagePerTurn',
    damageAmount: 10,  // 10 true damage per round (ignores defense)
    onRoundEnd: (combatant, state) => {
      applyTrueDamage(combatant, 10)
      log(`${combatant.name} takes 10 poison damage!`)
    }
  }
}

// Stun: Skip turns
{
  id: 'stun-1',
  type: 'status',
  name: 'Stunned',
  duration: 2,
  target: 'hero-456',
  behavior: {
    type: 'skipTurn',
    skipTurns: true,
    onTurnStart: (combatant, state) => {
      log(`${combatant.name} is stunned and cannot act!`)
      combatant.skipThisTurn = true
    }
  }
}

// Regeneration: Heal each round
{
  id: 'regen-1',
  type: 'status',
  name: 'Regenerating',
  duration: 999,
  target: 'boss',
  behavior: {
    type: 'healPerTurn',
    healAmount: 50,
    onRoundEnd: (combatant, state) => {
      healCombatant(combatant, 50)
      log(`${combatant.name} regenerates 50 HP!`)
    }
  }
}

// Burning: Damage over time with scaling
{
  id: 'burn-1',
  type: 'status',
  name: 'Burning',
  duration: 3,
  target: 'boss',
  behavior: {
    type: 'damagePerTurn',
    damageAmount: 25,
    onRoundEnd: (combatant, state) => {
      const damage = 25 * state.combatDepth // Scales with combat depth!
      applyTrueDamage(combatant, damage)
      log(`${combatant.name} burns for ${damage} damage!`)
    }
  }
}
```

**Flexible Status System:**
- Any effect can be created with custom behavior
- `behavior.onTurnStart`: Runs when combatant's turn begins
- `behavior.onTurnEnd`: Runs when combatant's turn ends
- `behavior.onRoundEnd`: Runs at end of round (after all turns)
- Effects are not hardcoded - defined in abilities/items/boss patterns

#### Boss Targeting Intelligence
- **Single-target attacks** use smart targeting:
  - **Low-danger bosses** (floors 1-20): Random targeting or highest HP
  - **Mid-danger bosses** (floors 21-60): Prefer low HP targets, occasional healer targeting
  - **High-danger bosses** (floors 61-100): Prioritize healers, support heroes, then damage dealers
- **Frontline Guard System** (Yugioh-style):
  - Heroes have positions based on **party slot**: Slots 1-2 = frontline, Slots 3-4 = backline
  - Boss must attack frontline heroes first (or use AOE/special abilities)
  - Once all frontline heroes are dead, backline becomes targetable
  - Certain boss abilities can bypass guard (AOE, cleave, special attacks)
- **AOE attacks**: Hit all heroes regardless of position
- **Cleave attacks**: Hit frontline heroes only (slots 1-2)
- **Multi attacks**: Random targets (can hit same hero multiple times)

#### Consumable Action Economy
- **Revive consumables**: Count as **1 full turn action**
  - Hero can ONLY revive, no other actions
  - Revived hero can act next round (if speed allows)
- **Other consumables**: Count as **1/3 turn action**
  - Can use **up to 3 consumables** per hero turn
  - Examples: healing potions, buff potions, debuff items
- **Overflow allowed**: Use consumables + another action
  - Example: Use 2 healing potions (2/3 turn) + Attack (full action) = 1.67 turn actions
  - This is intentional and balanced by consumable availability
- **Consumables in combat** work exactly like outside combat:
  - Instant effects are instant
  - Duration-based effects use combat rounds instead of depth
  - Cooldown-based consumables track cooldowns via combat rounds

#### Victory Rewards
- **Same rewards as existing boss events**: Gold, items, experience (if applicable)
- Rewards are **defined in boss event** and granted on victory
- No scaling with combat length (encourages efficient fights)
- Rewards based on **initial danger** (floor + depth at combat start, combatDepth=0)

#### Combat Persistence
- **Combat state persists through game close/reload**
- If player closes game mid-combat, they resume at the exact moment they left
- Turn order, boss HP, hero HP, buffs/debuffs, cooldowns all saved
- Ensures no progress loss or combat restart exploits

#### Infinite Combat Balance
- Fights can theoretically go infinite (no turn limit or enrage timer)
- **Natural loss condition**: Boss stats scale with combat depth indefinitely
- As fight drags on, boss becomes unstoppable (exponential scaling)
- Party will eventually lose if combat extends too long
- Encourages aggressive play and efficient damage strategies

When a hero's ability triggers during combat (either manually or via trigger conditions):
- Counts as a turn action
- Ability effects resolve immediately
- Combat depth does NOT increment until boss's turn
- Multiple abilities can trigger in one turn (e.g., passive procs)
- **Abilities track cooldowns during combat** (decrement each boss turn)

#### Ability Trigger Types
- `onCombatStart`: When combat begins
- `onTurnStart`: At the start of each player turn
- `onAttack`: When this hero attacks
- `onHit`: When this hero takes damage
- `onAllyLowHp`: When an ally drops below threshold
- `manual`: Player chooses when to use

#### Combat Item Usage
- **Revive consumables**: Count as turn actions (same as abilities)
- **Other consumables**: Do not count as turn actions
- **Items with cooldowns**: Track cooldown turns during combat (decrement each boss turn)
- **Item effects with revive**: Can revive heroes mid-combat

#### Hero Death Mechanics
- Hero death follows normal rules (permanent unless revived)
- Revive consumables can be used during combat
- Revive abilities can trigger during combat
- If all heroes die → Defeat, game over

### 6. Hero Abilities as Combat Actions

Bosses can have their own abilities that trigger during combat. Similar to hero abilities, boss abilities are defined in separate files and imported:

**File Structure:**
```
src/data/abilities/boss/
  enrage.ts
  devastatingSlam.ts
  regeneration.ts
  index.ts
```

**Example Boss Ability Definition** (`enrage.ts`):
```typescript
import type { BossAbility } from '@/types'

export const ENRAGE: BossAbility = {
  id: 'enrage',
  name: 'Enrage',
  description: 'The boss enters a rage, gaining bonus attack!',
  cooldown: 3,           // Can use every 3 turns
  trigger: 'onHpThreshold',
  hpThreshold: 0.5,      // Triggers at 50% HP
  effects: [
    { type: 'buff', stat: 'attack', value: 50, duration: 999 },
    { type: 'message', text: 'The boss roars in fury!' }
  ]
}
```

**Example Boss Ability Definition** (`devastatingSlam.ts`):
```typescript
import type { BossAbility } from '@/types'

export const DEVASTATING_SLAM: BossAbility = {
  id: 'aoe-slam',
  name: 'Devastating Slam',
  description: 'Hits all heroes with massive damage!',
  cooldown: 4,
  trigger: 'onTurnStart', // Checked at start of boss turn
  effects: [
    { type: 'damage', target: 'all', value: 80 },
    { type: 'message', text: 'The boss slams the ground!' }
  ]
}
```

**Example Boss Ability Definition** (`regeneration.ts`):
```typescript
import type { BossAbility } from '@/types'

export const REGENERATION: BossAbility = {
  id: 'regenerate',
  name: 'Regeneration',
  description: 'The boss recovers health!',
  cooldown: 5,
  trigger: 'always',      // Happens every turn (respecting cooldown)
  effects: [
    { type: 'heal', target: 'self', value: 100 },
    { type: 'message', text: 'The boss regenerates!' }
  ]
}
```

**Boss with Passive Healing** (alternative to ability-based healing):
```typescript
export const TROLL_BOSS: DungeonEvent = {
  id: 'troll-boss-regenerator',
  type: 'boss',
  title: 'Ancient Troll',
  
  // Passive healing every turn (no cooldown, no ability trigger)
  healPerTurn: 50, // Heals 50 HP at start of each boss turn
  
  bossAbilities: [],
  attackPatterns: [CRUSHING_BLOW],
  choices: [...]
}
```

**Boss with Phase Transitions:**
```typescript
export const DRAGON_BOSS: DungeonEvent = {
  id: 'dragon-boss-ancient',
  type: 'boss',
  title: 'Ancient Dragon',
  
  bossAbilities: [FLAME_BREATH, TAIL_SWIPE],
  attackPatterns: [CLAW_STRIKE, BITE],
  
  // Phase transitions at HP thresholds
  phases: [
    {
      phase: 1,
      hpThreshold: 1.0,  // Phase 1 from 100% HP
      name: 'Normal Form',
      description: 'The dragon circles warily...'
    },
    {
      phase: 2,
      hpThreshold: 0.66, // Phase 2 at 66% HP
      name: 'Agitated Form',
      description: 'The dragon roars in fury!',
      onEnter: [ENRAGE_ABILITY], // Trigger ability when entering phase
      addAttackPatterns: [WING_BUFFET], // Add new attack option
      statModifiers: {
        attack: 20,  // +20 attack in this phase
        speed: 10    // +10 speed
      }
    },
    {
      phase: 3,
      hpThreshold: 0.33, // Phase 3 at 33% HP
      name: 'Final Form',
      description: 'The dragon unleashes its full power!',
      onEnter: [TRANSFORM_ABILITY],
      replaceAttackPatterns: [DEVASTATION, APOCALYPSE], // Replace all attacks
      addAbilities: [METEOR_SHOWER],
      statModifiers: {
        attack: 50,
        defense: 30,
        speed: 20
      },
      healPerTurn: 100 // Starts regenerating in final phase
    }
  ],
  
  choices: [...]
}
```

**Boss Event with Abilities** (`zoneBoss10.ts`):
```typescript
import type { DungeonEvent } from '@/types'
import { ENRAGE, DEVASTATING_SLAM } from '@/data/abilities/boss'
import { HEAVY_STRIKE, EXECUTE } from '@/data/attackPatterns/boss'

export const ZONE_BOSS_10: DungeonEvent = {
  id: 'zone-boss-10-dungeon-warden',
  type: 'boss',
  
  // Name/description support variance (random each encounter)
  title: ['The Dungeon Warden', 'Warden of the Deep', 'The Armored Guardian'],
  description: [
    'A massive armored guardian blocks your path...',
    'An imposing figure in heavy plate stands before you...',
    'The warden\'s armor glints menacingly in the torchlight...'
  ],
  
  depth: 10,
  isZoneBoss: true,
  zoneBossFloor: 10,
  
  // Boss-specific abilities and attack patterns
  bossAbilities: [ENRAGE, DEVASTATING_SLAM],
  attackPatterns: [HEAVY_STRIKE, EXECUTE],
  
  // Optional: Passive healing per turn (for regenerating bosses)
  // healPerTurn: 25, // Boss heals 25 HP at start of each turn
  
  // Opening move choices (how heroes engage the boss)
  choices: [
    {
      text: 'Charge and attack!',
      outcome: {
        text: 'You rush forward and strike!',
        effects: [
          { type: 'bossDamage', value: 60 },
          { type: 'damage', target: 'all', value: 15 }, // Counterattack
        ]
      }
    },
    {
      text: 'Methodically break its armor',
      outcome: {
        text: 'You chip away at its defenses!',
        effects: [
          { type: 'bossDamage', value: 40 },
          { type: 'debuff', target: 'boss', stat: 'defense', value: -10, duration: 999 },
        ]
      }
    },
    {
      text: 'Find its weakness (High Speed)',
      requirements: { stat: 'speed', minValue: 25 },
      outcome: {
        text: 'You spot a gap in its armor!',
        effects: [
          { type: 'bossDamage', value: 100 },
          { type: 'damage', target: 'all', value: 5 },
        ]
      }
    }
  ],
  
  // Optional: Custom combat actions for turn-based phase
  // If omitted, uses default (Attack/Defend/Ability/Item)
  combatChoices: [
    {
      text: [
        'Strike at its armor joints',
        'Aim for the gaps in its plate',
        'Attack where the armor is weakest'
      ],
      outcome: {
        text: [
          'You land a solid hit!',
          'Your weapon finds its mark!',
          'A satisfying clang rings out!'
        ],
        effects: [
          { type: 'bossDamage', value: 40 }
        ]
      }
    },
    {
      text: [
        'Brace behind your shield',
        'Take a defensive stance',
        'Prepare for its next attack'
      ],
      outcome: {
        text: [
          'You steel yourself!',
          'You ready your defenses!',
          'You prepare to weather the storm!'
        ],
        effects: [
          { type: 'buff', target: 'all', stat: 'defense', value: 15, duration: 1 }
        ]
      }
    },
    {
      text: 'Hammer the armor (Warrior)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: [
          'Your mighty blow dents its armor!',
          'The armor crumples under your strike!',
          'You bash the armor with tremendous force!'
        ],
        effects: [
          { type: 'bossDamage', value: 60 },
          { type: 'debuff', target: 'boss', stat: 'defense', value: -5, duration: 3 }
        ]
      }
    },
    {
      text: 'Use Hero Ability',
      outcome: {
        text: 'Select an ability...',
        effects: [
          { type: 'abilityPrompt' } // Opens ability selection UI
        ]
      }
    },
    {
      text: 'Use Item',
      outcome: {
        text: 'Select an item...',
        effects: [
          { type: 'itemPrompt' } // Opens inventory UI
        ]
      }
    },
    {
      text: 'Flee the dungeon',
      outcome: {
        text: 'You abandon the fight and escape!',
        effects: [
          { type: 'flee' } // Exit dungeon, keep gold and equipped items, lose inventory
        ]
      }
    }
  ]
}
```

#### Boss Ability Trigger Flow
1. At boss turn start, check current phase (if boss has phases)
2. If HP crosses phase threshold, trigger phase transition:
   - Execute `onEnter` abilities
   - Apply stat modifiers
   - Update ability/attack pattern sets
   - Update healPerTurn if changed
3. Check all abilities for triggers
4. For each ability off cooldown:
   - If `trigger: 'always'` → Execute
   - If `trigger: 'onTurnStart'` → Execute
   - If `trigger: 'onHpThreshold'` and HP below threshold → Execute (once)
   - If `trigger: 'onPhaseChange'` and phase matches → Execute
5. After ability resolution, select and perform attack pattern
6. Update ability cooldowns

### 7. Boss Abilities

Bosses have multiple attack patterns they can use on each turn. Like abilities, attack patterns are defined in separate files:

**File Structure:**
```
src/data/attackPatterns/boss/
  heavyStrike.ts
  whirlwind.ts
  rapidStrikes.ts
  execute.ts
  index.ts
```

**Example Attack Pattern** (`heavyStrike.ts`):
```typescript
import type { BossAttackPattern } from '@/types'

export const HEAVY_STRIKE: BossAttackPattern = {
  id: 'heavy-strike',
  name: 'Heavy Strike',
  weight: 40,              // 40% chance
  attackType: 'single',
  damageMultiplier: 1.5,   // 150% of attack stat
  critChance: 0.3,         // 30% crit chance for this attack
  description: 'A devastating blow to a single hero!'
}
```

**Example Attack Pattern** (`whirlwind.ts`):
```typescript
import type { BossAttackPattern } from '@/types'

export const WHIRLWIND: BossAttackPattern = {
  id: 'whirlwind',
  name: 'Whirlwind Attack',
  weight: 30,              // 30% chance
  attackType: 'aoe',
  damageMultiplier: 1.0,
  aoeDamageReduction: 0.6, // 60% damage to all heroes
  description: 'Hits all heroes with reduced damage!'
}
```

**Example Attack Pattern** (`execute.ts`):
```typescript
import type { BossAttackPattern } from '@/types'

export const EXECUTE: BossAttackPattern = {
  id: 'execute',
  name: 'Execute',
  weight: 10,              // 10% chance
  attackType: 'single',
  damageMultiplier: 3.0,   // 300% damage!
  critChance: 1.0,         // Guaranteed crit
  description: 'A finishing blow!',
  condition: (state, party) => {
    // Only use when a hero is below 30% HP
    return party.some(h => h && h.isAlive && h.stats.hp < h.stats.maxHp * 0.3)
  }
}
```

#### Attack Pattern Selection
1. Filter patterns by condition (if condition exists and fails, skip)
2. Select from remaining patterns based on weights
3. Execute selected pattern:
   - **Single**: Pick random or weakest/strongest hero, apply damage with crit roll
   - **AOE**: Damage all alive heroes, reduced by aoeDamageReduction
   - **Multi**: Pick N random heroes (can hit same hero multiple times), damage each
   - **Cleave**: Damage front-line heroes (first 2 in party order)

#### Attack Type Examples
- **Boss Enraged Below 50% HP**: Higher weight on heavy attacks
- **Party Clustered**: More AOE attacks
- **Low HP Hero Present**: Execute/finisher attacks
- **Long Combat**: Increasing AOE frequency

### 8. Boss Attack Patterns

Boss fights have two phases:

**Phase 1: Opening Move** (uses boss event choices)  
**Phase 2: Turn-Based Combat** (uses standard combat actions)

```typescript
// After opening move choice resolution
if (isOpeningMove) {
  // Initialize combat state
  const combatState = initializeBossCombatState(bossEvent, dungeon)
  
  // Apply opening move effects
  resolveOpeningMoveEffects(choice.outcome, combatState, party)
  
  // Enter turn-based combat loop
  enterCombatLoop(combatState, party, dungeon)
}

// Turn-based combat loop
function combatLoop(combatState, party, dungeon) {
  // Calculate turn order (speed-based)
  const turnOrder = calculateTurnOrder([...party, boss])
  combatState.turnOrder = turnOrder
  combatState.currentTurnIndex = 0
  
  while (boss.currentHp > 0 && partyHasAliveHeroes) {
    // Stay in combat
    dungeon.currentEvent = updateBossEventWithState(dungeon.currentEvent, combatState)
    
    // Process each combatant's turn in speed order
    for (const combatant of turnOrder.filter(c => c.isAlive)) {
      if (combatant.type === 'hero') {
        // Hero turn: Present combat action choices
        // (Attack, Defend, Use Ability, Use Item, Flee)
        // Wait for player input...
        await processHeroTurn(combatant, combatState, party)
      } else if (combatant.type === 'boss') {
        // Check for phase transitions
        if (combatState.phases) {
          const currentHpPercent = combatState.currentHp / combatState.maxHp
          const nextPhase = combatState.phases.find(p => 
            p.phase > combatState.currentPhase && currentHpPercent <= p.hpThreshold
          )
          
          if (nextPhase) {
            // Trigger phase transition
            log(`Boss enters ${nextPhase.name}!`)
            combatState.currentPhase = nextPhase.phase
            
            // Execute onEnter abilities
            if (nextPhase.onEnter) {
              for (const ability of nextPhase.onEnter) {
                executeAbility(ability, combatState, party)
              }
            }
            
            // Update ability/attack pattern sets
            if (nextPhase.replaceAbilities) {
              combatState.abilities = [...nextPhase.replaceAbilities]
            } else if (nextPhase.addAbilities) {
              combatState.abilities.push(...nextPhase.addAbilities)
            }
            
            if (nextPhase.replaceAttackPatterns) {
              combatState.attackPatterns = [...nextPhase.replaceAttackPatterns]
            } else if (nextPhase.addAttackPatterns) {
              combatState.attackPatterns.push(...nextPhase.addAttackPatterns)
            }
            
            // Apply stat modifiers
            if (nextPhase.statModifiers) {
              applyPhaseStatModifiers(combatState, nextPhase.statModifiers)
            }
            
            // Update passive healing
            if (nextPhase.healPerTurn !== undefined) {
              combatState.healPerTurn = nextPhase.healPerTurn
            }
          }
        }
        
        // Boss turn: Apply passive healing
        if (combatState.healPerTurn) {
          combatState.currentHp = Math.min(combatState.currentHp + combatState.healPerTurn, combatState.maxHp)
        }
        
        // Boss turn: Check and execute abilities
        const triggeredAbilities = checkBossAbilities(combatState)
        for (const ability of triggeredAbilities) {
          executeAbility(ability, combatState, party)
          ability.lastUsed = combatState.combatDepth
        }
        
        // Boss attack: Select and execute attack pattern
        const selectedPattern = selectAttackPattern(combatState.attackPatterns, combatState, party)
        const target = selectBossTarget(selectedPattern, combatState, party)
        executeAttackPattern(selectedPattern, combatState, party, target)
      }
      
      // Check for victory/defeat after each action
      if (boss.currentHp <= 0 || !partyHasAliveHeroes) break
    }
    
    // Round complete - all combatants have acted
    combatState.combatDepth++
    
    // Process end-of-round effects
    processBuffDebuffDurations(combatState, party)
    processStatusEffects(combatState, party) // Poison, regen, burn, etc.
    decrementCooldowns(combatState)
    
    // Recalculate ONLY dynamic stats (attack, defense, speed, luck)
    // maxHp stays locked, currentHp stays as-is
    const newDanger = calculateDanger(combatState.floor, combatState.depth, combatState.combatDepth)
    combatState.baseStats = {
      attack: calculateScaledStat(baseAttack, newDanger, attackScaling),
      defense: calculateScaledStat(baseDefense, newDanger, defenseScaling),
      speed: calculateScaledStat(baseSpeed, newDanger, speedScaling),
      luck: calculateScaledStat(baseLuck, newDanger, luckScaling),
    }
    
    // Recalculate turn order for next round (speed may have changed)
    combatState.turnOrder = calculateTurnOrder([...party, boss])
  }
  
  if (boss.currentHp <= 0) {
    // Victory!
    // Rewards based on initial danger (not current combatDepth)
    const rewardDanger = calculateDanger(combatState.floor, combatState.depth, 0)
    giveRewards(bossEvent.rewards) // Existing boss event rewards
    advanceFloor()
  } else {
    // All heroes dead - defeat
    gameOver()
  }
}

// Turn order calculation
function calculateTurnOrder(combatants: Combatant[]): Combatant[] {
  return combatants
    .filter(c => c.isAlive)
    .sort((a, b) => b.speed - a.speed) // Highest speed first
}

// Boss target selection
function selectBossTarget(pattern: BossAttackPattern, state: BossCombatState, party: Hero[]): Hero | Hero[] {
  if (pattern.attackType === 'aoe') return party.filter(h => h.isAlive)
  if (pattern.attackType === 'cleave') return party.filter(h => h.isAlive && h.position === 'frontline')
  if (pattern.attackType === 'multi') {
    const targets = []
    for (let i = 0; i < pattern.targetCount; i++) {
      targets.push(randomChoice(party.filter(h => h.isAlive)))
    }
    return targets
  }
  
  // Single-target: Intelligent targeting
  const danger = calculateDanger(state.floor, state.depth, state.combatDepth)
  const frontline = party.filter(h => h.isAlive && h.position === 'frontline')
  const backline = party.filter(h => h.isAlive && h.position === 'backline')
  
  // Frontline guard: Must target frontline if any alive
  const validTargets = frontline.length > 0 ? frontline : backline
  
  if (danger <= 20) {
    // Low-danger: Random or highest HP
    return randomChoice(validTargets)
  } else if (danger <= 60) {
    // Mid-danger: Prefer low HP, occasional healer targeting
    if (Math.random() < 0.3 && backline.length === 0) { // 30% chance if backline exposed
      const healers = validTargets.filter(h => h.class === 'Healer' || h.class === 'Cleric')
      if (healers.length > 0) return healers[0]
    }
    return validTargets.sort((a, b) => a.stats.hp - b.stats.hp)[0] // Lowest HP
  } else {
    // High-danger: Prioritize healers > support > damage dealers
    if (backline.length === 0) { // Backline exposed
      const healers = validTargets.filter(h => h.class === 'Healer' || h.class === 'Cleric')
      if (healers.length > 0) return healers[0]
      const support = validTargets.filter(h => h.class === 'Bard' || h.class === 'Mage')
      if (support.length > 0) return support[0]
    }
    return validTargets.sort((a, b) => a.stats.hp - b.stats.hp)[0]
  }
}

function decrementCooldowns(state: BossCombatState) {
  // Decrement item cooldowns
  for (const [key, value] of state.itemCooldowns.entries()) {
    if (value > 0) state.itemCooldowns.set(key, value - 1)
  }
  // Decrement ability cooldowns
  for (const [key, value] of state.abilityCooldowns.entries()) {
    if (value > 0) state.abilityCooldowns.set(key, value - 1)
  }
}

function processBuffDebuffDurations(state: BossCombatState, party: Hero[]) {
  // Decrement durations on all active effects
  state.activeEffects = state.activeEffects.filter(effect => {
    if (effect.duration === 999) return true // Permanent
    effect.duration--
    return effect.duration > 0
  })
  
  // Also process party member effects
  for (const hero of party) {
    hero.activeEffects = hero.activeEffects?.filter(effect => {
      if (effect.duration === 999) return true
      effect.duration--
      return effect.duration > 0
    })
  }
}

// Process status effects (poison, regen, etc.)
function processStatusEffects(state: BossCombatState, party: Hero[]) {
  // Process boss status effects
  for (const effect of state.activeEffects.filter(e => e.type === 'status')) {
    if (effect.behavior?.onRoundEnd) {
      effect.behavior.onRoundEnd({ id: 'boss', type: 'boss', isAlive: true }, state)
    }
  }
  
  // Process hero status effects
  for (const hero of party.filter(h => h.isAlive)) {
    for (const effect of hero.activeEffects?.filter(e => e.type === 'status') || []) {
      if (effect.behavior?.onRoundEnd) {
        effect.behavior.onRoundEnd({ id: hero.id, type: 'hero', isAlive: true }, state)
      }
    }
  }
}

// Flee handler
function handleFlee() {
  // Exit dungeon
  // Keep gold and equipped items
  // Lose all items in inventory (unequipped)
  exitDungeon({ keepGold: true, keepEquipped: true, keepInventory: false })
}
```

### 9. Combat Event Stay Logic

All these values go into `GAME_CONFIG`:

```typescript
export const GAME_CONFIG = {
  // ... existing config ...
  
  combat: {
    // ... existing combat config ...
    
    // Turn-based boss combat
    turnBased: {
      enabled: true,  // Feature flag for turn-based combat
      
      // Boss base stats by tier
      bossStats: {
        floorBoss: {
          baseHp: 200,
          baseAttack: 30,
          baseDefense: 10,
          baseSpeed: 15,
          baseLuck: 10,
        },
        zoneBoss: {
          baseHp: 500,
          baseAttack: 50,
          baseDefense: 20,
          baseSpeed: 20,
          baseLuck: 15,
        },
        finalBoss: {
          baseHp: 2000,
          baseAttack: 100,
          baseDefense: 40,
          baseSpeed: 30,
          baseLuck: 25,
        },
      },
      
      // Danger contribution weights
      dangerWeights: {
        floor: 1.0,        // Floors contribute 1:1 to danger
        depth: 0.05,       // Events contribute minimally to danger
        combatDepth: 0.05, // Combat turns contribute same as events to danger
      },
      
      // First boss tutorial scaling (reduced difficulty)
      firstBossScaling: {
        enabled: true,
        floorThreshold: 1,   // Only applies to floor 1 bosses
        dangerReduction: 0.5, // Reduce effective danger by 50%
        description: 'First boss is easier to teach combat mechanics'
      },
      
      // Stat scaling per danger point
      bossScaling: {
        // Locked at combat start
        hp: 0.15,        // 15% HP per danger point (fixed when combat begins)
        
        // Dynamic scaling during combat
        attack: 0.12,    // 12% attack per danger point (recalculated each turn)
        defense: 0.10,   // 10% defense per danger point (recalculated each turn)
        speed: 0.08,     // 8% speed per danger point (recalculated each turn)
        luck: 0.05,      // 5% luck per danger point (recalculated each turn)
      },
      
      // Example boss abilities (defined per boss event)
      exampleAbilities: {
        enrage: {
          cooldown: 3,
          trigger: 'onHpThreshold',
          hpThreshold: 0.5,
          effects: ['buff attack by 50%', 'display message']
        },
        aoeSlam: {
          cooldown: 4,
          trigger: 'onTurnStart',
          effects: ['damage all heroes 80', 'display message']
        },
        regenerate: {
          cooldown: 5,
          trigger: 'always',
          effects: ['heal self 100', 'display message']
        }
      },
      
      // Example attack patterns (defined per boss event)
      exampleAttackPatterns: {
        heavyStrike: {
          weight: 40,
          attackType: 'single',
          damageMultiplier: 1.5,
          critChance: 0.3,
          description: 'Heavy single-target attack'
        },
        whirlwind: {
          weight: 30,
          attackType: 'aoe',
          damageMultiplier: 1.0,
          aoeDamageReduction: 0.6,
          description: 'AOE attack with reduced damage'
        },
        rapidStrikes: {
          weight: 20,
          attackType: 'multi',
          damageMultiplier: 0.7,
          targetCount: 3,
          description: 'Multi-hit attack'
        },
        execute: {
          weight: 10,
          attackType: 'single',
          damageMultiplier: 3.0,
          critChance: 1.0,
          condition: 'hero below 30% HP',
          description: 'Finisher attack'
        }
      }
    },
  },
}
```

## Implementation Phases

### Phase 1: Config & Types
- Add boss combat config to gameConfig.ts
- Add firstBossScaling config for tutorial/easy first boss
- Add BossCombatState interface to types (include healPerTurn, cooldown maps, activeEffects, turnOrder, phases, currentPhase, Combatant type)
- Add CombatEffect interface for buff/debuff/status tracking
- Add EffectBehavior interface for flexible status effects
- Add Combatant interface for turn order
- Add BossAbility and BossAttackPattern types to types
- Add BossPhase interface for phase transitions
- Add combatState, bossAbilities, attackPatterns, combatChoices, healPerTurn, customBaseStats, phases, and position fields to DungeonEvent/Hero types
- Support title/description as string | string[] for variance
- Support choice text/outcome text as string | string[] for variance
- Create file structure for boss abilities and attack patterns
- Add flee action type to choices

### Phase 2: Boss Stats Calculator & Abilities
- Create `calculateBossStats()` function
- Implement scaling formula with floor + combat depth
- Add support for customBaseStats override on boss events
- Add first boss scaling reduction (floor 1 danger reduction)
- Create helper to initialize boss combat state
- Define initial boss abilities in separate files (enrage, slam, regenerate)
- Define initial boss attack patterns in separate files (heavy strike, whirlwind, execute)
- Create index files for importing abilities and patterns

### Phase 3: Combat Event Loop
- Implement speed-based turn order calculation (with random tiebreaker)
- Modify event resolver to detect boss combat
- Add combat state tracking to dungeon
- Add combat state persistence (save/load during combat)
- Implement "stay in event" logic with individual hero turns
- Add boss turn resolution with ability checks
- Implement boss phase transition system (HP threshold triggers)
- Implement boss ability execution (including healing abilities)
- Implement passive boss healing (healPerTurn)
- Implement boss attack pattern system and selection logic
- Implement intelligent boss targeting (danger-scaled, frontline guard system with slot-based positioning)
- Add flee action handler (keep gold and equipped, lose inventory)
- Track item and ability cooldowns during combat
- Implement flexible status effect system (poison, stun, burn, regen, custom behaviors)
- Implement buff/debuff system with duration tracking (floor stats at 0, no caps)
- Process effects at end of round (status effects like poison/regen)
- Recalculate turn order each round

### Phase 4: Hero Abilities & Items Integration
- Add combat trigger types to abilities
- Implement ability resolution in combat (works with turn order)
- Track ability usage as turn actions (1 hero action)
- Implement ability cooldown tracking during combat (rounds)
- Add item cooldown tracking during combat (rounds)
- Implement revive consumables as 1 full turn action
- Implement other consumables as 1/3 turn action (up to 3 per turn)
- Allow action overflow (consumables + other actions)
- Ensure consumables work same as outside combat (instant vs duration-based)
- Handle hero death and revival during combat

### Phase 5: UI & Polish
- Create combat UI showing boss HP/stats
- Show turn counter (rounds) and combatDepth
- Display stat changes per round
- Show boss phase indicator and phase transitions
- Show turn order visualization (speed-based queue)
- Highlight active combatant's turn
- Display active buffs/debuffs/status effects with durations
- Show status effect icons and descriptions (poison, stun, etc.)
- Show cooldown timers for abilities and items
- Add combat animations
- Show consumable action economy (1/3 indicators)
- Display frontline/backline positioning (slot 1-2 vs 3-4)
- Show boss target selection visually
- Add phase transition animations and messages

## Design Decisions

### 1. Rewards Scaling
**Decision**: Rewards are static based on **initial danger** (combatDepth=0) to discourage dragging out fights.
- Longer fights don't give better loot
- Encourages efficient combat strategies
- Prevents farming by intentionally extending battles

### 2. Flee Option
**Decision**: Flee option replaces "Retreat" during combat.
- **Keep**: Gold, equipped items
- **Lose**: All items in inventory (unequipped)
- Exits the dungeon immediately
- Available as a combat action choice

### 3. Boss Healing
**Decision**: Bosses can heal through two methods:
- **Boss Abilities**: Triggered healing (cooldown-based, condition-based)
- **Passive Healing**: `healPerTurn` property for thematic bosses (trolls, undead, etc.)
- Both methods are optional and defined per-boss
- No default/universal boss healing

### 4. Hero Death & Revival
**Decision**: Hero death follows normal game rules during combat.
- Heroes can die permanently in combat
- **Revive consumables**: Count as turn actions (like abilities)
- **Other consumables**: Do NOT count as turn actions
- **Items with revive effects**: Can be used mid-combat
- **Abilities and items**: Track cooldowns during combat (decrement each turn)
- If all heroes die → Game over

### 5. Non-Boss Combat
**Decision**: Keep current one-shot event system for non-boss combat.
- Turn-based combat is boss-exclusive for now
- Danger scaling applies to all enemies
- Future expansion possible:
  - Elite enemies with turn-based combat
  - Wave-based encounters
  - Multi-enemy boss fights
- Marked as potential future feature

## Notes

- This design keeps boss events mostly unchanged (still one event definition)
- Stats are derived at runtime, no manual stat definition needed
- Bosses can override tier stats with customBaseStats for unique encounters
- Formula naturally creates clutch early-game moments and epic late-game battles
- First boss (floor 1) has reduced scaling for tutorial/learning purposes
- System is extensible to non-boss combat if desired
- Feature flag allows easy toggle during development
- Flee option provides emergency escape but at significant cost (lose inventory)
- Equipped items are safe when fleeing (permanent upgrades protected)
- Revive mechanics work in combat but consume turn actions
- Boss healing creates pressure in fights with regenerating enemies
- Cooldown tracking ensures abilities/items remain balanced in extended fights
- Combat persists through game close/reload (no progress loss)
- Speed ties resolved randomly (rare edge case)
- Stats floor at 0 (debuffs can't reduce below 0) but have no upper caps
- Flexible status effect system supports custom behaviors (poison, stun, burn, etc.)
- Boss phase transitions add dynamic fight progression at HP thresholds
- Hero positioning determined by party slots: 1-2 = frontline, 3-4 = backline
- No immunities or damage types yet (future expansion)
- Single boss fights only (no multi-boss encounters)
- Fights can go infinite but boss scaling ensures eventual party defeat if prolonged
