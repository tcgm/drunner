import { GiSpellBook } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const MAGIC_BONUS: NexusUpgrade = {
  id: 'magic_bonus',
  name: 'Arcane Resonance',
  description: "Amplifies all heroes' base Magic.",
  icon: GiSpellBook,
  category: 'arcane',
  maxTier: 4,
  bonusPerTier: 1,
  unit: '',
  costs: [300, 800, 2000, 5000],
  color: '#D6BCFA',
}
