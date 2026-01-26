import { GiStiletto } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base dagger template - low attack, high speed
 */
export const DAGGER_BASE: BaseItemTemplate = {
  description: 'A quick stabbing weapon',
  type: 'weapon',
  icon: GiStiletto,
  stats: {
    attack: 6,
    speed: 4,
  },
}
