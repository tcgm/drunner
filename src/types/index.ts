import type { IconType } from 'react-icons'
import { MusicContext } from './audio'

// Core game types

export interface Stats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  luck: number
  wisdom: number
  charisma: number
  magicPower?: number // Stretch goal
}

export interface Ability {
  id: string
  name: string
  description: string
  cooldown: number // Floors/Depths until usable again (depends on cooldownType)
  cooldownType?: 'floor' | 'depth' // Whether cooldown is based on floor or depth progression (default: 'depth')
  currentCooldown: number // Deprecated - use lastUsedFloor/lastUsedDepth
  lastUsedFloor?: number // Floor on which ability was last used
  lastUsedDepth?: number // Depth on which ability was last used
  charges?: number // Limited uses per run (optional)
  chargesUsed?: number // Charges consumed this run
  effect: AbilityEffect
  icon?: IconType // react-icons icon component
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special'
  value: number // Base value
  target: 'self' | 'ally' | 'enemy' | 'all-allies' | 'all-enemies'
  duration?: number // For buffs/debuffs
  stat?: 'attack' | 'defense' | 'speed' | 'luck' // Which stat to buff/debuff
  scaling?: { // Optional stat scaling
    stat: 'attack' | 'defense' | 'wisdom' | 'magicPower' | 'charisma' | 'luck'
    ratio: number // Multiplier (e.g., 0.5 = 50% of stat added to base value)
  }
}

export interface HeroClass {
  id: string
  name: string
  description: string
  baseStats: Omit<Stats, 'hp' | 'maxHp'>
  statGains: Omit<Stats, 'hp'> // Stat increases per level (includes maxHp but not current hp)
  abilities: Ability[]
  icon: string // react-icons/gi name
}

export interface Hero {
  id: string
  name: string
  class: HeroClass
  level: number
  xp: number
  stats: Stats
  slots: Record<string, Item | Consumable | null> // All equipment and consumable slots
  abilities: Ability[]
  isAlive: boolean
  activeEffects: TimedEffect[] // Active timed effects on this hero (out of combat, depth-based)
  combatEffects?: CombatEffect[] // Active combat effects (buffs/debuffs/status during combat only)
  pendingResurrection?: boolean // True if hero will be revived at start of next event (from Amulet of Resurrection)
  position?: 'frontline' | 'backline' // Combat position (derived from party slot: 1-2 = frontline, 3-4 = backline)
  
  // Legacy fields for migration
  equipment?: Equipment
  consumableSlots?: (Consumable | null)[]
}

// Legacy equipment interface - kept for migration
export interface Equipment {
  weapon: Item | null
  armor: Item | null
  helmet: Item | null
  boots: Item | null
  accessory1: Item | null
  accessory2: Item | null
  // Stretch goals
  offhand?: Item | null
  belt?: Item | null
  cloak?: Item | null
  gloves?: Item | null
}

// Only core equipment slots (excludes stretch goal slots)
export type ItemSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2' | 'consumable'

export type ItemRarity = 
  // Base rarities (0-10 floors)
  | 'junk' 
  | 'abundant'
  | 'common' 
  | 'uncommon' 
  // Mid rarities (11-30 floors)
  | 'rare' 
  | 'veryRare'
  | 'magical'
  | 'elite'
  // High rarities (31-60 floors)
  | 'epic' 
  | 'legendary' 
  | 'mythic'
  | 'mythicc'
  // Ultra rarities (61-85 floors)
  | 'artifact'
  | 'divine'
  | 'celestial'
  // God rarities (86-95 floors)
  | 'realityAnchor'
  | 'structural'
  | 'singularity'
  | 'void'
  | 'elder'
  // Meta rarities (96-100+ floors)
  | 'layer'
  | 'plane'
  | 'author'

export interface Item {
  id: string
  name: string
  description: string
  type: ItemSlot
  rarity: ItemRarity
  stats: Partial<Omit<Stats, 'hp'>> // Equipment can modify maxHp
  value: number
  icon: IconType  | string // react-icons icon component or local SVG path
  setId?: string // For set items (stretch)
  modifiers?: string[] // Array of modifier IDs applied to this item
  // Item generation metadata - for regenerating names if needed
  materialId?: string // Material used to craft this item
  baseTemplateId?: string // Base template used for this item
  isUnique?: boolean // True if this is a unique/set item (not crafted)
  statVersion?: number // Version of stat calculation formula (for migrations)
  version?: number // Runtime version tracking (2 for V2, 3 for V3-derived, undefined for V1)
  // Template-only fields for rarity constraints (not stored on actual items)
  minRarity?: ItemRarity  // Minimum rarity this item can roll at
  maxRarity?: ItemRarity  // Maximum rarity this item can roll at
}

export interface Consumable extends Item {
  consumableType: 'potion' | 'scroll' | 'food' | 'supply'
  effects: ConsumableEffect[] // Array of effects to apply
  usableInCombat: boolean
  usableOutOfCombat: boolean
  stackable?: boolean // Can multiple stack in one slot
  stackCount?: number // Current stack count
  // Generation metadata (for procedural consumables)
  baseId?: string // Base effect type
  sizeId?: string // Size tier
  potencyId?: string // Concentration/quality tier
}

export interface ConsumableEffect {
  type: 'heal' | 'buff' | 'cleanse' | 'damage' | 'special' | 'revive' | 'hot'
  value?: number // Heal amount, damage, or stat modifier (or HP restored on revive, or HP per tick for HOT)
  stat?: keyof Stats // For buff effects
  duration?: number // In events (depths)
  isPermanent?: boolean
  target?: 'self' | 'ally' | 'all-allies' | 'enemy' | 'all-enemies'
}

export interface TimedEffect {
  id: string
  name: string
  description: string
  icon: IconType
  type: 'buff' | 'debuff' | 'status' | 'regeneration'
  appliedAtDepth: number
  duration: number // Number of events (depths)
  expiresAtDepth: number
  stat?: keyof Stats
  modifier: number // Numeric modifier (+10 attack, -5 defense, etc) or HP per tick for regeneration
  isPermanent: boolean
}

export type EventType = 
  | 'combat' 
  | 'treasure' 
  | 'choice' 
  | 'rest' 
  | 'merchant' 
  | 'trap'
  | 'boss'

// Combat system types

export interface EffectBehavior {
  type: 'skipTurn' | 'damagePerTurn' | 'healPerTurn' | 'custom'
  onTurnStart?: (combatant: Combatant, state: BossCombatState) => void
  onTurnEnd?: (combatant: Combatant, state: BossCombatState) => void
  onRoundEnd?: (combatant: Combatant, state: BossCombatState) => void
  damageAmount?: number // For damagePerTurn (true damage, ignores defense)
  healAmount?: number // For healPerTurn
  skipTurns?: boolean // For skipTurn (prevents action)
}

export interface CombatEffect {
  id: string
  type: 'buff' | 'debuff' | 'status'
  name: string // Display name (e.g., "Poison", "Stunned", "Burning")
  stat?: 'attack' | 'defense' | 'speed' | 'luck' | 'hp' // For buff/debuff only
  value?: number // Modifier value (for buffs/debuffs)
  duration: number // Rounds remaining (999 = permanent/until combat ends)
  target: 'self' | 'all' | 'boss' | string // Target identifier
  behavior?: EffectBehavior // For status effects (custom logic)
}

export interface Combatant {
  id: string // Hero ID or 'boss'
  type: 'hero' | 'boss'
  speed: number // Current speed stat (for turn order)
  isAlive: boolean // Dead combatants skip turns
}

export interface BossAbility {
  id: string
  name: string
  description: string
  cooldown: number // Turns between uses
  lastUsed: number // Turn number when last used (-cooldown to allow first turn use)
  trigger: 'onTurnStart' | 'onHpThreshold' | 'onPlayerAction' | 'always' | 'onPhaseChange'
  hpThreshold?: number // For onHpThreshold triggers (e.g., 0.5 = 50% HP)
  phase?: number // For onPhaseChange triggers (boss phase number)
  effects: AbilityEffect[]
}

export interface BossPhase {
  phase: number // Phase number (1, 2, 3, etc.)
  hpThreshold: number // HP percentage to trigger phase (e.g., 0.75 = 75% HP)
  name?: string // Optional phase name ("Enraged Form", "Final Form")
  description?: string // Optional phase description
  onEnter?: BossAbility[] // Abilities that trigger when entering this phase
  replaceAbilities?: BossAbility[] // Replace boss ability set with these
  replaceAttackPatterns?: BossAttackPattern[] // Replace attack patterns
  addAbilities?: BossAbility[] // Add these abilities to existing set
  addAttackPatterns?: BossAttackPattern[] // Add these patterns
  statModifiers?: { // Phase-specific stat changes
    attack?: number // Additive modifier
    defense?: number
    speed?: number
    luck?: number
  }
  healPerTurn?: number // Change passive healing in this phase
}

export interface BossAttackPattern {
  id: string
  name: string
  weight: number // Probability weight for random selection
  attackType: 'single' | 'aoe' | 'multi' | 'cleave'
  damageMultiplier: number // Multiplier of boss attack stat
  critChance?: number // Override crit chance for this attack
  targetCount?: number // For multi-hit attacks
  aoeDamageReduction?: number // Damage multiplier for AOE (e.g., 0.6 = 60% damage to all)
  description: string
  condition?: (state: BossCombatState, party: Hero[]) => boolean // Optional condition check
}

export interface BossCombatState {
  currentHp: number // Boss's current HP
  maxHp: number // Boss's max HP (locked at combat start)
  baseStats: { // Base stats for recalculation
    attack: number
    defense: number
    speed: number
    luck: number
  }
  abilities: BossAbility[] // Boss's available abilities
  attackPatterns: BossAttackPattern[] // Boss's basic attack options
  phases?: BossPhase[] // Optional phase transitions at HP thresholds
  currentPhase: number // Current boss phase (starts at 1)
  combatChoices?: EventChoice[] // Custom combat actions for this boss (optional)
  healPerTurn?: number // Optional passive healing per turn (for regenerating bosses)
  combatDepth: number // Rounds completed (increments after all combatants act)
  floor: number // Floor when combat started (for danger calc)
  depth: number // Total depth when combat started (for danger calc)
  itemCooldowns: Map<string, number> // Track item cooldowns during combat
  abilityCooldowns: Map<string, number> // Track ability cooldowns during combat
  activeEffects: CombatEffect[] // Active buffs/debuffs with durations
  turnOrder: Combatant[] // Current turn order sorted by speed
  currentTurnIndex: number // Index of current actor in turn order
}

export interface EventChoice {
  text: string | string[] // Single text or array for variance
  requirements?: {
    class?: string | string[] // Single class or multiple classes (any match)
    stat?: keyof Stats
    minValue?: number
    item?: string
    gold?: number
    hasDeadHero?: boolean // Requires at least one dead hero
  }
  outcome?: EventOutcome // Single outcome (original behavior)
  possibleOutcomes?: Array<{ // Multiple chance-based outcomes
    weight: number // Probability weight (higher = more likely)
    outcome: EventOutcome
  }>
  // Success/Failure outcomes for skill checks
  successChance?: number // Base chance (0-1) before stat modifiers
  statModifier?: keyof Stats // Stat that affects success (adds bonus to chance)
  successOutcome?: EventOutcome // On success
  failureOutcome?: EventOutcome // On failure
}

export interface EventOutcome {
  text: string | string[] | Array<{ weight: number; text: string }> // Single text, array for variance, or weighted variations
  effects: {
    type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'consumable' | 'status' | 'revive' | 'upgradeItem' | 'killRandomParty' | 'bossDamage' | 'buff' | 'debuff' | 'message' | 'flee' | 'abilityPrompt' | 'itemPrompt'
    target?: 'random' | 'all' | 'weakest' | 'strongest' | 'self' | 'boss' | string
    consumableId?: string // ID of consumable to give (for type: 'consumable')
    value?: number
    stat?: 'attack' | 'defense' | 'speed' | 'luck' | 'hp' // For buff/debuff effects
    duration?: number // For buff/debuff effects (rounds in combat)
    fullHeal?: boolean // For heal effects: restore to full HP (ignores value)
    isTrueDamage?: boolean // For damage effects: ignore defense (true damage)
    upgradeType?: 'material' | 'rarity' | 'auto' | 'random' // For upgradeItem: specify material, rarity, auto (material first, then rarity), or random (picks material or rarity randomly)
    // Item generation specifications (only one should be used)
    itemType?: 'random' | ItemSlot // Generate random item of specific type or any type
    setId?: string // Generate item from specific set (e.g., 'draconic', 'arcane')
    uniqueItem?: string | Omit<Item, 'id'> // Generate specific unique item by ID or literal import
    material?: string | Material // Material by ID or literal import
    baseTemplate?: string | BaseTemplate // Base template by ID or literal import
    // Rarity control for generated items
    minRarity?: ItemRarity // Minimum rarity (e.g., 'uncommon')
    maxRarity?: ItemRarity // Maximum rarity (e.g., 'legendary')
    rarityBoost?: number // Add to depth for rarity calculation (e.g., +10 depth)
    modifiers?: string[] // Array of modifier IDs to apply to generated item
    // Weighted item choices - for multiple possible outcomes
    itemChoices?: Array<{
      weight: number
      itemType?: 'random' | ItemSlot
      setId?: string // Generate item from specific set
      uniqueItem?: string | Omit<Item, 'id'>
      material?: string | Material
      baseTemplate?: string | BaseTemplate
      minRarity?: ItemRarity
      maxRarity?: ItemRarity
      rarityBoost?: number
      modifiers?: string[]
    }>
    item?: Item // Deprecated: pre-generated item (for backward compatibility)
  }[]
}

export interface DungeonEvent {
  id: string
  type: EventType
  title: string | string[] // Single text or array for variance
  description: string | string[] | Array<{ weight: number; text: string }> // Single text, array for variance, or weighted variations
  choices: EventChoice[]
  depth: number
  icon?: IconType // react-icons icon component
  isFinalBoss?: boolean // True for the Floor 100 final boss only
  isZoneBoss?: boolean // True for major milestone bosses (floors 10, 20, 30, etc.)
  zoneBossFloor?: number // The specific floor this zone boss appears on
  
  // Combat system fields
  combatState?: BossCombatState // Multi-turn combat state (for bosses)
  bossAbilities?: BossAbility[] // Boss abilities (for boss events)
  attackPatterns?: BossAttackPattern[] // Boss attack patterns (for boss events)
  combatChoices?: EventChoice[] // Custom combat actions for turn-based phase (optional)
  healPerTurn?: number // Optional passive healing per turn (for regenerating bosses)
  customBaseStats?: { // Override tier defaults with custom base stats
    baseHp?: number
    baseAttack?: number
    baseDefense?: number
    baseSpeed?: number
    baseLuck?: number
  }
  phases?: BossPhase[] // Optional phase transitions at HP thresholds
}

export interface EventLogEntry {
  eventId: string
  eventTitle: string
  eventType: EventType
  floor: number
  depth: number
  choiceMade: string
  outcomeText: string
  goldChange: number
  itemsGained: string[] // Item names
  damageDealt: number
  damageTaken: number
  healingReceived: number
  xpGained: number
  heroesAffected: string[] // Hero names
}

export interface Dungeon {
  depth: number // Total events completed (legacy, for migration)
  floor: number // Current floor number (new system)
  eventsThisFloor: number // Events completed on current floor
  eventsRequiredThisFloor: number // Random target (min-max) for this floor before boss
  currentEvent: DungeonEvent | null
  eventHistory: string[] // Simple event ID list (legacy)
  eventLog: EventLogEntry[] // Detailed event logging
  gold: number
  inventory: Item[] // In-run inventory
  isNextEventBoss?: boolean // Indicates if next event is a floor boss
  bossType?: 'floor' | 'major' | null // Type of current boss (floor boss vs major boss)
}

export interface Run {
  id: string
  startDate: number // timestamp
  endDate?: number // timestamp when run ended
  startDepth: number
  finalDepth: number
  startFloor?: number // Current floor when run started (new system)
  finalFloor?: number // Final floor reached (new system)
  result: 'active' | 'victory' | 'defeat' | 'retreat'
  goldEarned: number
  goldSpent: number
  eventsCompleted: number
  enemiesDefeated: number // Count of combat events won
  itemsFound: number // Count of items obtained
  damageDealt: number // Total damage dealt to enemies/traps
  damageTaken: number // Total damage taken by party
  healingReceived: number // Total healing received
  xpGained: number // Total XP gained by all heroes
  xpMentored: number // XP shared from max-level heroes to lower-level party members
  metaXpGained: number // Overflow XP sent to the meta XP pool
  heroesUsed: { name: string; class: string; level: number }[]
  deathDetails?: { // Information about what killed the party
    eventTitle: string
    eventType: string
    heroDamage: { heroName: string; damageReceived: number }[]
  }
  // Detailed statistics
  combatEvents: number // Number of combat events
  treasureEvents: number // Number of treasure events
  restEvents: number // Number of rest events
  bossesDefeated: number // Number of bosses defeated
  merchantVisits: number // Number of merchant visits
  trapsTriggered: number // Number of trap events
  choiceEvents: number // Number of choice events
  totalLevelsGained: number // Sum of all level-ups across party
  itemsDiscarded: number // Items turned into alkahest
  alkahestGained: number // Total alkahest from discarding items
  highestDamageSingleHit: number // Biggest single damage instance
  timesRevived: number // Number of hero revives during run
}

export interface GameState {
  saveVersion: number // Current save format version, increment when breaking changes occur
  party: (Hero | null)[]
  heroRoster: Hero[] // All heroes ever created, organized by class
  dungeon: Dungeon
  bankGold: number // Gold stored outside runs (added on victory/retreat)
  alkahest: number // Currency from discarded items
  bankInventory: Item[] // Items stored outside runs
  bankStorageSlots: number // Maximum bank storage capacity
  overflowInventory: Item[] // Items from last run that exceed bank capacity
  corruptedItems: Item[] // Items that failed to load properly and need user resolution
  v2Items: Item[] // Items using old V2 format that can be migrated to V3
  metaXp: number // Account-wide XP for meta-progression unlocks
  isGameOver: boolean
  isPaused: boolean
  hasPendingPenalty: boolean
  activeRun: Run | null
  runHistory: Run[]
  lastOutcome: {
    text: string
    effects: {
      type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status' | 'revive' | 'upgradeItem'
      target: string[]
      value?: number
      item?: Item
      description: string
    }[]
    items: Item[] // Items that should be added to inventory
  } | null
  // Music settings
  musicVolume: number // 0-1
  musicEnabled: boolean
  currentMusicContext: MusicContext | null
  // Migration state
  pendingMigration: boolean // True if save data needs migration
  pendingMigrationData: string | null // Compressed save data awaiting migration
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: 'consumable' | 'buff' | 'gear' | 'unlock'
  consumable?: Consumable // For consumable purchases
  item?: Item // For gear purchases
  effect?: TimedEffect // For buff/effect purchases
  stock?: number // Limited quantity (-1 for infinite)
  requiresUnlock?: string // Achievement/unlock requirement ID
  icon: IconType
}

// Additional types for literal imports
export interface Material {
  id: string
  name: string
  prefix: string
  rarity: ItemRarity
  statMultiplier: number
  valueMultiplier: number
  description?: string
}

export interface BaseTemplate {
  icon: IconType
  description: string
  type: ItemSlot
  stats: Partial<Omit<Stats, 'hp'>>
}

// Re-export V3 types
export * from './items-v3'
