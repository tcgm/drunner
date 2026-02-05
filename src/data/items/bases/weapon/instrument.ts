import { 
  GiLyre,
  GiGuitar,
  GiViolin,
  GiBagpipes,
  GiFlute,
  GiDrum,
  GiHarp,
  GiTrumpet,
  GiPanFlute,
} from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base instrument template - magic power and charisma weapon
 */
export const INSTRUMENT_BASE: BaseItemTemplate = {
  description: 'A melodious instrument that channels magic through music',
  type: 'weapon',
  icon: GiLyre,
  baseNames: [
    'Lute',
    'Fiddle',
    'Guitar',
    'Bagpipes',
    'Flute',
    'Violin',
    'Harp',
    'Horn',
    'Lyre',
    'Mandolin',
    'Drum',
    'Pipe',
  ],
  baseNameIcons: {
    'Lute': GiLyre,
    'Fiddle': GiViolin,
    'Guitar': GiGuitar,
    'Bagpipes': GiBagpipes,
    'Flute': GiFlute,
    'Violin': GiViolin,
    'Harp': GiHarp,
    'Horn': GiTrumpet,
    'Lyre': GiLyre,
    'Mandolin': GiGuitar,
    'Drum': GiDrum,
    'Pipe': GiPanFlute,
  },
  stats: {
    attack: 4,
    magicPower: 10,
    charisma: 8,
  },
}
