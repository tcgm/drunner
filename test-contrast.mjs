/**
 * Test script to verify contrast ratios between adjacent rarity colors
 * WCAG AA requires 3:1 for large text and 4.5:1 for normal text
 * We're targeting 3.5:1 minimum between adjacent rarities
 */

// Rarity colors in order (MMO/RPG traditional colors with 3.5:1+ contrast)
const rarities = [
  { name: 'Junk', color: '#9CA3AF' },         // Gray (traditional)
  { name: 'Abundant', color: '#14532D' },     // Very dark green
  { name: 'Common', color: '#86EFAC' },       // Bright green (traditional)
  { name: 'Uncommon', color: '#1E3A8A' },     // Dark blue (traditional)
  { name: 'Rare', color: '#C084FC' },         // Light purple (traditional)
  { name: 'Very Rare', color: '#581C87' },    // Very dark purple
  { name: 'Magical', color: '#F0ABFC' },      // Bright fuchsia
  { name: 'Elite', color: '#881337' },        // Very dark rose
  { name: 'Epic', color: '#FBCFE8' },         // Light pink (traditional)
  { name: 'Legendary', color: '#92400E' },    // Dark amber (traditional orange)
  { name: 'Mythic', color: '#FEF08A' },       // Very bright gold (traditional)
  { name: 'Mythicc', color: '#7F1D1D' },      // Very dark red
  { name: 'Artifact', color: '#FDE68A' },     // Bright amber/gold
  { name: 'Divine', color: '#0E7490' },       // Dark cyan
  { name: 'Celestial', color: '#E0F2FE' },    // Very bright sky
  { name: 'Reality Anchor', color: '#312E81' },// Very dark indigo
  { name: 'Structural', color: '#DDD6FE' },   // Bright violet
  { name: 'Singularity', color: '#4C1D95' },  // Dark violet
  { name: 'Void', color: '#D1D5DB' },         // Light gray (void paradox)
  { name: 'Elder', color: '#7F1D1D' },        // Dark red (ancient)
  { name: 'Layer', color: '#FDE047' },        // Bright yellow
  { name: 'Plane', color: '#0C4A6E' },        // Dark blue
  { name: 'Author', color: '#FFFFFF' },       // White
]

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : null
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio
function getContrast(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// Test adjacent rarities
console.log('=== Rarity Color Contrast Analysis ===\n')
console.log('Testing contrast ratios between adjacent rarity tiers')
console.log('Target: >= 3.5:1 contrast ratio\n')

let allPass = true
let minContrast = Infinity
let maxContrast = 0
let failures = []

for (let i = 0; i < rarities.length - 1; i++) {
  const current = rarities[i]
  const next = rarities[i + 1]
  
  const contrast = getContrast(current.color, next.color)
  const pass = contrast >= 3.5
  
  if (!pass) {
    allPass = false
    failures.push({ from: current.name, to: next.name, contrast })
  }
  
  minContrast = Math.min(minContrast, contrast)
  maxContrast = Math.max(maxContrast, contrast)
  
  const status = pass ? '✓' : '✗'
  const warningLevel = contrast < 2 ? '⚠⚠⚠' : contrast < 3 ? '⚠⚠' : contrast < 3.5 ? '⚠' : ''
  
  console.log(`${status} ${current.name.padEnd(18)} → ${next.name.padEnd(18)} ${contrast.toFixed(2)}:1 ${warningLevel}`)
}

console.log('\n=== Summary ===')
console.log(`Minimum contrast: ${minContrast.toFixed(2)}:1`)
console.log(`Maximum contrast: ${maxContrast.toFixed(2)}:1`)
console.log(`All tests passed: ${allPass ? 'YES ✓' : 'NO ✗'}`)

if (failures.length > 0) {
  console.log(`\n=== Failures (${failures.length}) ===`)
  failures.forEach(f => {
    console.log(`  ${f.from} → ${f.to}: ${f.contrast.toFixed(2)}:1 (need 3.5:1)`)
  })
  console.log('\nRecommendation: Adjust these color pairs to improve contrast')
}

console.log('\n=== Individual Luminance Values ===')
rarities.forEach(r => {
  const rgb = hexToRgb(r.color)
  const lum = getLuminance(rgb.r, rgb.g, rgb.b)
  console.log(`${r.name.padEnd(18)} ${r.color} L=${lum.toFixed(4)}`)
})

// ===== TEST 2: Background Colors vs White =====
console.log('\n\n========================================');
console.log('TEST 2: Background Contrast vs White');
console.log('========================================\n');

const backgrounds = {
  Junk: '#1F2937',
  Abundant: '#052E16',
  Common: '#14532D',
  Uncommon: '#1E293B',
  Rare: '#581C87',
  VeryRare: '#3B0764',
  Magical: '#701A75',
  Elite: '#4C0519',
  Epic: '#831843',
  Legendary: '#431407',
  Mythic: '#713F12',
  Mythicc: '#450A0A',
  Artifact: '#78350F',
  Divine: '#083344',
  Celestial: '#0C4A6E',
  RealityAnchor: '#1E1B4B',
  Structural: '#4C1D95',
  Singularity: '#2E1065',
  Void: '#1F2937',
  Elder: '#450A0A',
  Layer: '#713F12',
  Plane: '#082F49',
  Author: '#000000'
};

const white = '#FFFFFF';

let allBgPass = true;
let minBgContrast = Infinity;
let maxBgContrast = 0;
let minBgRarity = '';
let maxBgRarity = '';

for (const [name, bg] of Object.entries(backgrounds)) {
  const contrast = getContrast(bg, white);
  const pass = contrast >= 3.5;
  
  if (!pass) allBgPass = false;
  
  if (contrast < minBgContrast) {
    minBgContrast = contrast;
    minBgRarity = name;
  }
  if (contrast > maxBgContrast) {
    maxBgContrast = contrast;
    maxBgRarity = name;
  }
  
  const bgRgb = hexToRgb(bg);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  console.log(`${pass ? '✓' : '✗'} ${name.padEnd(15)} ${bg} (L=${bgLuminance.toFixed(4)}) vs White: ${contrast.toFixed(2)}:1 ${pass ? '✓' : '✗ FAIL'}`);
}

console.log(`\n${allBgPass ? '✓ All background tests passed: YES ✓' : '✗ Some background tests failed ✗'}`);
console.log(`✓ Minimum background contrast: ${minBgContrast.toFixed(2)}:1 (${minBgRarity})`);
console.log(`✓ Maximum background contrast: ${maxBgContrast.toFixed(2)}:1 (${maxBgRarity})`);

console.log('\n=== OVERALL RESULT ===');
const overallPass = allPass && allBgPass;
console.log(`${overallPass ? '✓✓✓ ALL TESTS PASSED ✓✓✓' : '✗✗✗ SOME TESTS FAILED ✗✗✗'}`);

process.exit(overallPass ? 0 : 1);
