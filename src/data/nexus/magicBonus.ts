import { GiSpellBook } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const MAGIC_BONUS: NexusUpgrade = {
  id: 'magic_bonus',
  name: 'Arcane Resonance',
  description: "Amplifies all heroes' base Magic.",
  icon: GiSpellBook,
  category: 'arcane',
  baseCost: 300,
  bonusPerTier: 1,
  unit: '',
  color: '#D6BCFA',
}
