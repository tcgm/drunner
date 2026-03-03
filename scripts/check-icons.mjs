import * as GiIcons from 'react-icons/gi';

const iconsUsed = [
    'GiIceCube', 'GiNinjaStar', 'GiStoneBlock', 'GiCrenelCrown', 'GiVortex', 'GiSeaDragon',
    'GiWolfHead', 'GiChestArmor', 'GiMetalPlate', 'GiFireSpellCast', 'GiNinjaHead',
    'GiGargoyle', 'GiSpiderFace', 'GiDeathSkull', 'GiFrozenOrb', 'GiBat',
    'GiTwoCoins', 'GiFountain', 'GiOpenChest', 'GiDiamondHard', 'GiLockedChest',
    'GiAnvil', 'GiGoldBar', 'GiSwordsPower', 'GiTreasureMap', 'GiChestArmor',
    'GiPoisonBottle', 'GiMantrap', 'GiMagicGate', 'GiDoorHandle', 'GiStoneStack',
    'GiTempleGate', 'GiCampfire', 'GiFlowerPot', 'GiMeditation', 'GiFoxTail',
    'GiHeartBottle', 'GiShop', 'GiChemicalDrop', 'GiCrystalBall', 'GiHood',
    'GiSkeletonKey', 'GiGoblinHead', 'GiRat', 'GiCowled', 'GiTroll',
    'GiBandaged', 'GiCrossedSwords', 'GiBridge', 'GiPrisoner', 'GiDeadHead',
    'GiRuneStone', 'GiTemplarShield', 'GiSkullCrossedBones', 'GiDragonHead',
    'GiWingedSword', 'GiDevilMask', 'GiDaemonSkull'
];

const missing = [];
const found = [];

for (const icon of iconsUsed) {
    if (icon in GiIcons) {
        found.push(icon);
    } else {
        missing.push(icon);
    }
}

console.log(`\n=== Icon Check Results ===`);
console.log(`Total icons checked: ${iconsUsed.length}`);
console.log(`Found: ${found.length}`);
console.log(`Missing: ${missing.length}\n`);

if (missing.length > 0) {
    console.log('❌ MISSING ICONS:');
    missing.forEach(icon => console.log(`  - "${icon}"`));
    console.log(`\nMissing count: ${missing.length}`);
    console.log(`Missing array:`, JSON.stringify(missing, null, 2));
    process.exit(1);
} else {
    console.log('✅ All icons exist in react-icons/gi!');
    process.exit(0);
}
