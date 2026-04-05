import type { HeroClass } from '@/types'
import { REAPER } from './reaper'
import { ARCHANGEL } from './archangel'
import { ARCHDEVIL } from './archdevil'
import { TRICKSTER } from './trickster'

/** Classes exclusive to unique heroes — never assigned during random hero generation. */
export const UNIQUE_CLASSES: HeroClass[] = [REAPER, ARCHANGEL, ARCHDEVIL, TRICKSTER]
