import type { Material } from '../index'
import { GiSpellBook } from 'react-icons/gi'

export const ARCANE: Material = {
  id: 'arcane',
  name: 'Arcane',
  prefix: 'Arcane',
  rarity: 'magical',
  statMultiplier: 3.0,
  valueMultiplier: 11.0,
  description: 'Material infused with raw magical essence',
  icon: GiSpellBook,
}
