// Quick test of the upgrade function
import { upgradeItemMaterial } from './src/systems/loot/itemUpgrader.ts'

const testItem = {
  id: 'test-1',
  name: 'Silver Greaves',
  description: 'Test boots',
  type: 'boots',
  rarity: 'uncommon',
  stats: {
    maxHp: 10,
    defense: 15,
    speed: 5
  },
  value: 100,
  icon: null,
  materialId: 'silver',
  baseTemplateId: 'greaves'
}

console.log('Original item:', testItem.name)
console.log('Stats:', testItem.stats)
console.log('Value:', testItem.value)

const upgraded = upgradeItemMaterial(testItem, 10)

if (upgraded) {
  console.log('\nUpgraded item:', upgraded.name)
  console.log('Stats:', upgraded.stats)
  console.log('Value:', upgraded.value)
  console.log('Material ID:', upgraded.materialId)
} else {
  console.log('\nUpgrade failed (might be at max material)')
}
