#!/usr/bin/env node

/**
 * Calculate Maximum Defense
 * 
 * This script calculates the theoretical maximum defense a hero can achieve
 * by considering:
 * - All equipment slots (weapon, armor, helmet, boots, accessory1, accessory2)
 * - All available items (sets, uniques, procedural)
 * - All rarity levels and their stat multipliers
 * - Set bonuses that grant defense
 * 
 * The result is written to src/config/defenseConfig.ts
 * 
 * Run with: npm run calculate-max-defense
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'

// Get paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Equipment slots to consider (based on slotConfig.ts)
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2']

// Rarity multipliers (from raritySystem.ts)
const RARITY_MULTIPLIERS = {
  junk: 0.5,
  abundant: 0.8,
  common: 1.0,
  uncommon: 1.3,
  rare: 1.7,
  veryRare: 2.2,
  magical: 2.7,
  elite: 3.5,
  epic: 4.5,
  legendary: 6.0,
  mythic: 8.0,
  mythicc: 11.0,
  artifact: 15.0,
  divine: 20.0,
  celestial: 27.0,
  realityAnchor: 36.0,
  structural: 48.0,
  singularity: 60.0,
  void: 80.0,
  elder: 100.0,
  layer: 130.0,
  plane: 170.0,
  author: 30.0, // Special case
}

// Material multipliers (from materials index)
const MATERIAL_MULTIPLIERS = {
  wood: 0.8,
  iron: 1.0,
  steel: 1.2,
  obsidian: 1.5,
  crimson: 1.8,
  gold: 2.0,
  mythril: 2.5,
  elderwood: 3.0,
  stormforged: 4.0,
  titanium: 5.0,
  voidstone: 7.0,
}

const UNIQUE_BOOST = 1.3 // 30% boost for unique items

/**
 * Extract defense value from item file content
 */
function extractDefenseFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    // Look for defense: number pattern
    const defenseMatch = content.match(/defense:\s*(\d+)/i)
    if (defenseMatch) {
      return parseInt(defenseMatch[1], 10)
    }
    
    return 0
  } catch (error) {
    console.warn(`  Warning: Could not read ${filePath}`)
    return 0
  }
}

/**
 * Extract set bonuses from effects file
 */
function extractSetBonuses(effectsFilePath) {
  try {
    const content = readFileSync(effectsFilePath, 'utf-8')
    const bonuses = []
    
    // Look for patterns like: defense: 30 in set bonus definitions
    const bonusMatches = content.matchAll(/(\d+):\s*{[^}]*defense:\s*(\d+)/gi)
    for (const match of bonusMatches) {
      const pieces = parseInt(match[1], 10)
      const defense = parseInt(match[2], 10)
      bonuses.push({ pieces, defense })
    }
    
    return bonuses
  } catch (error) {
    return []
  }
}

/**
 * Scan directory recursively for TypeScript files
 */
function scanDirectory(dir) {
  const files = []
  
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath))
      } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }
  
  return files
}

/**
 * Find max defense for a slot from set items
 */
function findMaxDefenseFromSets(slot, highestRarityMultiplier) {
  const setsDir = join(rootDir, 'src', 'data', 'items', 'sets')
  const setFolders = readdirSync(setsDir).filter(name => {
    const fullPath = join(setsDir, name)
    return statSync(fullPath).isDirectory()
  })
  
  let maxDefense = 0
  let maxDefenseItem = null
  
  for (const setFolder of setFolders) {
    const setDir = join(setsDir, setFolder)
    const files = scanDirectory(setDir)
    
    for (const file of files) {
      const fileName = file.split(/[/\\]/).pop()
      
      // Match slot files
      if (
        (slot === 'weapon' && fileName === 'weapon.ts') ||
        (slot === 'armor' && fileName === 'armor.ts') ||
        (slot === 'helmet' && fileName === 'helmet.ts') ||
        (slot === 'boots' && fileName === 'boots.ts') ||
        (slot === 'accessory1' && fileName.includes('accessory')) ||
        (slot === 'accessory2' && fileName.includes('accessory'))
      ) {
        const baseDefense = extractDefenseFromFile(file)
        const defenseWithRarity = Math.floor(baseDefense * highestRarityMultiplier)
        const defenseAsUnique = Math.floor(baseDefense * highestRarityMultiplier * UNIQUE_BOOST)
        
        const maxForItem = Math.max(defenseWithRarity, defenseAsUnique)
        
        if (maxForItem > maxDefense) {
          maxDefense = maxForItem
          maxDefenseItem = { file, baseDefense, setFolder }
        }
      }
    }
  }
  
  return { maxDefense, item: maxDefenseItem }
}

/**
 * Find max defense for a slot from unique items
 */
function findMaxDefenseFromUniques(slot, highestRarityMultiplier) {
  const uniquesDir = join(rootDir, 'src', 'data', 'items', 'uniques')
  const slotDirs = {
    weapon: 'weapons',
    armor: 'armor',
    helmet: 'helmets',
    boots: 'boots',
    accessory1: 'accessories',
    accessory2: 'accessories',
  }
  
  const slotDir = join(uniquesDir, slotDirs[slot] || slot)
  if (!existsSync(slotDir)) return { maxDefense: 0, item: null }
  
  const files = scanDirectory(slotDir)
  let maxDefense = 0
  let maxDefenseItem = null
  
  for (const file of files) {
    if (file.endsWith('index.ts')) continue
    
    const baseDefense = extractDefenseFromFile(file)
    const defenseWithBoost = Math.floor(baseDefense * highestRarityMultiplier * UNIQUE_BOOST)
    
    if (defenseWithBoost > maxDefense) {
      maxDefense = defenseWithBoost
      maxDefenseItem = { file, baseDefense }
    }
  }
  
  return { maxDefense, item: maxDefenseItem }
}

// Helper for existsSync
import { existsSync } from 'fs'

/**
 * Find max defense from procedural items (bases + materials)
 */
function findMaxDefenseFromProcedural(slot, highestRarityMultiplier) {
  const basesDir = join(rootDir, 'src', 'data', 'items', 'bases')
  const files = scanDirectory(basesDir)
  
  let maxDefense = 0
  let maxDefenseItem = null
  
  // Map slots to base file patterns
  const slotPatterns = {
    weapon: ['sword', 'axe', 'staff', 'dagger', 'bow', 'mace', 'spear'],
    armor: ['chest', 'armor', 'plate', 'robe'],
    helmet: ['helmet', 'helm', 'crown', 'cap'],
    boots: ['boots', 'greaves', 'shoes'],
    accessory1: ['ring', 'amulet', 'necklace', 'pendant'],
    accessory2: ['ring', 'amulet', 'necklace', 'pendant'],
  }
  
  const patterns = slotPatterns[slot] || []
  
  for (const file of files) {
    const fileName = file.toLowerCase()
    const matchesSlot = patterns.some(pattern => fileName.includes(pattern))
    
    if (matchesSlot) {
      const baseDefense = extractDefenseFromFile(file)
      
      // Try all materials
      for (const [materialName, materialMult] of Object.entries(MATERIAL_MULTIPLIERS)) {
        const defense = Math.floor(baseDefense * materialMult * highestRarityMultiplier)
        
        if (defense > maxDefense) {
          maxDefense = defense
          maxDefenseItem = { file, baseDefense, material: materialName }
        }
      }
    }
  }
  
  return { maxDefense, item: maxDefenseItem }
}

/**
 * Find maximum set bonuses
 */
function findMaxSetBonuses() {
  const setsDir = join(rootDir, 'src', 'data', 'items', 'sets')
  const setFolders = readdirSync(setsDir).filter(name => {
    const fullPath = join(setsDir, name)
    return statSync(fullPath).isDirectory()
  })
  
  let maxBonus = 0
  let bestSet = null
  
  for (const setFolder of setFolders) {
    const effectsFile = join(setsDir, setFolder, 'effects.ts')
    const bonuses = extractSetBonuses(effectsFile)
    
    for (const bonus of bonuses) {
      if (bonus.defense > maxBonus) {
        maxBonus = bonus.defense
        bestSet = { set: setFolder, pieces: bonus.pieces }
      }
    }
  }
  
  return { maxBonus, bestSet }
}

/**
 * Main calculation: find theoretical max defense
 */
function calculateMaxDefense() {
  console.log('🛡️  Calculating theoretical maximum defense...\n')
  
  // Get highest rarity multiplier
  const highestRarityMultiplier = Math.max(...Object.values(RARITY_MULTIPLIERS))
  const highestRarityName = Object.entries(RARITY_MULTIPLIERS)
    .find(([_, mult]) => mult === highestRarityMultiplier)?.[0] || 'unknown'
  
  console.log(`Highest rarity: ${highestRarityName} (${highestRarityMultiplier}x multiplier)`)
  console.log('\nFinding best defense items per slot:\n')
  
  let totalDefense = 0
  const bestLoadout = []
  
  // Find best item for each slot
  for (const slot of EQUIPMENT_SLOTS) {
    const setResult = findMaxDefenseFromSets(slot, highestRarityMultiplier)
    const uniqueResult = findMaxDefenseFromUniques(slot, highestRarityMultiplier)
    const procResult = findMaxDefenseFromProcedural(slot, highestRarityMultiplier)
    
    // Pick the best
    const results = [
      { type: 'set', ...setResult },
      { type: 'unique', ...uniqueResult },
      { type: 'procedural', ...procResult },
    ]
    
    const best = results.reduce((max, current) => 
      current.maxDefense > max.maxDefense ? current : max
    )
    
    totalDefense += best.maxDefense
    
    const itemName = best.item 
      ? (best.item.setFolder || best.item.material || best.item.file.split(/[/\\]/).pop())
      : 'none'
    
    console.log(`  ${slot.padEnd(12)} -> ${best.maxDefense.toString().padStart(4)} defense | ${itemName}`)
    
    bestLoadout.push({ slot, defense: best.maxDefense, item: itemName, type: best.type })
  }
  
  console.log(`\n  Subtotal from items: ${totalDefense} defense`)
  
  // Calculate best set bonus
  const setBonusResult = findMaxSetBonuses()
  if (setBonusResult.maxBonus > 0) {
    console.log(`  Set bonus defense: +${setBonusResult.maxBonus}`)
    totalDefense += setBonusResult.maxBonus
  }
  
  console.log(`\n📊 THEORETICAL MAX DEFENSE: ${totalDefense} defense`)
  
  return {
    maxDefense: totalDefense,
    highestRarity: highestRarityName,
    bestLoadout
  }
}

/**
 * Update defenseConfig.ts with calculated max defense
 */
function updateDefenseConfig(maxDefense) {
  const configPath = join(rootDir, 'src', 'config', 'defenseConfig.ts')
  let content = readFileSync(configPath, 'utf-8')
  
  // Update the maxDefense value in DEFENSE_CONFIG
  content = content.replace(
    /maxDefense:\s*\d+,\s*\/\/.*$/m,
    `maxDefense: ${maxDefense}, // Auto-calculated: ${new Date().toISOString().split('T')[0]}`
  )
  
  // Update the "Last calculated" comment
  content = content.replace(
    /\/\/ Last calculated:.*$/m,
    `// Last calculated: ${new Date().toLocaleString()}`
  )
  
  writeFileSync(configPath, content, 'utf-8')
  console.log(`\n✅ Updated ${configPath}`)
}

/**
 * Generate a defense curve preview
 */
function generateCurvePreview(maxDefense) {
  console.log('\n📈 Defense Curve Preview (with current settings):')
  console.log('─'.repeat(50))
  
  const percentilePoints = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0]
  
  console.log('Defense Value -> Expected Block %\n')
  
  // Assuming logarithmic curve with midpoint at 40% of max
  const midpoint = maxDefense * 0.4
  const maxBlock = 0.95
  
  for (const p of percentilePoints) {
    const defense = Math.floor(maxDefense * p)
    const k = midpoint
    const normalized = Math.log(1 + defense / k) / Math.log(1 + maxDefense / k)
    const blockPercent = (normalized * maxBlock * 100).toFixed(1)
    
    const percentStr = `${(p * 100).toFixed(0)}%`.padStart(4)
    const defenseStr = defense.toString().padStart(5)
    const blockStr = `${blockPercent}%`.padStart(6)
    
    console.log(`  ${percentStr} of max (${defenseStr} def) -> ~${blockStr} block`)
  }
  
  console.log('\n⚠️  Note: Run the game and check actual values to verify curve shape.')
  console.log('     Adjust midpointDefenseRatio in defenseConfig.ts to tune.')
}

// Run the script
try {
  const result = calculateMaxDefense()
  updateDefenseConfig(result.maxDefense)
  generateCurvePreview(result.maxDefense)
  
  console.log('\n🎉 Done! Defense config updated successfully.')
  console.log('\nNext steps:')
  console.log('  1. Check src/config/defenseConfig.ts for updated values')
  console.log('  2. Adjust curveType or midpointDefenseRatio if needed')
  console.log('  3. Test in-game to verify block % feels right')
  
} catch (error) {
  console.error('❌ Error calculating max defense:', error)
  console.error(error.stack)
  process.exit(1)
}
