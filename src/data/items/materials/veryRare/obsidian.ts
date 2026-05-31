import type { Material } from '../index'
import { GiVolcano } from 'react-icons/gi'

export const OBSIDIAN: Material = {
  id: 'obsidian',
  name: 'Obsidian',
  prefix: 'Obsidian',
  rarity: 'veryRare',
  statMultiplier: 2.5,
  valueMultiplier: 8.0,
  description: 'Volcanic glass hardened by primordial fire',
  icon: GiVolcano,
}
