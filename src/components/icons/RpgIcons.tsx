/**
 * RPG Awesome Icon Components
 * Wraps rpg-awesome icon font in React components for type-safe usage
 * Usage identical to react-icons: import { RaSword } from '@/components/icons/RpgIcons'
 */

interface RpgIconProps {
  className?: string
  style?: React.CSSProperties
}

const createIcon = (name: string) => (props: RpgIconProps) =>
  <i className={`ra ra-${name}`} {...props} />

// ============================================================================
// WEAPON BASE ICONS
// ============================================================================

export const RaSword = createIcon('sword')
export const RaAxe = createIcon('axe')
export const RaDagger = createIcon('aware-dagger')
export const RaStaff = createIcon('large-hammer') // closest to staff
export const RaWand = createIcon('fire-spell') // closest to wand
export const RaBow = createIcon('bow-arrow')
export const RaMace = createIcon('flanged-mace')

// ============================================================================
// ARMOR BASE ICONS
// ============================================================================

export const RaPlateArmor = createIcon('heavy-armor')
export const RaChainmail = createIcon('chainmail')
export const RaVest = createIcon('vest')
export const RaRobe = createIcon('robe')

// ============================================================================
// HELMET BASE ICONS
// ============================================================================

export const RaHelmet = createIcon('helmet')
export const RaHood = createIcon('hood')
export const RaCrown = createIcon('crown')

// ============================================================================
// BOOTS BASE ICONS
// ============================================================================

export const RaBoots = createIcon('boots')
export const RaGreaves = createIcon('metal-boot')
export const RaSandals = createIcon('wood-shoes') // closest match

// ============================================================================
// ACCESSORY BASE ICONS
// ============================================================================

export const RaRing = createIcon('ring')
export const RaAmulet = createIcon('amulet')
export const RaCharm = createIcon('relic-blade') // closest to charm/talisman
export const RaTalisman = createIcon('talisman')

// ============================================================================
// MATERIAL ICONS (Junk)
// ============================================================================

export const RaRusty = createIcon('broken-shield')
export const RaBroken = createIcon('broken-bone')
export const RaWorn = createIcon('cracked-shield')

// ============================================================================
// MATERIAL ICONS (Common)
// ============================================================================

export const RaIron = createIcon('metal-bar')
export const RaLeather = createIcon('vest')
export const RaBronze = createIcon('perspective-dice-one') // no direct match

// ============================================================================
// MATERIAL ICONS (Uncommon)
// ============================================================================

export const RaSteel = createIcon('anvil')
export const RaReinforcedLeather = createIcon('leather-armor')
export const RaSilver = createIcon('lightning-bolt') // represents shine/quality

// ============================================================================
// MATERIAL ICONS (Rare)
// ============================================================================

export const RaMithril = createIcon('gem')
export const RaDragonscale = createIcon('dragon-head')
export const RaEnchanted = createIcon('crystal-wand')

// ============================================================================
// MATERIAL ICONS (Epic)
// ============================================================================

export const RaAdamantine = createIcon('crystal-ball')
export const RaCelestial = createIcon('sun')
export const RaDemon = createIcon('death-skull')

// ============================================================================
// MATERIAL ICONS (Legendary)
// ============================================================================

export const RaDivine = createIcon('two-souls') // represents divine/holy
export const RaAncient = createIcon('lightning-trio')
export const RaVoid = createIcon('skull-crossed-bones')

// ============================================================================
// MATERIAL ICONS (Mythic)
// ============================================================================

export const RaPrimordial = createIcon('fire-bomb') // represents primal energy
export const RaCosmic = createIcon('lightning-storm')
export const RaEternal = createIcon('solar-symbol')

// ============================================================================
// UNIQUE WEAPON ICONS
// ============================================================================

export const RaExcalibur = createIcon('angel-wings')
export const RaShadowfang = createIcon('boss-key')
export const RaDawnbreaker = createIcon('sun')
export const RaFrostmourne = createIcon('ice-sword')
export const RaThunderfury = createIcon('lightning-sword')
export const RaSoulreaper = createIcon('death-skull')
export const RaInfinityEdge = createIcon('large-hammer')

// ============================================================================
// UNIQUE ARMOR ICONS
// ============================================================================

export const RaAegisOfTheImmortal = createIcon('shield')
export const RaDragonheartPlate = createIcon('dragon')
export const RaTitansBulwark = createIcon('tower-shield')
export const RaShadowweaveCloak = createIcon('cape')
export const RaCelestialRaiment = createIcon('leaf-armor')

// ============================================================================
// UNIQUE HELMET ICONS
// ============================================================================

export const RaCrownOfTheLichKing = createIcon('crown')
export const RaMindBreaker = createIcon('skull-crossed-bones')
export const RaHelmOfEternalGuardian = createIcon('doubled-shield')
export const RaVisageOfTheVoid = createIcon('death-zone')

// ============================================================================
// UNIQUE BOOTS ICONS
// ============================================================================

export const RaHermesSandals = createIcon('winged-scepter')
export const RaBootsOfWindWalker = createIcon('feathered-wing')
export const RaEarthshakerGreaves = createIcon('earth-spit')
export const RaBootsOfEndlessJourney = createIcon('boot-stomp')

// ============================================================================
// UNIQUE ACCESSORY ICONS
// ============================================================================

export const RaRingOfOmnipotence = createIcon('round-gem')
export const RaAmuletOfResurrection = createIcon('angel-wings')
export const RaCharmOfInfiniteFortune = createIcon('cash')
export const RaBandOfTheArchmage = createIcon('fairy-wand')
export const RaPendantOfTheWarrior = createIcon('necklace')
export const RaEyeOfTheStorm = createIcon('lightning-storm')
export const RaHeartOfThePhoenix = createIcon('fire-shield')
