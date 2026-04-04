import type { HeroSpecies } from '@/types'
import type { SpeciesDefinition } from './species'

type NameStyle = SpeciesDefinition['nameStyle']

const NAMES_BY_STYLE: Record<NameStyle, { first: string[]; last: string[] }> = {
  common: {
    first: [
      'Aldric', 'Brynn', 'Caelum', 'Dara', 'Edric', 'Fiona', 'Gareth', 'Hessa',
      'Ivan', 'Jessa', 'Kael', 'Lyra', 'Maren', 'Nolan', 'Oryn', 'Petra',
      'Quinn', 'Rova', 'Soren', 'Talia', 'Ulric', 'Vera', 'Wren', 'Xara',
      'Yael', 'Zane', 'Alys', 'Bram', 'Corvin', 'Dahlia',
    ],
    last: [
      'Ashford', 'Bravehart', 'Coldwell', 'Dawnwood', 'Eastwick', 'Fairborn',
      'Graystone', 'Highmore', 'Ironwood', 'Jadewing', 'Kingsley', 'Lakemore',
      'Moorfield', 'Nightfall', 'Oakhart', 'Proudfoot', 'Queensbury', 'Reedmoor',
      'Stonefist', 'Trueblood', 'Underhill', 'Valor', 'Whitlock', 'Yarrow',
    ],
  },
  elven: {
    first: [
      'Aelindra', 'Caladwen', 'Eiravel', 'Faelindë', 'Galadwen', 'Isilvara',
      'Khalindra', 'Laerindë', 'Maedhros', 'Naelindra', 'Oriandel', 'Pherindë',
      'Quenyara', 'Raewyn', 'Saerilindë', 'Taelindra', 'Vaeris', 'Wynara',
      'Aerindë', 'Belindra', 'Caerith', 'Daelindra', 'Elaris', 'Feindra',
    ],
    last: [
      'Aetherwing', 'Brightleaf', 'Crystalbow', 'Dawnwhisper', 'Evermoon',
      'Fernsilver', 'Goldleaf', 'Horizonsong', 'Ivorystar', 'Jadewing',
      'Lightweave', 'Moonwhisper', 'Nightbloom', 'Opalbreeze', 'Petalstorm',
      'Rivermist', 'Silverwind', 'Twilightmere', 'Whisperleaf',
    ],
  },
  dwarven: {
    first: [
      'Baldur', 'Brunhilde', 'Durin', 'Ebba', 'Fjolnir', 'Gunhild', 'Haldor',
      'Ingrid', 'Jorun', 'Kolbein', 'Lofnhild', 'Magnhild', 'Njord', 'Oldin',
      'Ragnhild', 'Sindra', 'Thorvald', 'Ulfhild', 'Valdis', 'Wulfric',
      'Astrid', 'Bjorn', 'Dagmar', 'Einar', 'Freya',
    ],
    last: [
      'Anvilborn', 'Boulderback', 'Copperpike', 'Deepforge', 'Emberhammer',
      'Flintrock', 'Goldbeard', 'Hearthstone', 'Ironbrow', 'Jadepick',
      'Kegbreaker', 'Lodeshard', 'Mithrilhelm', 'Orebreaker', 'Pickaxe',
      'Runeforged', 'Stonemantle', 'Thundervault', 'Understone',
    ],
  },
  orcish: {
    first: [
      'Bragh', 'Drakk', 'Gorm', 'Harduk', 'Krang', 'Morda', 'Nagrak', 'Ogar',
      'Ragna', 'Skorn', 'Thrak', 'Ugrak', 'Vark', 'Worgul', 'Xorn', 'Zargul',
      'Azha', 'Borga', 'Dura', 'Farrak', 'Gruk', 'Hurda', 'Ivrak',
    ],
    last: [
      'Axefall', 'Bloodfang', 'Crushbone', 'Deathgrip', 'Earthshaker',
      'Fleshrender', 'Grimjaw', 'Hammerfist', 'Ironhide', 'Jawbreaker',
      'Killshot', 'Lorecrusher', 'Meatgrinder', 'Nightstalker', 'Obliterator',
      'Painbringer', 'Ravager', 'Skullsmasher', 'Thunderfist',
    ],
  },
  halfling: {
    first: [
      'Aldeigh', 'Bimble', 'Corbo', 'Dimplo', 'Elspeth', 'Fimble', 'Gimble',
      'Holda', 'Isembold', 'Jemkin', 'Kembro', 'Lotho', 'Marmaduke', 'Nob',
      'Odo', 'Pimpernel', 'Rosa', 'Sharkie', 'Tildra', 'Wilco',
      'Adaline', 'Bulbo', 'Cora', 'Drogo', 'Esme',
    ],
    last: [
      'Applebottom', 'Brandybuck', 'Cloverdale', 'Dustyfoot', 'Elderberry',
      'Frogmorton', 'Goodbarrel', 'Haybottom', 'Ironhole', 'Jollybottom',
      'Kettlebrook', 'Lightfoot', 'Marshpool', 'Nimblefingers', 'Overhill',
      'Proudneck', 'Quickwater', 'Rivercross', 'Sandybank', 'Tuckborough',
    ],
  },
  gnomish: {
    first: [
      'Alverik', 'Bimblebrix', 'Clax', 'Dabbrix', 'Elgrix', 'Frippet', 'Giggrix',
      'Hibblix', 'Izzard', 'Jixle', 'Kwicket', 'Luppix', 'Merrix', 'Nockle',
      'Orrix', 'Plix', 'Quibble', 'Razzle', 'Snazzle', 'Tinker',
      'Alwick', 'Brix', 'Cobble', 'Drix', 'Elwick',
    ],
    last: [
      'Boltcrank', 'Copperwhistle', 'Dashsprocket', 'Electrobright', 'Flickergear',
      'Gizmonix', 'Hammerwick', 'Inventspark', 'Jadegadget', 'Klankspring',
      'Leverbolt', 'Mechwright', 'Niftydrive', 'Orbspring', 'Pistonwick',
      'Quicksprocket', 'Ratchetrick', 'Sparkwright', 'Togglewick',
    ],
  },
  infernal: {
    first: [
      'Amdusias', 'Belethis', 'Caim', 'Daeva', 'Eligos', 'Forneus', 'Gamigin',
      'Haures', 'Ipos', 'Jezalara', 'Karax', 'Lucifuge', 'Malphas', 'Naberius',
      'Orobas', 'Phenex', 'Raum', 'Scox', 'Umbral', 'Vassago',
      'Asmodea', 'Bael', 'Crocell', 'Decarabia', 'Elias',
    ],
    last: [
      'Ashborne', 'Blazewrath', 'Cinderveil', 'Doomcinder', 'Emberscar',
      'Flamehart', 'Grimfire', 'Hellspawn', 'Infernis', 'Jadecinder',
      'Klawmark', 'Lichfire', 'Moltenmark', 'Nightfire', 'Obsidianborn',
      'Pyreborn', 'Ridgecinder', 'Scorchmark', 'Tartarean',
    ],
  },
  celestial: {
    first: [
      'Aerith', 'Brielle', 'Caelestis', 'Divara', 'Etheris', 'Felindra', 'Gloriel',
      'Halcyon', 'Imara', 'Juris', 'Kaelindra', 'Lumina', 'Mirael', 'Nalindra',
      'Orindel', 'Pyris', 'Quelindra', 'Radiel', 'Solara', 'Telindra',
      'Arandel', 'Belarius', 'Celestia', 'Dawniel', 'Elara',
    ],
    last: [
      'Brightmantle', 'Celestward', 'Dawnbringer', 'Ethereal', 'Faithborn',
      'Gloryfire', 'Holyward', 'Illuminar', 'Jadehalo', 'Kindlestar',
      'Lightborn', 'Miracleward', 'Nobleheart', 'Opalwing', 'Pureflame',
      'Radiantborn', 'Sacredfire', 'Truthseeker', 'Valorborn',
    ],
  },
}

const STYLE_BY_SPECIES: Record<HeroSpecies, NameStyle> = {
  human: 'common',
  elf: 'elven',
  dwarf: 'dwarven',
  orc: 'orcish',
  halfling: 'halfling',
  gnome: 'gnomish',
  tiefling: 'infernal',
  aasimar: 'celestial',
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function generateHeroName(species: HeroSpecies, rng: () => number = Math.random): string {
  const style = STYLE_BY_SPECIES[species]
  const pool = NAMES_BY_STYLE[style]
  return `${pick(pool.first, rng)} ${pick(pool.last, rng)}`
}
