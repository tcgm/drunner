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
  cooldown: number // Floors until usable again
  currentCooldown: number // Deprecated - use lastUsedFloor
  lastUsedFloor?: number // Floor on which ability was last used
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
  activeEffects: TimedEffect[] // Active timed effects on this hero
  pendingResurrection?: boolean // True if hero will be revived at start of next event (from Amulet of Resurrection)
  
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

export interface EventChoice {
  text: string
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
  text: string | Array<{ weight: number; text: string }> // Single text or weighted variations
  effects: {
    type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'consumable' | 'status' | 'revive' | 'upgradeItem' | 'killRandomParty'
    target?: 'random' | 'all' | 'weakest' | 'strongest'
    consumableId?: string // ID of consumable to give (for type: 'consumable')
    value?: number
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
  title: string
  description: string | Array<{ weight: number; text: string }> // Single text or weighted variations
  choices: EventChoice[]
  depth: number
  icon?: IconType // react-icons icon component
  isFinalBoss?: boolean // True for the Floor 100 final boss only
  isZoneBoss?: boolean // True for major milestone bosses (floors 10, 20, 30, etc.)
  zoneBossFloor?: number // The specific floor this zone boss appears on
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
