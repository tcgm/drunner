import { 
  GiSpellBook,
  GiTome,
  GiScrollUnfurled,
  GiOpenBook,
  GiBookCover,
} from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base book template - wisdom and magic power weapon
 */
export const BOOK_BASE: BaseItemTemplate = {
  description: 'A tome of ancient knowledge and power',
  type: 'weapon',
  icon: GiSpellBook,
  baseNames: ['Book', 'Tome', 'Grimoire', 'Codex', 'Manuscript'],
  baseNameIcons: {
    'Book': GiOpenBook,
    'Tome': GiTome,
    'Grimoire': GiSpellBook,
    'Codex': GiBookCover,
    'Manuscript': GiScrollUnfurled,
  },
  stats: {
    attack: 3,
    magicPower: 12,
    wisdom: 8,
  },
}
