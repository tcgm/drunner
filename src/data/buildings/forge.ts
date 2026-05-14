// import { GiAnvil } from 'react-icons/gi'
import type { Building } from './types'
//import forgeIcon from '../../assets/icons/forge.svg'
import { GiAnvilImpact as forgeIcon } from 'react-icons/gi';

export const forge: Building = {
  id: 'forge',
  icon: forgeIcon,
  sizeMultiplier: 1,
  label: 'Forge',
  color: '#DC2626',
  description: 'Craft items and break down gear for material fragments',
}