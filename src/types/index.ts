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
  stats: Partial<Omit<Stats, 'hp' | 'maxHp'>>
  value: number
  setId?: string // For set items (stretch)
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
  outcome: EventOutcome
}

export interface EventOutcome {
  text: string
  effects: {
    type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status' | 'revive'
    target?: 'random' | 'all' | 'weakest' | 'strongest'
    value?: number
    item?: Item
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

export interface Dungeon {
  depth: number
  maxDepth: number
  currentEvent: DungeonEvent | null
  eventHistory: string[]
  gold: number
}

export interface GameState {
  party: Hero[]
  dungeon: Dungeon
  isGameOver: boolean
  isPaused: boolean
  hasPendingPenalty: boolean
  lastOutcome: {
    text: string
    effects: {
      type: 'damage' | 'heal' | 'xp' | 'gold' | 'item' | 'status'
      target: string[]
      value?: number
      item?: Item
      description: string
    }[]
  } | null
}
