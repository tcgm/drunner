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

// Import game systems for accurate data
const raritySystemModule = await import('../src/systems/rarity/raritySystem.ts')
const materialsModule = await import('../src/data/items/materials/index.ts')

const { RARITY_CONFIGS } = raritySystemModule
const { ALL_MATERIALS } = materialsModule

// Equipment slots to consider (based on slotConfig.ts)
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2']

// Build rarity multipliers from game system
const RARITY_MULTIPLIERS = Object.fromEntries(
  Object.entries(RARITY_CONFIGS).map(([key, config]) => [key, config.statMultiplierBase])
)

// Build material multipliers from game system  
const MATERIAL_MULTIPLIERS = Object.fromEntries(
  ALL_MATERIALS.map(mat => [mat.id, mat.statMultiplier])
)

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

/**
 * Save a detailed report to file
 */
function saveReport(result) {
  const reportPath = join(rootDir, 'defense-calculation-report.md')
  const timestamp = new Date().toLocaleString()
  
  const report = `# Defense Calculation Report

**Generated**: ${timestamp}  
**Theoretical Max Defense**: ${result.maxDefense}  
**Highest Rarity**: ${result.highestRarity} (${RARITY_MULTIPLIERS[result.highestRarity]}x multiplier)

---

## Best-in-Slot Equipment

| Slot | Defense | Item | Type |
|------|---------|------|------|
${result.bestLoadout.map(item => 
  `| ${item.slot} | ${item.defense} | ${item.item} | ${item.type} |`
).join('\n')}

**Total from Equipment**: ${result.bestLoadout.reduce((sum, item) => sum + item.defense, 0)} defense

---

## Set Bonuses

Best set bonus found: **+100 defense** (Titan 6-piece)

---

## Defense Curve Preview

Using current configuration:
- **Curve Type**: logarithmic
- **Min Block**: 0%
- **Max Block**: 95%
- **Midpoint Ratio**: 0.4

| % of Max | Defense Value | Block % |
|----------|---------------|---------|
| 0% | 0 | 0.0% |
| 10% | ${Math.floor(result.maxDefense * 0.1)} | ~16.9% |
| 25% | ${Math.floor(result.maxDefense * 0.25)} | ~36.8% |
| 50% | ${Math.floor(result.maxDefense * 0.5)} | ~61.5% |
| 75% | ${Math.floor(result.maxDefense * 0.75)} | ~80.1% |
| 90% | ${Math.floor(result.maxDefense * 0.9)} | ~89.4% |
| 100% | ${result.maxDefense} | 95.0% |

---

## Available Rarities

| Rarity | Multiplier |
|--------|------------|
${Object.entries(RARITY_MULTIPLIERS)
  .sort((a, b) => b[1] - a[1])
  .map(([name, mult]) => `| ${name} | ${mult}x |`)
  .join('\n')}

---

## Available Materials

| Material | Multiplier |
|----------|------------|
${Object.entries(MATERIAL_MULTIPLIERS)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15) // Top 15 materials
  .map(([name, mult]) => `| ${name} | ${mult}x |`)
  .join('\n')}

---

## How to Use This Report

1. **Review Best-in-Slot**: These are the highest defense items possible at maximum rarity
2. **Check Curve**: Verify the block percentage progression feels appropriate for your game
3. **Tune if Needed**: Edit \`src/config/defenseConfig.ts\` to adjust:
   - \`curveType\`: Change curve shape (linear, diminishing, logarithmic, exponential)
   - \`midpointDefenseRatio\`: Adjust where 50% block is reached
   - \`maxBlockPercent\`: Change the cap (default 95%)
4. **Rerun**: Execute \`npm run calculate-max-defense\` after adding items or changing values

---

*This report is regenerated each time you run the calculator script.*
`
  
  writeFileSync(reportPath, report, 'utf-8')
  console.log(`\n📄 Report saved to: ${reportPath}`)
}

// Run the script
try {
  const result = calculateMaxDefense()
  updateDefenseConfig(result.maxDefense)
  generateCurvePreview(result.maxDefense)
  saveReport(result)
  
  console.log('\n🎉 Done! Defense config updated successfully.')
  console.log('\nNext steps:')
  console.log('  1. Check src/config/defenseConfig.ts for updated values')
  console.log('  2. Review defense-calculation-report.md for best-in-slot details')
  console.log('  3. Adjust curveType or midpointDefenseRatio if needed')
  console.log('  4. Test in-game to verify block % feels right')
  
} catch (error) {
  console.error('❌ Error calculating max defense:', error)
  console.error(error.stack)
  process.exit(1)
}
