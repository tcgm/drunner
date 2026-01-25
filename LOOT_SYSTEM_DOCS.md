// Loot Integration Documentation
//
// The event system now supports multiple ways to specify item generation:
//
// 1. SIMPLE ITEM TYPES:
//    { type: 'item', itemType: 'weapon' }     // Generate any weapon
//    { type: 'item', itemType: 'random' }     // Generate any item
//
// 2. LITERAL MATERIAL IMPORTS:
//    import { STEEL, MITHRIL } from '@/data/items/materials'
//    { type: 'item', material: STEEL, itemType: 'weapon' }
//
// 3. LITERAL UNIQUE ITEM IMPORTS:
//    import { EXCALIBUR } from '@/data/items/uniques/weapons/excalibur'
//    { type: 'item', uniqueItem: EXCALIBUR }
//
// 4. WEIGHTED ITEM CHOICES:
//    {
//      type: 'item',
//      itemChoices: [
//        { weight: 70, itemType: 'weapon' },
//        { weight: 20, material: STEEL, itemType: 'armor' },
//        { weight: 10, uniqueItem: EXCALIBUR }
//      ]
//    }
//
// This provides:
// - Type safety through TypeScript imports
// - Individual file architecture support
// - Flexible probability systems  
// - Clean separation between data and logic
//
// Events are pure data definitions, item generation happens at resolution time.