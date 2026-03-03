import type { RarityConfig } from '@/systems/rarity/types'
import { GiCrystalEye } from 'react-icons/gi'

export const ARTIFACT: RarityConfig = {
  id: 'artifact',
  name: 'Artifact',
  percentage: 0.0001,
  color: '#FDE68A',
  backgroundColor: '#78350F',
  statMultiplierBase: 6.0,
  minFloor: 60,
  icon: GiCrystalEye,
  glow: 'rgba(253, 230, 138, 0.6)',
  text: '#FEF3C7',
  textLight: '#FFFBEB',
  bg: 'rgba(253, 230, 138, 0.1)',
  gem: '#FDE68A',
  border: '#FDE68A',
}
