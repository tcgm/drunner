import { GiMaceHead } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base mace template - blunt weapon
 */
export const MACE_BASE: BaseItemTemplate = {
  description: 'A crushing bludgeoning weapon',
  type: 'weapon',
  icon: GiMaceHead,
  stats: {
    attack: 11,
    defense: 2,
  },
}
