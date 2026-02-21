# Boss Damage Report

Generated: 2026-02-21 04:52:36  |  Mode: **DRY RUN**

## Config

| Setting | Value |
|---------|-------|
| Defense curve | exponential |
| maxDefense | 33760 |
| midpointDefenseRatio | 0.15 |
| floorBossDamageScaling | 0.45 |
| Hero maxLevel | 20 |
| maxFloors | 100 |

## Tiers

| Tier | MidFloor | TargetHP% | GearDef% | GearRaw | EstDef | Block% | AllBase | SingBase |
|------|----------|-----------|----------|---------|--------|--------|---------|----------|
| F1-9 | 5 | 15% | 0.0% | 0 | 1 | 0.0% | 3 | 2 |
| F10-19 | 15 | 18% | 0.5% | 169 | 173 | 2.2% | 2 | 2 |
| F20-29 | 25 | 21% | 1.5% | 506 | 513 | 6.4% | 2 | 1 |
| F30-39 | 35 | 24% | 3.5% | 1182 | 1190 | 14.3% | 2 | 2 |
| F40-49 | 45 | 28% | 7.0% | 2363 | 2374 | 26.4% | 3 | 2 |
| F50-59 | 55 | 32% | 13.0% | 4389 | 4403 | 43.0% | 4 | 3 |
| F60-69 | 65 | 37% | 23.0% | 7765 | 7781 | 62.3% | 6 | 4 |
| F70-79 | 75 | 42% | 38.0% | 12829 | 12848 | 78.6% | 11 | 9 |
| F80-89 | 85 | 47% | 62.0% | 20931 | 20952 | 89.6% | 26 | 19 |
| F90-99 | 95 | 52% | 100.0% | 33760 | 33784 | 94.1% | 49 | 36 |

## Bosses

| File | Title | Floor | Status | AllBase | SingBase | Changes |
|------|-------|-------|--------|---------|----------|---------|
| src/data/events/boss/intro/giantBat.ts | Giant Bat | 1 | CHANGE | 8 | 6 | 11→6(fastest), 17→8(all) |
| src/data/events/boss/intro/giantRat.ts | Giant Rat | 1 | CHANGE | 8 | 6 | 10→6(random), 15→8(all) |
| src/data/events/boss/intro/giantSlime.ts | Giant Slime | 1 | CHANGE | 8 | 6 | 6→8(all), 9→6(random), 14→8(all) |
| src/data/events/boss/intro/goblinChief.ts | Goblin Chief | 1 | CHANGE | 8 | 6 | 12→6(strongest), 18→8(all) |
| src/data/events/boss/intro/rabidWolf.ts | Rabid Wolf | 1 | CHANGE | 8 | 6 | 11→8(all), 16→8(all) |
| src/data/events/boss/intro/rogueApprentice.ts | Rogue Apprentice | 1 | CHANGE | 8 | 6 | 10→6(random), 16→8(all) |
| src/data/events/boss/intro/wildBoar.ts | Wild Boar | 1 | CHANGE | 8 | 6 | 13→6(strongest), 19→8(all) |
| src/data/events/boss/intro/zombieBrute.ts | Zombie Brute | 1 | CHANGE | 8 | 6 | 9→8(all), 15→6(weakest), 20→8(all) |
| src/data/events/boss/normal/corruptedBear.ts | Corrupted Bear | 3 | CHANGE | 4 | 3 | 20→4(all), 28→4(all) |
| src/data/events/boss/normal/skeletal_champion.ts | Skeletal Champion | 4 | CHANGE | 3 | 2 | 12→3(all), 22→2(random), 30→3(all) |
| src/data/events/boss/normal/goblinWarlord.ts | Goblin Warlord | 5 | CHANGE | 3 | 2 | 20→3(all), 18→2(weakest), 27→3(all) |
| src/data/events/boss/normal/rottenTroll.ts | Rotten Troll | 5 | CHANGE | 3 | 2 | 15→2(strongest), 18→3(all), 25→3(all) |
| src/data/events/boss/normal/undeadChampion.ts | Undead Champion | 5 | CHANGE | 3 | 2 | 25→3(all), 15→2(random), 20→3(all), 35→3(all) |
| src/data/events/boss/normal/banditKing.ts | Bandit King | 6 | CHANGE | 3 | 2 | 22→2(strongest), 29→3(all) |
| src/data/events/boss/normal/shadowStalker.ts | Shadow Stalker | 6 | CHANGE | 3 | 2 | 24→2(random), 20→3(all), 32→3(all) |
| src/data/events/boss/normal/dragonWyrmling.ts | Young Dragon | 7 | CHANGE | 2 | 2 | 30→2(all), 25→2(all), 40→2(all) |
| src/data/events/boss/normal/earthElemental.ts | Earth Elemental | 7 | CHANGE | 2 | 2 | 23→2(weakest), 34→2(all) |
| src/data/events/boss/normal/venomousHydra.ts | Venomous Hydra | 7 | CHANGE | 2 | 2 | 22→2(all), 25→2(strongest), 35→2(all) |
| src/data/events/boss/normal/demonLord.ts | Lesser Demon Lord | 8 | CHANGE | 2 | 2 | 30→2(all), 25→2(all), 20→2(all), 45→2(all) |
| src/data/events/boss/normal/giantSpiderQueen.ts | Giant Spider Queen | 8 | CHANGE | 2 | 2 | 25→2(random), 21→2(all), 33→2(all) |
| src/data/events/boss/normal/minotaurGuardian.ts | Minotaur Guardian | 8 | CHANGE | 2 | 2 | 22→2(all), 26→2(random), 40→2(all) |
| src/data/events/boss/normal/shadowAssassin.ts | Shadow Assassin | 8 | CHANGE | 2 | 2 | 25→2(random), 25→2(all), 28→2(all), 38→2(all) |
| src/data/events/boss/normal/ancientLich.ts | Ancient Lich | 9 | CHANGE | 2 | 1 | 50→2(all), 20→2(all), 25→2(all), 30→2(all) |
| src/data/events/boss/normal/direWolfAlpha.ts | Dire Wolf Alpha | 9 | CHANGE | 2 | 1 | 15→2(all), 19→1(weakest), 31→2(all) |
| src/data/events/boss/normal/vampireLord.ts | Vampire Lord | 9 | CHANGE | 2 | 1 | 28→1(strongest), 24→2(all), 38→2(all) |
| src/data/events/boss/normal/dungeonGuardian.ts | Dungeon Guardian | 10 | CHANGE | 3 | 2 | 35→3(all), 25→3(all), 30→3(all), 50→3(all) |
| src/data/events/boss/normal/frostTitan.ts | Frost Titan | 10 | CHANGE | 3 | 2 | 20→2(random), 30→3(all), 25→3(all), 40→3(all) |
| src/data/events/boss/normal/mirrorWraith.ts | Mirror Wraith | 10 | CHANGE | 3 | 2 | 20→3(all), 26→2(random), 36→3(all) |
| src/data/events/boss/normal/necromancerAdept.ts | Necromancer Adept | 10 | CHANGE | 3 | 2 | 20→3(all), 27→2(weakest), 37→3(all) |
| src/data/events/boss/normal/dungeonMimic.ts | Ancient Mimic Lord | 12 | CHANGE | 2 | 2 | 38→2(all), 47→2(weakest), 62→2(all) |
| src/data/events/boss/normal/wailingBanshee.ts | Wailing Banshee | 12 | CHANGE | 2 | 2 | 50→2(weakest), 44→2(all), 72→2(all) |
| src/data/events/boss/normal/mantisHunter.ts | Mantis Hunter | 13 | CHANGE | 2 | 2 | 60→2(random), 54→2(weakest), 75→2(all) |
| src/data/events/boss/normal/serpentPriest.ts | Serpent Priest | 13 | CHANGE | 2 | 2 | 42→2(all), 49→2(weakest), 69→2(all) |
| src/data/events/boss/normal/cursedPaladin.ts | Cursed Paladin | 14 | CHANGE | 2 | 1 | 56→1(random), 46→2(all), 71→2(all) |
| src/data/events/boss/normal/flameSalamander.ts | Flame Salamander | 14 | CHANGE | 2 | 1 | 52→1(strongest), 48→2(all), 65→2(all) |
| src/data/events/boss/normal/corruptedTreant.ts | Corrupted Treant | 15 | CHANGE | 2 | 2 | 59→2(strongest), 76→2(all) |
| src/data/events/boss/normal/golemConstruct.ts | Golem Construct | 15 | CHANGE | 2 | 2 | 53→2(random), 45→2(all), 53→2(all), 75→2(all) |
| src/data/events/boss/normal/iceWraith.ts | Frost Wraith King | 15 | CHANGE | 2 | 2 | 53→2(all), 50→2(all), 68→2(all) |
| src/data/events/boss/normal/crystalHorror.ts | Crystal Horror | 16 | CHANGE | 2 | 1 | 55→1(random), 45→2(all), 70→2(all) |
| src/data/events/boss/normal/oozeSovereign.ts | Ooze Sovereign | 16 | CHANGE | 2 | 1 | 64→2(all), 58→2(all), 80→2(all) |
| src/data/events/boss/normal/phaseSpider.ts | Phase Spider | 16 | CHANGE | 2 | 1 | 45→2(all), 48→1(random), 66→2(all) |
| src/data/events/boss/normal/clockworkSentinel.ts | Clockwork Sentinel | 17 | CHANGE | 2 | 1 | 52→1(random), 48→2(all), 67→2(all) |
| src/data/events/boss/normal/ironColossus.ts | Iron Colossus | 17 | CHANGE | 2 | 1 | 63→1(random), 56→2(all), 79→2(all) |
| src/data/events/boss/normal/beholderSpawn.ts | Beholder Spawn | 18 | CHANGE | 2 | 1 | 58→1(strongest), 52→2(all), 73→2(all) |
| src/data/events/boss/normal/boundDemon.ts | Bound Demon | 18 | CHANGE | 2 | 1 | 62→1(random), 55→2(all), 83→2(all) |
| src/data/events/boss/normal/stormDjinn.ts | Storm Djinn | 18 | CHANGE | 2 | 1 | 61→1(weakest), 54→2(all), 77→2(all) |
| src/data/events/boss/normal/centaurChampion.ts | Centaur Champion | 19 | CHANGE | 2 | 1 | 57→1(random), 53→1(strongest), 74→2(all) |
| src/data/events/boss/normal/drakeMatriarch.ts | Drake Matriarch | 19 | CHANGE | 2 | 1 | 62→1(strongest), 78→2(all) |
| src/data/events/boss/normal/voidCultist.ts | Void Cultist | 20 | CHANGE | 2 | 2 | 60→2(random), 53→2(all), 60→2(all), 83→2(all) |
| src/data/events/boss/normal/airElementalLord.ts | Air Elemental Lord | 22 | CHANGE | 2 | 1 | 84→1(weakest), 75→2(all), 118→2(all) |
| src/data/events/boss/normal/ironMaiden.ts | Iron Maiden | 22 | CHANGE | 2 | 1 | 94→2(all), 80→1(weakest), 128→2(all) |
| src/data/events/boss/normal/webWeaver.ts | Web Weaver | 22 | CHANGE | 2 | 1 | 88→1(weakest), 82→2(all), 120→2(all) |
| src/data/events/boss/normal/bladeDancer.ts | Blade Dancer | 23 | CHANGE | 2 | 1 | 86→1(weakest), 78→1(random), 122→2(all) |
| src/data/events/boss/normal/rustMonsterAlpha.ts | Rust Monster Alpha | 23 | CHANGE | 2 | 1 | 92→1(random), 85→2(all), 132→2(all) |
| src/data/events/boss/normal/krakenSpawn.ts | Kraken Spawn | 24 | CHANGE | 2 | 1 | 82→2(all), 90→1(strongest), 126→2(all) |
| src/data/events/boss/normal/phantomLegion.ts | Phantom Legion | 24 | CHANGE | 2 | 1 | 98→1(random), 88→2(all), 130→2(all) |
| src/data/events/boss/normal/elderHydra.ts | Elder Hydra | 25 | CHANGE | 2 | 1 | 113→1(random), 100→2(all), 113→2(all), 150→2(all) |
| src/data/events/boss/normal/shadowTwin.ts | Shadow Twin | 25 | CHANGE | 2 | 1 | 85→2(all), 92→1(random), 125→2(all) |
| src/data/events/boss/normal/skeletalTyrant.ts | Skeletal Tyrant | 25 | CHANGE | 2 | 1 | 100→1(strongest), 92→2(all), 137→2(all) |
| src/data/events/boss/normal/infernalChampion.ts | Infernal Champion | 26 | CHANGE | 2 | 1 | 98→1(random), 88→2(all), 134→2(all) |
| src/data/events/boss/normal/mindFlayer.ts | Mind Flayer | 26 | CHANGE | 2 | 1 | 95→1(weakest), 102→1(random), 138→2(all) |
| src/data/events/boss/normal/plagueBearer.ts | Plague Bearer | 26 | CHANGE | 2 | 1 | 107→2(all), 100→2(all), 143→2(all) |
| src/data/events/boss/normal/berserkerKing.ts | Berserker King | 27 | CHANGE | 2 | 1 | 115→2(all), 108→1(strongest), 142→2(all) |
| src/data/events/boss/normal/fallenAngel.ts | Fallen Angel | 27 | CHANGE | 2 | 1 | 105→1(strongest), 90→2(all), 140→2(all) |
| src/data/events/boss/normal/magmaTitan.ts | Magma Titan | 28 | CHANGE | 2 | 1 | 110→2(all), 105→2(all), 145→2(all) |
| src/data/events/boss/normal/voidHorror.ts | Void Horror | 28 | CHANGE | 2 | 1 | 105→1(weakest), 98→2(all), 135→2(all) |
| src/data/events/boss/normal/crystalDragon.ts | Crystal Dragon | 29 | CHANGE | 2 | 1 | 118→1(strongest), 118→1(strongest), 108→2(all), 108→2(all), 150→2(all), 150→2(all) |
| src/data/events/boss/normal/graniteJuggernaut.ts | Granite Juggernaut | 29 | CHANGE | 2 | 1 | 95→2(all), 112→1(strongest), 148→2(all) |
| src/data/events/boss/normal/valkyrieHuntress.ts | Valkyrie Huntress | 29 | CHANGE | 2 | 1 | 95→2(all), 113→1(strongest), 146→2(all) |
| src/data/events/boss/normal/caveTrollKing.ts | Cave Troll King | 31 | CHANGE | 2 | 2 | 155→2(strongest), 138→2(weakest), 180→2(all) |
| src/data/events/boss/normal/toxicAbomination.ts | Toxic Abomination | 31 | CHANGE | 2 | 2 | 130→2(all), 125→2(weakest), 165→2(all) |
| src/data/events/boss/normal/earthquakeTitan.ts | Earthquake Titan | 32 | CHANGE | 2 | 2 | 152→2(random), 132→2(all), 172→2(all) |
| src/data/events/boss/normal/spectralLord.ts | Spectral Lord | 33 | CHANGE | 2 | 1 | 142→1(random), 128→2(all), 168→2(all) |
| src/data/events/boss/normal/whirlwindAssassin.ts | Whirlwind Assassin | 33 | CHANGE | 2 | 1 | 142→1(weakest), 135→2(all), 170→2(all) |
| src/data/events/boss/normal/obsidianKnight.ts | Obsidian Knight | 34 | CHANGE | 2 | 1 | 138→2(all), 148→1(strongest), 176→2(all) |
| src/data/events/boss/normal/twinHeadedDrake.ts | Twin-Headed Drake | 34 | CHANGE | 2 | 1 | 148→1(strongest), 138→1(weakest), 175→2(all) |
| src/data/events/boss/normal/abyssalKraken.ts | Abyssal Kraken | 35 | CHANGE | 2 | 2 | 175→2(random), 125→2(all), 150→2(all), 200→2(all) |
| src/data/events/boss/normal/realityRipper.ts | Reality Ripper | 35 | CHANGE | 2 | 2 | 150→2(weakest), 140→2(all), 178→2(all) |
| src/data/events/boss/normal/bladeMaster.ts | Blade Master | 36 | CHANGE | 2 | 2 | 162→2(strongest), 145→2(random), 186→2(all) |
| src/data/events/boss/normal/darkProphet.ts | Dark Prophet | 36 | CHANGE | 2 | 2 | 142→2(all), 145→2(weakest), 185→2(all) |
| src/data/events/boss/normal/gorgonMatriarch.ts | Gorgon Matriarch | 36 | CHANGE | 2 | 2 | 155→2(weakest), 135→2(all), 182→2(all) |
| src/data/events/boss/normal/archmageLich.ts | Archmage Lich | 37 | CHANGE | 2 | 1 | 158→1(random), 145→2(all), 188→2(all) |
| src/data/events/boss/normal/armoredBehemoth.ts | Armored Behemoth | 37 | CHANGE | 2 | 1 | 172→1(weakest), 158→1(random), 202→2(all) |
| src/data/events/boss/normal/phoenixChampion.ts | Phoenix Champion | 38 | CHANGE | 2 | 1 | 168→1(strongest), 155→2(all), 198→2(all) |
| src/data/events/boss/normal/siegeAutomaton.ts | Siege Automaton | 38 | CHANGE | 2 | 1 | 160→1(strongest), 148→1(random), 190→2(all) |
| src/data/events/boss/normal/deathKnightCommander.ts | Death Knight Commander | 39 | CHANGE | 2 | 1 | 165→1(random), 152→2(all), 195→2(all) |
| src/data/events/boss/normal/starbornHorror.ts | Starborn Horror | 39 | CHANGE | 2 | 1 | 162→2(all), 150→2(all), 192→2(all) |
| src/data/events/boss/normal/warlockOverlord.ts | Warlock Overlord | 39 | CHANGE | 2 | 1 | 170→1(weakest), 157→2(all), 200→2(all) |
| src/data/events/boss/normal/harpyQueen.ts | Harpy Queen | 41 | CHANGE | 3 | 2 | 205→3(all), 215→2(weakest), 285→3(all) |
| src/data/events/boss/normal/jungleTitan.ts | Jungle Titan | 41 | CHANGE | 3 | 2 | 245→2(strongest), 222→3(all), 295→3(all) |
| src/data/events/boss/normal/astralDreadnought.ts | Astral Dreadnought | 42 | CHANGE | 3 | 2 | 252→2(strongest), 225→3(all), 300→3(all) |
| src/data/events/boss/normal/crystallineSentinel.ts | Crystalline Sentinel | 42 | CHANGE | 3 | 2 | 175→3(all), 140→3(all), 210→3(all) |
| src/data/events/boss/normal/martyredSaint.ts | Martyred Saint | 42 | CHANGE | 3 | 2 | 262→2(strongest), 235→3(all), 308→3(all) |
| src/data/events/boss/normal/nightmareTyrant.ts | Nightmare Tyrant | 43 | CHANGE | 2 | 2 | 232→2(weakest), 220→2(all), 295→2(all) |
| src/data/events/boss/normal/timeEater.ts | Time Eater | 43 | CHANGE | 2 | 2 | 210→2(all), 218→2(weakest), 290→2(all) |
| src/data/events/boss/normal/clockworkEmperor.ts | Clockwork Emperor | 44 | CHANGE | 2 | 2 | 270→2(strongest), 245→2(weakest), 320→2(all) |
| src/data/events/boss/normal/plagueDragon.ts | Plague Dragon | 44 | CHANGE | 2 | 2 | 255→2(all), 255→2(all), 240→2(all), 240→2(all), 315→2(all), 315→2(all) |
| src/data/events/boss/normal/chaosHerald.ts | Chaos Herald | 45 | CHANGE | 3 | 2 | 248→3(all), 280→3(all), 345→2(random) |
| src/data/events/boss/normal/prismGuardian.ts | Prism Guardian | 45 | CHANGE | 3 | 2 | 265→2(strongest), 272→2(random), 325→3(all) |
| src/data/events/boss/normal/arcaneArtillery.ts | Arcane Artillery | 46 | CHANGE | 3 | 2 | 278→2(strongest), 260→3(all), 328→3(all) |
| src/data/events/boss/normal/elderBrain.ts | Elder Brain | 46 | CHANGE | 3 | 2 | 275→2(strongest), 258→2(random), 310→3(all) |
| src/data/events/boss/normal/stormLich.ts | Storm Lich | 46 | CHANGE | 3 | 2 | 228→3(all), 242→3(all), 305→3(all) |
| src/data/events/boss/normal/frostWyrm.ts | Frost Wyrm | 47 | CHANGE | 2 | 2 | 250→2(all), 262→2(all), 335→2(all) |
| src/data/events/boss/normal/titanForgemaster.ts | Titan Forgemaster | 47 | CHANGE | 2 | 2 | 180→2(all), 275→2(random), 330→2(all) |
| src/data/events/boss/normal/balorGeneral.ts | Balor General | 48 | CHANGE | 2 | 2 | 268→2(all), 238→2(all), 315→2(all) |
| src/data/events/boss/normal/demonWarlord.ts | Demon Warlord | 48 | CHANGE | 2 | 2 | 282→2(random), 268→2(weakest), 338→2(all) |
| src/data/events/boss/normal/winterSovereign.ts | Winter Sovereign | 48 | CHANGE | 2 | 2 | 290→2(strongest), 270→2(all), 345→2(all) |
| src/data/events/boss/normal/ancientRedDragon.ts | Ancient Red Dragon | 49 | CHANGE | 2 | 2 | 285→2(strongest), 285→2(strongest), 340→2(all), 340→2(all) |
| src/data/events/boss/normal/elementalFusion.ts | Elemental Fusion | 49 | CHANGE | 2 | 2 | 265→2(all), 295→2(all), 355→2(all) |
| src/data/events/boss/normal/runeGuardian.ts | Rune Guardian | 49 | CHANGE | 2 | 2 | 298→2(random), 288→2(all), 352→2(all) |
| src/data/events/boss/normal/colossusPrime.ts | Colossus Prime | 50 | CHANGE | 4 | 3 | 300→3(strongest), 95→4(all), 360→4(all) |
| src/data/events/boss/normal/voidEmperor.ts | Void Emperor | 50 | CHANGE | 4 | 3 | 255→4(all), 292→3(weakest), 350→4(all) |
| src/data/events/boss/normal/plagueColossus.ts | Plague Colossus | 51 | CHANGE | 4 | 3 | 318→3(strongest), 305→4(all), 378→4(all) |
| src/data/events/boss/normal/gearTyrant.ts | Gear Tyrant | 52 | CHANGE | 4 | 3 | 305→3(strongest), 292→4(all), 368→4(all) |
| src/data/events/boss/normal/sporeMind.ts | Spore Mind | 52 | CHANGE | 4 | 3 | 332→4(all), 318→4(all), 390→3(random) |
| src/data/events/boss/normal/bulwarkTitan.ts | Bulwark Titan | 53 | CHANGE | 3 | 3 | 312→3(strongest), 298→3(all), 375→3(all) |
| src/data/events/boss/normal/realitySage.ts | Reality Sage | 53 | CHANGE | 3 | 3 | 335→3(weakest), 322→3(all), 392→3(random) |
| src/data/events/boss/normal/brambleKing.ts | Bramble King | 54 | CHANGE | 3 | 3 | 325→3(strongest), 312→3(all), 382→3(all) |
| src/data/events/boss/normal/chaosShaper.ts | Chaos Shaper | 54 | CHANGE | 3 | 3 | 328→3(weakest), 315→3(all), 392→3(random) |
| src/data/events/boss/normal/arachnidMatron.ts | Arachnid Matron | 55 | CHANGE | 4 | 3 | 320→3(strongest), 308→4(all), 385→4(all) |
| src/data/events/boss/normal/necroTriumvirate.ts | Necro-Triumvirate | 55 | CHANGE | 4 | 3 | 342→3(random), 328→4(all), 405→4(all) |
| src/data/events/boss/normal/starforgedColossus.ts | Starforged Colossus | 55 | CHANGE | 4 | 3 | 300→3(strongest), 270→4(all), 360→4(all) |
| src/data/events/boss/normal/cavernBehemoth.ts | Cavern Behemoth | 56 | CHANGE | 3 | 3 | 355→3(strongest), 342→3(all), 410→3(all) |
| src/data/events/boss/normal/toxicOverlord.ts | Toxic Overlord | 56 | CHANGE | 3 | 3 | 352→3(strongest), 342→3(all), 408→3(all) |
| src/data/events/boss/normal/voidProphet.ts | Void Prophet | 56 | CHANGE | 3 | 3 | 332→3(all), 318→3(strongest), 395→3(random) |
| src/data/events/boss/normal/meteorGolem.ts | Meteor Golem | 57 | CHANGE | 3 | 3 | 328→3(strongest), 315→3(all), 388→3(all) |
| src/data/events/boss/normal/primalAvatar.ts | Primal Avatar | 57 | CHANGE | 3 | 3 | 348→3(random), 402→3(all) |
| src/data/events/boss/normal/doppelgangerHive.ts | Doppelganger Hive | 58 | CHANGE | 3 | 3 | 355→3(weakest), 345→3(random), 412→3(all) |
| src/data/events/boss/normal/stormHerald.ts | Storm Herald | 58 | CHANGE | 3 | 3 | 338→3(strongest), 322→3(all), 398→3(random) |
| src/data/events/boss/normal/adamantDragon.ts | Adamant Dragon | 59 | CHANGE | 3 | 2 | 362→3(all), 362→3(all), 348→2(strongest), 348→2(strongest), 420→3(all), 420→3(all) |
| src/data/events/boss/normal/boneEmperor.ts | Bone Emperor | 59 | CHANGE | 3 | 2 | 365→3(all), 352→2(strongest), 418→3(all) |
| src/data/events/boss/normal/fallenSeraph.ts | Fallen Seraph | 60 | CHANGE | 6 | 5 | 358→5(random), 345→6(all), 415→6(all) |
| src/data/events/boss/normal/swordSaint.ts | Sword Saint | 60 | CHANGE | 6 | 5 | 358→5(strongest), 372→6(all), 425→5(strongest) |
| src/data/events/boss/normal/hurricanePrince.ts | Hurricane Prince | 61 | CHANGE | 6 | 4 | 378→4(strongest), 365→6(all), 435→6(all) |
| src/data/events/boss/normal/grimoireDemon.ts | Grimoire Demon | 62 | CHANGE | 6 | 4 | 385→4(strongest), 372→6(all), 442→6(all) |
| src/data/events/boss/normal/voidWyrm.ts | Void Wyrm | 63 | CHANGE | 6 | 4 | 395→4(weakest), 382→6(all), 448→4(random) |
| src/data/events/boss/normal/painArchitect.ts | Pain Architect | 64 | CHANGE | 6 | 4 | 398→4(strongest), 385→6(all), 452→6(all) |
| src/data/events/boss/normal/dualistElemental.ts | Dualist Elemental | 65 | CHANGE | 6 | 4 | 418→4(strongest), 405→6(all), 468→6(all) |
| src/data/events/boss/normal/mechOverlord.ts | Mech Overlord | 65 | CHANGE | 6 | 4 | 402→6(all), 388→4(random), 455→6(all) |
| src/data/events/boss/normal/voidReavers.ts | The Void Reavers | 65 | CHANGE | 6 | 4 | 330→6(all), 540→6(all), 240→4(random), 420→6(all) |
| src/data/events/boss/normal/grailGuardian.ts | Grail Guardian | 66 | CHANGE | 6 | 4 | 408→4(strongest), 395→6(all), 458→6(all) |
| src/data/events/boss/normal/plagueLich.ts | Plague Lich | 66 | CHANGE | 6 | 4 | 408→4(strongest), 395→6(all), 462→6(all) |
| src/data/events/boss/normal/archmageShade.ts | Archmage Shade | 67 | CHANGE | 6 | 4 | 415→6(all), 402→6(all), 465→6(all) |
| src/data/events/boss/normal/wildfireAncient.ts | Wildfire Ancient | 67 | CHANGE | 6 | 4 | 392→6(all), 378→6(all), 445→6(all) |
| src/data/events/boss/normal/abyssalLeviathan.ts | Abyssal Leviathan | 68 | CHANGE | 6 | 4 | 422→4(strongest), 408→6(all), 472→6(all) |
| src/data/events/boss/normal/bladeSeraph.ts | Blade Seraph | 68 | CHANGE | 6 | 4 | 418→4(weakest), 405→4(strongest), 468→6(all) |
| src/data/events/boss/normal/moonBeast.ts | Moon Beast | 68 | CHANGE | 6 | 4 | 425→6(all), 412→6(all), 478→4(random) |
| src/data/events/boss/normal/aberrantSovereign.ts | Aberrant Sovereign | 69 | CHANGE | 6 | 4 | 438→4(strongest), 422→6(all), 488→4(random) |
| src/data/events/boss/normal/crystalLeviathan.ts | Crystal Leviathan | 69 | CHANGE | 6 | 4 | 425→6(all), 412→4(strongest), 475→4(random) |
| src/data/events/boss/normal/forgeColossus.ts | Forge Colossus | 69 | CHANGE | 6 | 4 | 432→6(all), 418→4(random), 485→6(all) |
| src/data/events/boss/normal/behemothKing.ts | Behemoth King | 70 | CHANGE | 12 | 9 | 442→9(strongest), 428→9(weakest), 492→12(all) |
| src/data/events/boss/normal/nightmareWeaver.ts | Nightmare Weaver | 70 | CHANGE | 12 | 9 | 432→9(strongest), 418→12(all), 482→12(all) |
| src/data/events/boss/normal/thoughtEater.ts | Thought Eater | 70 | CHANGE | 12 | 9 | 448→9(strongest), 435→12(all), 498→12(all) |
| src/data/events/boss/normal/dimensionRipper.ts | Dimension Ripper | 72 | CHANGE | 11 | 8 | 465→11(all), 452→11(all), 518→8(random) |
| src/data/events/boss/normal/cosmicDragon.ts | Cosmic Dragon | 73 | CHANGE | 11 | 8 | 478→8(weakest), 478→8(weakest), 465→11(all), 465→11(all), 528→11(all), 528→11(all) |
| src/data/events/boss/normal/titanBreaker.ts | Titan Breaker | 74 | CHANGE | 11 | 8 | 485→8(strongest), 472→8(strongest), 532→11(all) |
| src/data/events/boss/normal/chronoWarden.ts | Chrono Warden | 75 | CHANGE | 11 | 9 | 420→11(all), 390→11(all), 510→11(all) |
| src/data/events/boss/normal/entropyLord.ts | Entropy Lord | 75 | CHANGE | 11 | 9 | 485→11(all), 472→11(all), 538→11(all) |
| src/data/events/boss/normal/deathIncarnate.ts | Death Incarnate | 76 | CHANGE | 11 | 8 | 498→8(random), 485→11(all), 545→11(all) |
| src/data/events/boss/normal/elderHorror.ts | Elder Horror | 78 | CHANGE | 11 | 8 | 505→8(strongest), 492→11(all), 552→11(all) |
| src/data/events/boss/normal/shadowParliament.ts | Shadow Parliament | 79 | CHANGE | 11 | 8 | 512→8(random), 498→11(all), 558→11(all) |
| src/data/events/boss/normal/weaponAbsolute.ts | Weapon Absolute | 80 | CHANGE | 26 | 19 | 518→19(strongest), 505→19(weakest), 565→26(all) |
| src/data/events/boss/normal/stormTyrant.ts | Storm Tyrant | 81 | CHANGE | 26 | 19 | 525→19(strongest), 512→26(all), 572→26(all) |
| src/data/events/boss/normal/memoryPhantom.ts | Memory Phantom | 82 | CHANGE | 25 | 19 | 518→25(all), 505→25(all), 578→25(all) |
| src/data/events/boss/normal/starEater.ts | Star Eater | 83 | CHANGE | 25 | 19 | 538→25(all), 525→25(all), 585→25(all) |
| src/data/events/boss/normal/primordialWyrm.ts | Primordial Wyrm | 84 | CHANGE | 25 | 19 | 545→19(strongest), 532→25(all), 592→25(all) |
| src/data/events/boss/normal/destinyBreaker.ts | Destiny Breaker | 85 | CHANGE | 26 | 19 | 545→19(strongest), 532→26(all), 592→19(random) |
| src/data/events/boss/normal/primordialTitan.ts | Primordial Titan | 85 | CHANGE | 26 | 19 | 510→26(all), 480→26(all), 600→26(all) |
| src/data/events/boss/normal/realityAnchor.ts | Reality Anchor | 86 | CHANGE | 25 | 19 | 558→19(strongest), 545→25(all), 598→19(random) |
| src/data/events/boss/normal/demonEmperor.ts | Demon Emperor | 87 | CHANGE | 25 | 19 | 565→19(strongest), 552→25(all), 605→25(all) |
| src/data/events/boss/normal/genesisCell.ts | Genesis Cell | 88 | CHANGE | 25 | 19 | 578→25(all), 565→19(weakest), 618→19(random) |
| src/data/events/boss/normal/infinityMage.ts | Infinity Mage | 89 | CHANGE | 24 | 18 | 572→24(all), 558→24(all), 612→24(all) |
| src/data/events/boss/normal/paradoxEngine.ts | Paradox Engine | 90 | CHANGE | 49 | 37 | 598→37(strongest), 585→49(all), 632→37(random) |
| src/data/events/boss/normal/singularity.ts | Singularity | 91 | CHANGE | 49 | 36 | 592→36(strongest), 578→49(all), 625→49(all) |
| src/data/events/boss/normal/juggernautPrime.ts | Juggernaut Prime | 92 | CHANGE | 48 | 36 | 672→36(strongest), 658→48(all), 685→48(all) |
| src/data/events/boss/normal/ultimateWarrior.ts | Ultimate Warrior | 93 | CHANGE | 48 | 36 | 618→48(all), 605→36(strongest), 645→36(strongest) |
| src/data/events/boss/normal/dungeonHeart.ts | Dungeon Heart | 94 | CHANGE | 47 | 35 | 612→47(all), 598→35(strongest), 638→47(all) |
| src/data/events/boss/normal/chronosPrime.ts | Chronos Prime | 95 | CHANGE | 49 | 36 | 652→49(all), 638→49(all), 658→49(all) |
| src/data/events/boss/normal/apocalypseBeast.ts | Apocalypse Beast | 96 | CHANGE | 48 | 36 | 645→48(all), 632→48(all), 665→48(all) |
| src/data/events/boss/normal/universeArchitect.ts | Universe Architect | 97 | CHANGE | 48 | 36 | 638→48(all), 625→48(all), 652→48(all) |
| src/data/events/boss/normal/conceptDestroyer.ts | Concept Destroyer | 98 | CHANGE | 47 | 35 | 658→35(strongest), 645→47(all), 672→47(all) |
| src/data/events/boss/normal/omegaEntity.ts | Omega Entity | 99 | CHANGE | 47 | 35 | 665→47(all), 652→35(strongest), 678→47(all) |

**182** bosses scanned — **182** needed changes.
