export type { Building } from './types'
export type { BuildingPlacement } from './townLayout'
export { townLayout, townGridCols, townGridRowSizes, townRowDepthScale, mobileTownGridCols, mobileTownGridRowSizes } from './townLayout'
export { shop } from './shop'
export { market } from './market'
export { bank } from './bank'
export { forge } from './forge'
export { tower } from './tower'
export { nexus } from './nexus'
export { temple } from './temple'
export { castle } from './castle'
export { dungeonEntrance } from './dungeonEntrance'

import { shop } from './shop'
import { market } from './market'
import { bank } from './bank'
import { forge } from './forge'
import { tower } from './tower'
import { nexus } from './nexus'
import { temple } from './temple'

/**
 * Left-side buildings in the town hub
 */
export const leftBuildings = [shop, market, bank]

/**
 * Right-side buildings in the town hub
 */
export const rightBuildings = [forge, tower]

/**
 * Back-row (coming soon) buildings in the town hub
 */
export const backRowBuildings = [nexus, temple]

/**
 * All buildings combined
 */
export const allBuildings = [...leftBuildings, ...rightBuildings, ...backRowBuildings]
