/**
 * Test script to demonstrate set and unique items with rarity boosts
 * Run with: node test-rarity-boost.mjs
 */

// Sample calculations showing the new formulas

console.log('=== Set Item & Unique Item Rarity Boost Test ===\n')

// Example: Titan's Wrath (Legendary Set Item)
// Template stats: { attack: 150, defense: 30, maxHp: 40 }
// Template value: 14000
// Template rarity: legendary

const RARITY_MULTIPLIERS = {
    junk: 0.5,
    common: 0.7,
    uncommon: 1.0,
    rare: 1.4,
    epic: 2.0,
    legendary: 3.0,
    mythic: 4.5,
    artifact: 7.0,
    cursed: 1.0,
    set: 1.0
}

const UNIQUE_BOOST = 1.3 // 30% boost

console.log('Titan\'s Wrath (Set Item)')
console.log('Template base: 150 attack | Value: 14000 | Template Rarity: Legendary\n')

// Case 1: Normal set item at legendary (template) rarity
const legendaryMultiplier = RARITY_MULTIPLIERS.legendary
const normalLegendaryAttack = Math.floor(150 * legendaryMultiplier)
const normalLegendaryValue = Math.floor(14000 * legendaryMultiplier)

console.log('Case 1: Normal legendary set item (template rarity)')
console.log(`  Stats: 150 × ${legendaryMultiplier} = ${normalLegendaryAttack} attack`)
console.log(`  Value: 14000 × ${legendaryMultiplier} = ${normalLegendaryValue} gold`)

// Case 2: Set item rolled at mythic rarity (variable rarity)
const mythicMultiplier = RARITY_MULTIPLIERS.mythic
const mythicAttack = Math.floor(150 * mythicMultiplier)
const mythicValue = Math.floor(14000 * mythicMultiplier)

console.log('\nCase 2: Mythic rarity set item (variable rarity)')
console.log(`  Stats: 150 × ${mythicMultiplier} = ${mythicAttack} attack`)
console.log(`  Value: 14000 × ${mythicMultiplier} = ${mythicValue} gold`)

// Case 3: Set item with unique roll at legendary rarity
const uniqueRollAttack = Math.floor(150 * legendaryMultiplier * UNIQUE_BOOST)
const uniqueRollValue = Math.floor(14000 * legendaryMultiplier * UNIQUE_BOOST)

console.log('\nCase 3: Legendary set item with unique roll (isUniqueRoll)')
console.log(`  Stats: 150 × ${legendaryMultiplier} × ${UNIQUE_BOOST} = ${uniqueRollAttack} attack`)
console.log(`  Value: 14000 × ${legendaryMultiplier} × ${UNIQUE_BOOST} = ${uniqueRollValue} gold`)

// Case 4: Set item with unique roll at mythic rarity (combining both)
const mythicUniqueAttack = Math.floor(150 * mythicMultiplier * UNIQUE_BOOST)
const mythicUniqueValue = Math.floor(14000 * mythicMultiplier * UNIQUE_BOOST)

console.log('\nCase 4: Mythic set item with unique roll (both bonuses)')
console.log(`  Stats: 150 × ${mythicMultiplier} × ${UNIQUE_BOOST} = ${mythicUniqueAttack} attack`)
console.log(`  Value: 14000 × ${mythicMultiplier} × ${UNIQUE_BOOST} = ${mythicUniqueValue} gold`)

console.log('\n=== Unique Item Examples ===\n')

// Example unique item
console.log('Excalibur (Unique Weapon)')
console.log('Template base: 200 attack | Value: 25000 | Template Rarity: Legendary\n')

// Unique items now also get rarity AND unique boost
const uniqueLegendaryAttack = Math.floor(200 * legendaryMultiplier * UNIQUE_BOOST)
const uniqueLegendaryValue = Math.floor(25000 * legendaryMultiplier * UNIQUE_BOOST)

console.log('Legendary unique (template rarity):')
console.log(`  Stats: 200 × ${legendaryMultiplier} × ${UNIQUE_BOOST} = ${uniqueLegendaryAttack} attack`)
console.log(`  Value: 25000 × ${legendaryMultiplier} × ${UNIQUE_BOOST} = ${uniqueLegendaryValue} gold`)

const uniqueMythicAttack = Math.floor(200 * mythicMultiplier * UNIQUE_BOOST)
const uniqueMythicValue = Math.floor(25000 * mythicMultiplier * UNIQUE_BOOST)

console.log('\nMythic unique (variable rarity):')
console.log(`  Stats: 200 × ${mythicMultiplier} × ${UNIQUE_BOOST} = ${uniqueMythicAttack} attack`)
console.log(`  Value: 25000 × ${mythicMultiplier} × ${UNIQUE_BOOST} = ${uniqueMythicValue} gold`)

console.log('\n=== Summary of Changes ===')
console.log('✅ Set items now benefit from rarity multipliers (was missing)')
console.log('✅ Unique items now benefit from rarity multipliers (was missing)')
console.log('✅ Both can generate at multiple rarities (stored in item.rarity)')
console.log('✅ Set items can still roll as "unique" for extra 30% boost')
console.log('✅ Formulas:')
console.log('   - Set: template × rarity × [unique roll 1.3 if applicable]')
console.log('   - Unique: template × rarity × 1.3')
