import wizardTower from '@/assets/icons/wizardTower.svg';
import type { Building } from './types'

export const tower: Building = {
  id: 'tower',
  icon: wizardTower,
  sizeMultiplier: 1.5,
  label: 'Arcane Tower',
  color: '#A855F7',
  description: 'Research magic',
  disabled: true
}
