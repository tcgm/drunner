import type { IconType } from 'react-icons'

// Core game types

export interface Stats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  luck: number
  magicPower?: number // Stretch goal
}

export interface Ability {
  id: string
  name: string
  description: string
  cooldown: number
  currentCooldown: number
  effect: AbilityEffect
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special'
  value: number
  target: 'self' | 'ally' | 'enemy' | 'all-allies' | 'all-enemies'
  duration?: number // For buffs/debuffs
}

export interface HeroClass {
  id: string
  name: string
  description: string
  baseStats: Omit<Stats, 'hp' | 'maxHp'>
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
  equipment: Equipment
  abilities: Ability[]
  isAlive: boolean
}

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
export type ItemSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

export type ItemRarity = 
  | 'junk' 
  | 'common' 
  | 'uncommon' 
  | 'rare' 
  | 'epic' 
  | 'legendary' 
  | 'mythic'
  | 'artifact' // Stretch
  | 'cursed'   // Stretch
  | 'set'      // Stretch

export interface Item {
  id: string
  name: string
  description: string
  type: ItemSlot
  rarity: ItemRarity
  stats: Partial<Omit<Stats, 'hp'>> // Equipment can modify maxHp
  value: number
  icon: IconType // react-icons icon component
  setId?: string // For set items (stretch)
  // Item generation metadata - for regenerating names if needed
  materialId?: string // Material used to craft this item
  baseTemplateId?: string // Base template used for this item
  isUnique?: boolean // True if this is a unique/set item (not crafted)
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
    class?: string
    stat?: keyof Stats
    minValue?: number
    item?: string
    gold?: number
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
  text: string
  effects: {
    type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status' | 'revive' | 'upgradeItem'
    target?: 'random' | 'all' | 'weakest' | 'strongest'
    value?: number
    // Item generation specifications (only one should be used)
    itemType?: 'random' | ItemSlot // Generate random item of specific type or any type
    uniqueItem?: string | Omit<Item, 'id'> // Generate specific unique item by ID or literal import
    material?: string | Material // Material by ID or literal import
    baseTemplate?: string | BaseTemplate // Base template by ID or literal import
    // Rarity control for generated items
    minRarity?: ItemRarity // Minimum rarity (e.g., 'uncommon')
    maxRarity?: ItemRarity // Maximum rarity (e.g., 'legendary')
    rarityBoost?: number // Add to depth for rarity calculation (e.g., +10 depth)
    // Weighted item choices - for multiple possible outcomes
    itemChoices?: Array<{
      weight: number
      itemType?: 'random' | ItemSlot
      uniqueItem?: string | Omit<Item, 'id'>
      material?: string | Material
      baseTemplate?: string | BaseTemplate
      minRarity?: ItemRarity
      maxRarity?: ItemRarity
      rarityBoost?: number
    }>
    item?: Item // Deprecated: pre-generated item (for backward compatibility)
  }[]
}

export interface DungeonEvent {
  id: string
  type: EventType
  title: string
  description: string
  choices: EventChoice[]
  depth: number
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
  party: (Hero | null)[]
  heroRoster: Hero[] // All heroes ever created, organized by class
  dungeon: Dungeon
  bankGold: number // Gold stored outside runs (added on victory/retreat)
  alkahest: number // Currency from discarded items
  bankInventory: Item[] // Items stored outside runs
  bankStorageSlots: number // Maximum bank storage capacity
  overflowInventory: Item[] // Items from last run that exceed bank capacity
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
  description: string
  type: ItemSlot
  stats: Partial<Omit<Stats, 'hp'>>
}
