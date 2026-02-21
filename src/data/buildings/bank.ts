import { GiBank, GiChest } from 'react-icons/gi'
import type { Building } from './types'

export const bank: Building = {
  id: 'bank',
  icon: GiBank,
  label: 'Bank',
  color: '#3B82F6',
  description: 'Store your items',
  disabled: false
}
