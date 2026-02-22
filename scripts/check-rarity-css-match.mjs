import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read CSS file
const cssContent = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf-8');

// Read all rarity config files
const raritiesDir = path.join(__dirname, 'src/systems/rarity/rarities');
const rarityFiles = fs.readdirSync(raritiesDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .sort();

console.log('Checking CSS colors against rarity config files...\n');

const mismatches = [];

for (const file of rarityFiles) {
  const filePath = path.join(raritiesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract rarity id from file
  const idMatch = content.match(/id:\s*'(\w+)'/);
  if (!idMatch) continue;
  
  const rarityId = idMatch[1];
  
  // Extract colors from config
  const colorMatch = content.match(/color:\s*'(#[0-9A-Fa-f]{6})'/);
  const bgColorMatch = content.match(/backgroundColor:\s*'(#[0-9A-Fa-f]{6})'/);
  const glowMatch = content.match(/glow:\s*'rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)'/);
  
  if (!colorMatch || !bgColorMatch) continue;
  
  const configColor = colorMatch[1].toUpperCase();
  const configBgColor = bgColorMatch[1].toUpperCase();
  const configGlowRgb = glowMatch ? `${glowMatch[1]}, ${glowMatch[2]}, ${glowMatch[3]}` : null;
  
  // Find CSS for this rarity
  const cssRarityRegex = new RegExp(`\\.item-slot--${rarityId}\\s*\\{[^}]*background-color:\\s*(#[0-9A-Fa-f]{6})[^}]*border-color:\\s*(#[0-9A-Fa-f]{6})[^}]*box-shadow:[^r]*rgba\\((\\d+,\\s*\\d+,\\s*\\d+)`, 'i');
  const cssMatch = cssContent.match(cssRarityRegex);
  
  if (!cssMatch) {
    console.log(`⚠️  ${rarityId}: CSS not found`);
    continue;
  }
  
  const cssBgColor = cssMatch[1].toUpperCase();
  const cssBorderColor = cssMatch[2].toUpperCase();
  const cssGlowRgb = cssMatch[3].replace(/\s/g, ' ');
  
  // Check for mismatches
  const issues = [];
  
  if (configBgColor !== cssBgColor) {
    issues.push(`BG: config=${configBgColor} css=${cssBgColor}`);
  }
  
  if (configColor !== cssBorderColor) {
    issues.push(`Border: config=${configColor} css=${cssBorderColor}`);
  }
  
  if (configGlowRgb && configGlowRgb.replace(/\s/g, ' ') !== cssGlowRgb) {
    issues.push(`Glow: config=rgba(${configGlowRgb}) css=rgba(${cssGlowRgb})`);
  }
  
  if (issues.length > 0) {
    console.log(`❌ ${rarityId}:`);
    issues.forEach(issue => console.log(`   ${issue}`));
    mismatches.push({ rarity: rarityId, issues });
  } else {
    console.log(`✅ ${rarityId}`);
  }
}

if (mismatches.length > 0) {
  console.log(`\n\n⚠️  Found ${mismatches.length} mismatches!`);
  process.exit(1);
} else {
  console.log('\n\n✅ All CSS colors match rarity configs!');
  process.exit(0);
}
