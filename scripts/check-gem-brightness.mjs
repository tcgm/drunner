/**
 * Check gem color brightness and saturation
 * Ensures all gem colors meet 75% brightness and 75% saturation thresholds
 */

const gemColors = {
  junk: '#8FB3EF',
  abundant: '#8FEFB3',
  common: '#8EF0B2',
  uncommon: '#83B9FB',
  rare: '#C084FC',
  veryRare: '#C185F9',
  magical: '#F0ABFC',
  elite: '#FC8395',
  epic: '#FBCFE8',
  legendary: '#FCDA82',
  mythic: '#FEF08A',
  mythicc: '#F98585',
  artifact: '#FDE68A',
  divine: '#88E7F6',
  celestial: '#E0F2FE',
  realityAnchor: '#8792F8',
  structural: '#DDD6FE',
  singularity: '#A78BFA',
  void: '#B8D0F5',
  elder: '#F98585',
  layer: '#FEE981',
  plane: '#84D7FB',
  author: '#F6FAFE',
  set: '#8CF2E6',
  cursed: '#8FB7EF',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));
  
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

console.log('Gem Color Brightness & Saturation Check');
console.log('========================================\n');

const MIN_BRIGHTNESS = 75;
const MIN_SATURATION = 75;

const needsUpdate = [];

for (const [rarity, hex] of Object.entries(gemColors)) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const brightnessMet = hsl.l >= MIN_BRIGHTNESS;
  const saturationMet = hsl.s >= MIN_SATURATION;
  const bothMet = brightnessMet && saturationMet;
  
  const status = bothMet ? '✓' : '✗';
  
  console.log(`${status} ${rarity.padEnd(20)} ${hex}  HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`);
  
  if (!bothMet) {
    // Calculate suggested color
    const newL = Math.max(hsl.l, MIN_BRIGHTNESS);
    const newS = Math.max(hsl.s, MIN_SATURATION);
    const suggested = hslToHex(hsl.h, newS, newL);
    
    console.log(`  → Needs: L=${newL}%, S=${newS}% → ${suggested}`);
    needsUpdate.push({ rarity, current: hex, suggested, currentHsl: hsl, newHsl: { h: hsl.h, s: newS, l: newL } });
  }
}

console.log('\n========================================');
console.log(`\nSummary: ${needsUpdate.length} gem colors need updating\n`);

if (needsUpdate.length > 0) {
  console.log('Suggested updates:');
  for (const { rarity, current, suggested, currentHsl, newHsl } of needsUpdate) {
    console.log(`  ${rarity}: ${current} → ${suggested}`);
    console.log(`    HSL(${currentHsl.h}°, ${currentHsl.s}%, ${currentHsl.l}%) → HSL(${newHsl.h}°, ${newHsl.s}%, ${newHsl.l}%)`);
  }
}
