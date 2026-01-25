// Simple test to verify loot integration works
import { resolveEventOutcome } from '../src/systems/events/eventResolver.js'
import { ANCIENT_CHEST } from '../src/data/events/treasure/ancientChest.js'

// Mock hero party
const mockParty = [{
  id: 'test-hero',
  name: 'Test Hero',
  isAlive: true,
  level: 1,
  xp: 0,
  stats: {
    hp: 50,
    maxHp: 50,
    attack: 10,
    defense: 8,
    speed: 6,
    luck: 5
  },
  equipment: {
    weapon: null,
    armor: null,
    helmet: null,
    boots: null,
    accessory1: null,
    accessory2: null
  },
  abilities: [],
  class: {
    id: 'warrior',
    name: 'Warrior',
    description: 'A mighty warrior',
    baseStats: { attack: 10, defense: 8, speed: 6, luck: 5 },
    abilities: [],
    icon: 'GiSwordman'
  }
}]

const mockDungeon = {
  gold: 100,
  depth: 2
}

// Test treasure event with item generation
const choice = ANCIENT_CHEST.choices[0] // Force it open
const result = resolveEventOutcome(choice.outcome, mockParty, mockDungeon)

console.log('=== LOOT INTEGRATION TEST ===')
console.log('Gold before:', mockDungeon.gold)
console.log('Gold after:', result.updatedGold)
console.log('Items found:', result.resolvedOutcome.items.length)
console.log('Items:', result.resolvedOutcome.items.map(item => ({
  name: item.name,
  type: item.type,
  rarity: item.rarity,
  stats: item.stats
})))
console.log('Effects:', result.resolvedOutcome.effects.map(e => ({ 
  type: e.type, 
  description: e.description 
})))
console.log('=== TEST COMPLETE ===')