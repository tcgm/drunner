# Boss Damage Report

Generated: 2026-02-21 05:16:29  |  Mode: **WRITE**

## Config

| Setting | Value |
|---------|-------|
| Defense curve | exponential |
| maxDefense | 33760 |
| midpointDefenseRatio | 0.15 |
| floorBossDamageScaling | 0.45 |
| Hero maxLevel | 20 |
| maxFloors | 100 |
| Zone boss boost | 2× |
| Final boss boost | 3.5× |

## Tiers

| Tier | Floors | TargetHP% | GearDef% | GearRaw | EstDef | Block% | Scale@Min | Scale@Mid | Scale@Max | AllBase | SingBase |
|------|--------|-----------|----------|---------|--------|--------|-----------|-----------|-----------|---------|----------|
| F1-9 | 1-9 | 15% | 0.0% | 0 | 1 | 0.0% | 1.0× | 2.8× | 4.6× | 3 | 2 |
| F10-19 | 10-19 | 18% | 0.5% | 169 | 173 | 2.2% | 5.0× | 7.3× | 9.1× | 2 | 2 |
| F20-29 | 20-29 | 21% | 1.5% | 506 | 513 | 6.4% | 9.6× | 11.8× | 13.6× | 2 | 1 |
| F30-39 | 30-39 | 24% | 3.5% | 1182 | 1190 | 14.3% | 14.1× | 16.3× | 18.1× | 2 | 2 |
| F40-49 | 40-49 | 28% | 7.0% | 2363 | 2374 | 26.4% | 18.6× | 20.8× | 22.6× | 3 | 2 |
| F50-59 | 50-59 | 32% | 13.0% | 4389 | 4403 | 43.0% | 23.1× | 25.3× | 27.1× | 4 | 3 |
| F60-69 | 60-69 | 37% | 23.0% | 7765 | 7781 | 62.3% | 27.6× | 29.8× | 31.6× | 6 | 4 |
| F70-79 | 70-79 | 42% | 38.0% | 12829 | 12848 | 78.6% | 32.0× | 34.3× | 36.1× | 11 | 9 |
| F80-89 | 80-89 | 47% | 62.0% | 20931 | 20952 | 89.6% | 36.6× | 38.8× | 40.6× | 26 | 19 |
| F90-99 | 90-99 | 52% | 100.0% | 33760 | 33784 | 94.1% | 41.1× | 43.3× | 45.1× | 49 | 36 |

## Intro Bosses (floors 1-9)


| File | Title | Floor | Status | AllBase | SingBase | Scale× | Scaled | NetDmg | NetHP% | Changes |
|------|-------|-------|--------|---------|----------|--------|--------|--------|--------|---------|
| src/data/events/boss/intro/giantBat.ts | Giant Bat | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 11→6(fastest), 17→8(all) |
| src/data/events/boss/intro/giantRat.ts | Giant Rat | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 10→6(random), 15→8(all) |
| src/data/events/boss/intro/giantSlime.ts | Giant Slime | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 6→8(all), 9→6(random), 14→8(all) |
| src/data/events/boss/intro/goblinChief.ts | Goblin Chief | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 12→6(strongest), 18→8(all) |
| src/data/events/boss/intro/rabidWolf.ts | Rabid Wolf | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 11→8(all), 16→8(all) |
| src/data/events/boss/intro/rogueApprentice.ts | Rogue Apprentice | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 10→6(random), 16→8(all) |
| src/data/events/boss/intro/wildBoar.ts | Wild Boar | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 13→6(strongest), 19→8(all) |
| src/data/events/boss/intro/zombieBrute.ts | Zombie Brute | 1 | WRITE | 8 | 6 | 1.0× | 8 | 8 | 16.0% | 9→8(all), 15→6(weakest), 20→8(all) |

## Normal Floor Bosses


| File | Title | Floor | Status | AllBase | SingBase | Scale× | Scaled | NetDmg | NetHP% | Changes |
|------|-------|-------|--------|---------|----------|--------|--------|--------|--------|---------|
| src/data/events/boss/normal/corruptedBear.ts | Corrupted Bear | 3 | WRITE | 4 | 3 | 1.9× | 8 | 8 | 16.0% | 20→4(all), 28→4(all) |
| src/data/events/boss/normal/skeletal_champion.ts | Skeletal Champion | 4 | WRITE | 3 | 2 | 2.4× | 7 | 7 | 14.0% | 12→3(all), 22→2(random), 30→3(all) |
| src/data/events/boss/normal/goblinWarlord.ts | Goblin Warlord | 5 | WRITE | 3 | 2 | 2.8× | 8 | 8 | 13.3% | 20→3(all), 18→2(weakest), 27→3(all) |
| src/data/events/boss/normal/rottenTroll.ts | Rotten Troll | 5 | WRITE | 3 | 2 | 2.8× | 8 | 8 | 13.3% | 15→2(strongest), 18→3(all), 25→3(all) |
| src/data/events/boss/normal/undeadChampion.ts | Undead Champion | 5 | WRITE | 3 | 2 | 2.8× | 8 | 8 | 13.3% | 25→3(all), 15→2(random), 20→3(all), 35→3(all) |
| src/data/events/boss/normal/banditKing.ts | Bandit King | 6 | WRITE | 3 | 2 | 3.3× | 10 | 10 | 16.7% | 22→2(strongest), 29→3(all) |
| src/data/events/boss/normal/shadowStalker.ts | Shadow Stalker | 6 | WRITE | 3 | 2 | 3.3× | 10 | 10 | 16.7% | 24→2(random), 20→3(all), 32→3(all) |
| src/data/events/boss/normal/dragonWyrmling.ts | Young Dragon | 7 | WRITE | 2 | 2 | 3.7× | 7 | 7 | 11.7% | 30→2(all), 25→2(all), 40→2(all) |
| src/data/events/boss/normal/earthElemental.ts | Earth Elemental | 7 | WRITE | 2 | 2 | 3.7× | 7 | 7 | 11.7% | 23→2(weakest), 34→2(all) |
| src/data/events/boss/normal/venomousHydra.ts | Venomous Hydra | 7 | WRITE | 2 | 2 | 3.7× | 7 | 7 | 11.7% | 22→2(all), 25→2(strongest), 35→2(all) |
| src/data/events/boss/normal/demonLord.ts | Lesser Demon Lord | 8 | WRITE | 2 | 2 | 4.2× | 8 | 8 | 13.3% | 30→2(all), 25→2(all), 20→2(all), 45→2(all) |
| src/data/events/boss/normal/giantSpiderQueen.ts | Giant Spider Queen | 8 | WRITE | 2 | 2 | 4.2× | 8 | 8 | 13.3% | 25→2(random), 21→2(all), 33→2(all) |
| src/data/events/boss/normal/minotaurGuardian.ts | Minotaur Guardian | 8 | WRITE | 2 | 2 | 4.2× | 8 | 8 | 13.3% | 22→2(all), 26→2(random), 40→2(all) |
| src/data/events/boss/normal/shadowAssassin.ts | Shadow Assassin | 8 | WRITE | 2 | 2 | 4.2× | 8 | 8 | 13.3% | 25→2(random), 25→2(all), 28→2(all), 38→2(all) |
| src/data/events/boss/normal/ancientLich.ts | Ancient Lich | 9 | WRITE | 2 | 1 | 4.6× | 9 | 9 | 15.0% | 50→2(all), 20→2(all), 25→2(all), 30→2(all) |
| src/data/events/boss/normal/direWolfAlpha.ts | Dire Wolf Alpha | 9 | WRITE | 2 | 1 | 4.6× | 9 | 9 | 15.0% | 15→2(all), 19→1(weakest), 31→2(all) |
| src/data/events/boss/normal/vampireLord.ts | Vampire Lord | 9 | WRITE | 2 | 1 | 4.6× | 9 | 9 | 15.0% | 28→1(strongest), 24→2(all), 38→2(all) |
| src/data/events/boss/normal/dungeonGuardian.ts | Dungeon Guardian | 10 | WRITE | 3 | 2 | 5.0× | 15 | 15 | 21.4% | 35→3(all), 25→3(all), 30→3(all), 50→3(all) |
| src/data/events/boss/normal/frostTitan.ts | Frost Titan | 10 | WRITE | 3 | 2 | 5.0× | 15 | 15 | 21.4% | 20→2(random), 30→3(all), 25→3(all), 40→3(all) |
| src/data/events/boss/normal/mirrorWraith.ts | Mirror Wraith | 10 | WRITE | 3 | 2 | 5.0× | 15 | 15 | 21.4% | 20→3(all), 26→2(random), 36→3(all) |
| src/data/events/boss/normal/necromancerAdept.ts | Necromancer Adept | 10 | WRITE | 3 | 2 | 5.0× | 15 | 15 | 21.4% | 20→3(all), 27→2(weakest), 37→3(all) |
| src/data/events/boss/normal/dungeonMimic.ts | Ancient Mimic Lord | 12 | WRITE | 2 | 2 | 6.0× | 12 | 12 | 17.1% | 38→2(all), 47→2(weakest), 62→2(all) |
| src/data/events/boss/normal/wailingBanshee.ts | Wailing Banshee | 12 | WRITE | 2 | 2 | 6.0× | 12 | 12 | 17.1% | 50→2(weakest), 44→2(all), 72→2(all) |
| src/data/events/boss/normal/mantisHunter.ts | Mantis Hunter | 13 | WRITE | 2 | 2 | 6.4× | 13 | 13 | 18.6% | 60→2(random), 54→2(weakest), 75→2(all) |
| src/data/events/boss/normal/serpentPriest.ts | Serpent Priest | 13 | WRITE | 2 | 2 | 6.4× | 13 | 13 | 18.6% | 42→2(all), 49→2(weakest), 69→2(all) |
| src/data/events/boss/normal/cursedPaladin.ts | Cursed Paladin | 14 | WRITE | 2 | 1 | 6.9× | 14 | 13 | 18.6% | 56→1(random), 46→2(all), 71→2(all) |
| src/data/events/boss/normal/flameSalamander.ts | Flame Salamander | 14 | WRITE | 2 | 1 | 6.9× | 14 | 13 | 18.6% | 52→1(strongest), 48→2(all), 65→2(all) |
| src/data/events/boss/normal/corruptedTreant.ts | Corrupted Treant | 15 | WRITE | 2 | 2 | 7.3× | 15 | 14 | 17.5% | 59→2(strongest), 76→2(all) |
| src/data/events/boss/normal/golemConstruct.ts | Golem Construct | 15 | WRITE | 2 | 2 | 7.3× | 15 | 14 | 17.5% | 53→2(random), 45→2(all), 53→2(all), 75→2(all) |
| src/data/events/boss/normal/iceWraith.ts | Frost Wraith King | 15 | WRITE | 2 | 2 | 7.3× | 15 | 14 | 17.5% | 53→2(all), 50→2(all), 68→2(all) |
| src/data/events/boss/normal/crystalHorror.ts | Crystal Horror | 16 | WRITE | 2 | 1 | 7.8× | 16 | 15 | 18.8% | 55→1(random), 45→2(all), 70→2(all) |
| src/data/events/boss/normal/oozeSovereign.ts | Ooze Sovereign | 16 | WRITE | 2 | 1 | 7.8× | 16 | 15 | 18.8% | 64→2(all), 58→2(all), 80→2(all) |
| src/data/events/boss/normal/phaseSpider.ts | Phase Spider | 16 | WRITE | 2 | 1 | 7.8× | 16 | 15 | 18.8% | 45→2(all), 48→1(random), 66→2(all) |
| src/data/events/boss/normal/clockworkSentinel.ts | Clockwork Sentinel | 17 | WRITE | 2 | 1 | 8.2× | 16 | 16 | 20.0% | 52→1(random), 48→2(all), 67→2(all) |
| src/data/events/boss/normal/ironColossus.ts | Iron Colossus | 17 | WRITE | 2 | 1 | 8.2× | 16 | 16 | 20.0% | 63→1(random), 56→2(all), 79→2(all) |
| src/data/events/boss/normal/beholderSpawn.ts | Beholder Spawn | 18 | WRITE | 2 | 1 | 8.7× | 17 | 17 | 21.3% | 58→1(strongest), 52→2(all), 73→2(all) |
| src/data/events/boss/normal/boundDemon.ts | Bound Demon | 18 | WRITE | 2 | 1 | 8.7× | 17 | 17 | 21.3% | 62→1(random), 55→2(all), 83→2(all) |
| src/data/events/boss/normal/stormDjinn.ts | Storm Djinn | 18 | WRITE | 2 | 1 | 8.7× | 17 | 17 | 21.3% | 61→1(weakest), 54→2(all), 77→2(all) |
| src/data/events/boss/normal/centaurChampion.ts | Centaur Champion | 19 | WRITE | 2 | 1 | 9.1× | 18 | 18 | 22.5% | 57→1(random), 53→1(strongest), 74→2(all) |
| src/data/events/boss/normal/drakeMatriarch.ts | Drake Matriarch | 19 | WRITE | 2 | 1 | 9.1× | 18 | 18 | 22.5% | 62→1(strongest), 78→2(all) |
| src/data/events/boss/normal/voidCultist.ts | Void Cultist | 20 | WRITE | 2 | 2 | 9.6× | 19 | 18 | 20.0% | 60→2(random), 53→2(all), 60→2(all), 83→2(all) |
| src/data/events/boss/normal/airElementalLord.ts | Air Elemental Lord | 22 | WRITE | 2 | 1 | 10.5× | 21 | 20 | 22.2% | 84→1(weakest), 75→2(all), 118→2(all) |
| src/data/events/boss/normal/ironMaiden.ts | Iron Maiden | 22 | WRITE | 2 | 1 | 10.5× | 21 | 20 | 22.2% | 94→2(all), 80→1(weakest), 128→2(all) |
| src/data/events/boss/normal/webWeaver.ts | Web Weaver | 22 | WRITE | 2 | 1 | 10.5× | 21 | 20 | 22.2% | 88→1(weakest), 82→2(all), 120→2(all) |
| src/data/events/boss/normal/bladeDancer.ts | Blade Dancer | 23 | WRITE | 2 | 1 | 10.9× | 22 | 20 | 22.2% | 86→1(weakest), 78→1(random), 122→2(all) |
| src/data/events/boss/normal/rustMonsterAlpha.ts | Rust Monster Alpha | 23 | WRITE | 2 | 1 | 10.9× | 22 | 20 | 22.2% | 92→1(random), 85→2(all), 132→2(all) |
| src/data/events/boss/normal/krakenSpawn.ts | Kraken Spawn | 24 | WRITE | 2 | 1 | 11.3× | 23 | 21 | 23.3% | 82→2(all), 90→1(strongest), 126→2(all) |
| src/data/events/boss/normal/phantomLegion.ts | Phantom Legion | 24 | WRITE | 2 | 1 | 11.3× | 23 | 21 | 23.3% | 98→1(random), 88→2(all), 130→2(all) |
| src/data/events/boss/normal/elderHydra.ts | Elder Hydra | 25 | WRITE | 2 | 1 | 11.8× | 24 | 22 | 22.0% | 113→1(random), 100→2(all), 113→2(all), 150→2(all) |
| src/data/events/boss/normal/shadowTwin.ts | Shadow Twin | 25 | WRITE | 2 | 1 | 11.8× | 24 | 22 | 22.0% | 85→2(all), 92→1(random), 125→2(all) |
| src/data/events/boss/normal/skeletalTyrant.ts | Skeletal Tyrant | 25 | WRITE | 2 | 1 | 11.8× | 24 | 22 | 22.0% | 100→1(strongest), 92→2(all), 137→2(all) |
| src/data/events/boss/normal/infernalChampion.ts | Infernal Champion | 26 | WRITE | 2 | 1 | 12.3× | 25 | 23 | 23.0% | 98→1(random), 88→2(all), 134→2(all) |
| src/data/events/boss/normal/mindFlayer.ts | Mind Flayer | 26 | WRITE | 2 | 1 | 12.3× | 25 | 23 | 23.0% | 95→1(weakest), 102→1(random), 138→2(all) |
| src/data/events/boss/normal/plagueBearer.ts | Plague Bearer | 26 | WRITE | 2 | 1 | 12.3× | 25 | 23 | 23.0% | 107→2(all), 100→2(all), 143→2(all) |
| src/data/events/boss/normal/berserkerKing.ts | Berserker King | 27 | WRITE | 2 | 1 | 12.7× | 25 | 24 | 24.0% | 115→2(all), 108→1(strongest), 142→2(all) |
| src/data/events/boss/normal/fallenAngel.ts | Fallen Angel | 27 | WRITE | 2 | 1 | 12.7× | 25 | 24 | 24.0% | 105→1(strongest), 90→2(all), 140→2(all) |
| src/data/events/boss/normal/magmaTitan.ts | Magma Titan | 28 | WRITE | 2 | 1 | 13.2× | 26 | 25 | 25.0% | 110→2(all), 105→2(all), 145→2(all) |
| src/data/events/boss/normal/voidHorror.ts | Void Horror | 28 | WRITE | 2 | 1 | 13.2× | 26 | 25 | 25.0% | 105→1(weakest), 98→2(all), 135→2(all) |
| src/data/events/boss/normal/crystalDragon.ts | Crystal Dragon | 29 | WRITE | 2 | 1 | 13.6× | 27 | 25 | 25.0% | 118→1(strongest), 118→1(strongest), 108→2(all), 108→2(all), 150→2(all), 150→2(all) |
| src/data/events/boss/normal/graniteJuggernaut.ts | Granite Juggernaut | 29 | WRITE | 2 | 1 | 13.6× | 27 | 25 | 25.0% | 95→2(all), 112→1(strongest), 148→2(all) |
| src/data/events/boss/normal/valkyrieHuntress.ts | Valkyrie Huntress | 29 | WRITE | 2 | 1 | 13.6× | 27 | 25 | 25.0% | 95→2(all), 113→1(strongest), 146→2(all) |
| src/data/events/boss/normal/caveTrollKing.ts | Cave Troll King | 31 | WRITE | 2 | 2 | 14.5× | 29 | 25 | 22.7% | 155→2(strongest), 138→2(weakest), 180→2(all) |
| src/data/events/boss/normal/toxicAbomination.ts | Toxic Abomination | 31 | WRITE | 2 | 2 | 14.5× | 29 | 25 | 22.7% | 130→2(all), 125→2(weakest), 165→2(all) |
| src/data/events/boss/normal/earthquakeTitan.ts | Earthquake Titan | 32 | WRITE | 2 | 2 | 15.0× | 30 | 26 | 23.6% | 152→2(random), 132→2(all), 172→2(all) |
| src/data/events/boss/normal/spectralLord.ts | Spectral Lord | 33 | WRITE | 2 | 1 | 15.4× | 31 | 26 | 23.6% | 142→1(random), 128→2(all), 168→2(all) |
| src/data/events/boss/normal/whirlwindAssassin.ts | Whirlwind Assassin | 33 | WRITE | 2 | 1 | 15.4× | 31 | 26 | 23.6% | 142→1(weakest), 135→2(all), 170→2(all) |
| src/data/events/boss/normal/obsidianKnight.ts | Obsidian Knight | 34 | WRITE | 2 | 1 | 15.8× | 32 | 27 | 24.5% | 138→2(all), 148→1(strongest), 176→2(all) |
| src/data/events/boss/normal/twinHeadedDrake.ts | Twin-Headed Drake | 34 | WRITE | 2 | 1 | 15.8× | 32 | 27 | 24.5% | 148→1(strongest), 138→1(weakest), 175→2(all) |
| src/data/events/boss/normal/abyssalKraken.ts | Abyssal Kraken | 35 | WRITE | 2 | 2 | 16.3× | 33 | 28 | 23.3% | 175→2(random), 125→2(all), 150→2(all), 200→2(all) |
| src/data/events/boss/normal/realityRipper.ts | Reality Ripper | 35 | WRITE | 2 | 2 | 16.3× | 33 | 28 | 23.3% | 150→2(weakest), 140→2(all), 178→2(all) |
| src/data/events/boss/normal/bladeMaster.ts | Blade Master | 36 | WRITE | 2 | 2 | 16.8× | 34 | 29 | 24.2% | 162→2(strongest), 145→2(random), 186→2(all) |
| src/data/events/boss/normal/darkProphet.ts | Dark Prophet | 36 | WRITE | 2 | 2 | 16.8× | 34 | 29 | 24.2% | 142→2(all), 145→2(weakest), 185→2(all) |
| src/data/events/boss/normal/gorgonMatriarch.ts | Gorgon Matriarch | 36 | WRITE | 2 | 2 | 16.8× | 34 | 29 | 24.2% | 155→2(weakest), 135→2(all), 182→2(all) |
| src/data/events/boss/normal/archmageLich.ts | Archmage Lich | 37 | WRITE | 2 | 1 | 17.2× | 34 | 29 | 24.2% | 158→1(random), 145→2(all), 188→2(all) |
| src/data/events/boss/normal/armoredBehemoth.ts | Armored Behemoth | 37 | WRITE | 2 | 1 | 17.2× | 34 | 29 | 24.2% | 172→1(weakest), 158→1(random), 202→2(all) |
| src/data/events/boss/normal/phoenixChampion.ts | Phoenix Champion | 38 | WRITE | 2 | 1 | 17.7× | 35 | 30 | 25.0% | 168→1(strongest), 155→2(all), 198→2(all) |
| src/data/events/boss/normal/siegeAutomaton.ts | Siege Automaton | 38 | WRITE | 2 | 1 | 17.7× | 35 | 30 | 25.0% | 160→1(strongest), 148→1(random), 190→2(all) |
| src/data/events/boss/normal/deathKnightCommander.ts | Death Knight Commander | 39 | WRITE | 2 | 1 | 18.1× | 36 | 31 | 25.8% | 165→1(random), 152→2(all), 195→2(all) |
| src/data/events/boss/normal/starbornHorror.ts | Starborn Horror | 39 | WRITE | 2 | 1 | 18.1× | 36 | 31 | 25.8% | 162→2(all), 150→2(all), 192→2(all) |
| src/data/events/boss/normal/warlockOverlord.ts | Warlock Overlord | 39 | WRITE | 2 | 1 | 18.1× | 36 | 31 | 25.8% | 170→1(weakest), 157→2(all), 200→2(all) |
| src/data/events/boss/normal/harpyQueen.ts | Harpy Queen | 41 | WRITE | 3 | 2 | 19.0× | 57 | 42 | 32.3% | 205→3(all), 215→2(weakest), 285→3(all) |
| src/data/events/boss/normal/jungleTitan.ts | Jungle Titan | 41 | WRITE | 3 | 2 | 19.0× | 57 | 42 | 32.3% | 245→2(strongest), 222→3(all), 295→3(all) |
| src/data/events/boss/normal/astralDreadnought.ts | Astral Dreadnought | 42 | WRITE | 3 | 2 | 19.4× | 58 | 43 | 33.1% | 252→2(strongest), 225→3(all), 300→3(all) |
| src/data/events/boss/normal/crystallineSentinel.ts | Crystalline Sentinel | 42 | WRITE | 3 | 2 | 19.4× | 58 | 43 | 33.1% | 175→3(all), 140→3(all), 210→3(all) |
| src/data/events/boss/normal/martyredSaint.ts | Martyred Saint | 42 | WRITE | 3 | 2 | 19.4× | 58 | 43 | 33.1% | 262→2(strongest), 235→3(all), 308→3(all) |
| src/data/events/boss/normal/nightmareTyrant.ts | Nightmare Tyrant | 43 | WRITE | 2 | 2 | 19.9× | 40 | 29 | 22.3% | 232→2(weakest), 220→2(all), 295→2(all) |
| src/data/events/boss/normal/timeEater.ts | Time Eater | 43 | WRITE | 2 | 2 | 19.9× | 40 | 29 | 22.3% | 210→2(all), 218→2(weakest), 290→2(all) |
| src/data/events/boss/normal/clockworkEmperor.ts | Clockwork Emperor | 44 | WRITE | 2 | 2 | 20.4× | 41 | 30 | 23.1% | 270→2(strongest), 245→2(weakest), 320→2(all) |
| src/data/events/boss/normal/plagueDragon.ts | Plague Dragon | 44 | WRITE | 2 | 2 | 20.4× | 41 | 30 | 23.1% | 255→2(all), 255→2(all), 240→2(all), 240→2(all), 315→2(all), 315→2(all) |
| src/data/events/boss/normal/chaosHerald.ts | Chaos Herald | 45 | WRITE | 3 | 2 | 20.8× | 62 | 46 | 32.9% | 248→3(all), 280→3(all), 345→2(random) |
| src/data/events/boss/normal/prismGuardian.ts | Prism Guardian | 45 | WRITE | 3 | 2 | 20.8× | 62 | 46 | 32.9% | 265→2(strongest), 272→2(random), 325→3(all) |
| src/data/events/boss/normal/arcaneArtillery.ts | Arcane Artillery | 46 | WRITE | 3 | 2 | 21.3× | 64 | 47 | 33.6% | 278→2(strongest), 260→3(all), 328→3(all) |
| src/data/events/boss/normal/elderBrain.ts | Elder Brain | 46 | WRITE | 3 | 2 | 21.3× | 64 | 47 | 33.6% | 275→2(strongest), 258→2(random), 310→3(all) |
| src/data/events/boss/normal/stormLich.ts | Storm Lich | 46 | WRITE | 3 | 2 | 21.3× | 64 | 47 | 33.6% | 228→3(all), 242→3(all), 305→3(all) |
| src/data/events/boss/normal/frostWyrm.ts | Frost Wyrm | 47 | WRITE | 2 | 2 | 21.7× | 43 | 32 | 22.9% | 250→2(all), 262→2(all), 335→2(all) |
| src/data/events/boss/normal/titanForgemaster.ts | Titan Forgemaster | 47 | WRITE | 2 | 2 | 21.7× | 43 | 32 | 22.9% | 180→2(all), 275→2(random), 330→2(all) |
| src/data/events/boss/normal/balorGeneral.ts | Balor General | 48 | WRITE | 2 | 2 | 22.2× | 44 | 33 | 23.6% | 268→2(all), 238→2(all), 315→2(all) |
| src/data/events/boss/normal/demonWarlord.ts | Demon Warlord | 48 | WRITE | 2 | 2 | 22.2× | 44 | 33 | 23.6% | 282→2(random), 268→2(weakest), 338→2(all) |
| src/data/events/boss/normal/winterSovereign.ts | Winter Sovereign | 48 | WRITE | 2 | 2 | 22.2× | 44 | 33 | 23.6% | 290→2(strongest), 270→2(all), 345→2(all) |
| src/data/events/boss/normal/ancientRedDragon.ts | Ancient Red Dragon | 49 | WRITE | 2 | 2 | 22.6× | 45 | 33 | 23.6% | 285→2(strongest), 285→2(strongest), 340→2(all), 340→2(all) |
| src/data/events/boss/normal/elementalFusion.ts | Elemental Fusion | 49 | WRITE | 2 | 2 | 22.6× | 45 | 33 | 23.6% | 265→2(all), 295→2(all), 355→2(all) |
| src/data/events/boss/normal/runeGuardian.ts | Rune Guardian | 49 | WRITE | 2 | 2 | 22.6× | 45 | 33 | 23.6% | 298→2(random), 288→2(all), 352→2(all) |
| src/data/events/boss/normal/colossusPrime.ts | Colossus Prime | 50 | WRITE | 4 | 3 | 23.1× | 92 | 53 | 35.3% | 300→3(strongest), 95→4(all), 360→4(all) |
| src/data/events/boss/normal/voidEmperor.ts | Void Emperor | 50 | WRITE | 4 | 3 | 23.1× | 92 | 53 | 35.3% | 255→4(all), 292→3(weakest), 350→4(all) |
| src/data/events/boss/normal/plagueColossus.ts | Plague Colossus | 51 | WRITE | 4 | 3 | 23.5× | 94 | 54 | 36.0% | 318→3(strongest), 305→4(all), 378→4(all) |
| src/data/events/boss/normal/gearTyrant.ts | Gear Tyrant | 52 | WRITE | 4 | 3 | 23.9× | 96 | 55 | 36.7% | 305→3(strongest), 292→4(all), 368→4(all) |
| src/data/events/boss/normal/sporeMind.ts | Spore Mind | 52 | WRITE | 4 | 3 | 23.9× | 96 | 55 | 36.7% | 332→4(all), 318→4(all), 390→3(random) |
| src/data/events/boss/normal/bulwarkTitan.ts | Bulwark Titan | 53 | WRITE | 3 | 3 | 24.4× | 73 | 42 | 28.0% | 312→3(strongest), 298→3(all), 375→3(all) |
| src/data/events/boss/normal/realitySage.ts | Reality Sage | 53 | WRITE | 3 | 3 | 24.4× | 73 | 42 | 28.0% | 335→3(weakest), 322→3(all), 392→3(random) |
| src/data/events/boss/normal/brambleKing.ts | Bramble King | 54 | WRITE | 3 | 3 | 24.9× | 75 | 43 | 28.7% | 325→3(strongest), 312→3(all), 382→3(all) |
| src/data/events/boss/normal/chaosShaper.ts | Chaos Shaper | 54 | WRITE | 3 | 3 | 24.9× | 75 | 43 | 28.7% | 328→3(weakest), 315→3(all), 392→3(random) |
| src/data/events/boss/normal/arachnidMatron.ts | Arachnid Matron | 55 | WRITE | 4 | 3 | 25.3× | 101 | 58 | 36.3% | 320→3(strongest), 308→4(all), 385→4(all) |
| src/data/events/boss/normal/necroTriumvirate.ts | Necro-Triumvirate | 55 | WRITE | 4 | 3 | 25.3× | 101 | 58 | 36.3% | 342→3(random), 328→4(all), 405→4(all) |
| src/data/events/boss/normal/starforgedColossus.ts | Starforged Colossus | 55 | WRITE | 4 | 3 | 25.3× | 101 | 58 | 36.3% | 300→3(strongest), 270→4(all), 360→4(all) |
| src/data/events/boss/normal/cavernBehemoth.ts | Cavern Behemoth | 56 | WRITE | 3 | 3 | 25.8× | 77 | 44 | 27.5% | 355→3(strongest), 342→3(all), 410→3(all) |
| src/data/events/boss/normal/toxicOverlord.ts | Toxic Overlord | 56 | WRITE | 3 | 3 | 25.8× | 77 | 44 | 27.5% | 352→3(strongest), 342→3(all), 408→3(all) |
| src/data/events/boss/normal/voidProphet.ts | Void Prophet | 56 | WRITE | 3 | 3 | 25.8× | 77 | 44 | 27.5% | 332→3(all), 318→3(strongest), 395→3(random) |
| src/data/events/boss/normal/meteorGolem.ts | Meteor Golem | 57 | WRITE | 3 | 3 | 26.2× | 79 | 45 | 28.1% | 328→3(strongest), 315→3(all), 388→3(all) |
| src/data/events/boss/normal/primalAvatar.ts | Primal Avatar | 57 | WRITE | 3 | 3 | 26.2× | 79 | 45 | 28.1% | 348→3(random), 402→3(all) |
| src/data/events/boss/normal/doppelgangerHive.ts | Doppelganger Hive | 58 | WRITE | 3 | 3 | 26.7× | 80 | 46 | 28.7% | 355→3(weakest), 345→3(random), 412→3(all) |
| src/data/events/boss/normal/stormHerald.ts | Storm Herald | 58 | WRITE | 3 | 3 | 26.7× | 80 | 46 | 28.7% | 338→3(strongest), 322→3(all), 398→3(random) |
| src/data/events/boss/normal/adamantDragon.ts | Adamant Dragon | 59 | WRITE | 3 | 2 | 27.1× | 81 | 46 | 28.7% | 362→3(all), 362→3(all), 348→2(strongest), 348→2(strongest), 420→3(all), 420→3(all) |
| src/data/events/boss/normal/boneEmperor.ts | Bone Emperor | 59 | WRITE | 3 | 2 | 27.1× | 81 | 46 | 28.7% | 365→3(all), 352→2(strongest), 418→3(all) |
| src/data/events/boss/normal/fallenSeraph.ts | Fallen Seraph | 60 | WRITE | 6 | 5 | 27.6× | 165 | 62 | 36.5% | 358→5(random), 345→6(all), 415→6(all) |
| src/data/events/boss/normal/swordSaint.ts | Sword Saint | 60 | WRITE | 6 | 5 | 27.6× | 165 | 62 | 36.5% | 358→5(strongest), 372→6(all), 425→5(strongest) |
| src/data/events/boss/normal/hurricanePrince.ts | Hurricane Prince | 61 | WRITE | 6 | 4 | 28.0× | 168 | 63 | 37.1% | 378→4(strongest), 365→6(all), 435→6(all) |
| src/data/events/boss/normal/grimoireDemon.ts | Grimoire Demon | 62 | WRITE | 6 | 4 | 28.4× | 171 | 64 | 37.6% | 385→4(strongest), 372→6(all), 442→6(all) |
| src/data/events/boss/normal/voidWyrm.ts | Void Wyrm | 63 | WRITE | 6 | 4 | 28.9× | 173 | 65 | 38.2% | 395→4(weakest), 382→6(all), 448→4(random) |
| src/data/events/boss/normal/painArchitect.ts | Pain Architect | 64 | WRITE | 6 | 4 | 29.4× | 176 | 66 | 38.8% | 398→4(strongest), 385→6(all), 452→6(all) |
| src/data/events/boss/normal/dualistElemental.ts | Dualist Elemental | 65 | WRITE | 6 | 4 | 29.8× | 179 | 67 | 37.2% | 418→4(strongest), 405→6(all), 468→6(all) |
| src/data/events/boss/normal/mechOverlord.ts | Mech Overlord | 65 | WRITE | 6 | 4 | 29.8× | 179 | 67 | 37.2% | 402→6(all), 388→4(random), 455→6(all) |
| src/data/events/boss/normal/voidReavers.ts | The Void Reavers | 65 | WRITE | 6 | 4 | 29.8× | 179 | 67 | 37.2% | 330→6(all), 540→6(all), 240→4(random), 420→6(all) |
| src/data/events/boss/normal/grailGuardian.ts | Grail Guardian | 66 | WRITE | 6 | 4 | 30.3× | 182 | 69 | 38.3% | 408→4(strongest), 395→6(all), 458→6(all) |
| src/data/events/boss/normal/plagueLich.ts | Plague Lich | 66 | WRITE | 6 | 4 | 30.3× | 182 | 69 | 38.3% | 408→4(strongest), 395→6(all), 462→6(all) |
| src/data/events/boss/normal/archmageShade.ts | Archmage Shade | 67 | WRITE | 6 | 4 | 30.7× | 184 | 70 | 38.9% | 415→6(all), 402→6(all), 465→6(all) |
| src/data/events/boss/normal/wildfireAncient.ts | Wildfire Ancient | 67 | WRITE | 6 | 4 | 30.7× | 184 | 70 | 38.9% | 392→6(all), 378→6(all), 445→6(all) |
| src/data/events/boss/normal/abyssalLeviathan.ts | Abyssal Leviathan | 68 | WRITE | 6 | 4 | 31.2× | 187 | 71 | 39.4% | 422→4(strongest), 408→6(all), 472→6(all) |
| src/data/events/boss/normal/bladeSeraph.ts | Blade Seraph | 68 | WRITE | 6 | 4 | 31.2× | 187 | 71 | 39.4% | 418→4(weakest), 405→4(strongest), 468→6(all) |
| src/data/events/boss/normal/moonBeast.ts | Moon Beast | 68 | WRITE | 6 | 4 | 31.2× | 187 | 71 | 39.4% | 425→6(all), 412→6(all), 478→4(random) |
| src/data/events/boss/normal/aberrantSovereign.ts | Aberrant Sovereign | 69 | WRITE | 6 | 4 | 31.6× | 190 | 72 | 40.0% | 438→4(strongest), 422→6(all), 488→4(random) |
| src/data/events/boss/normal/crystalLeviathan.ts | Crystal Leviathan | 69 | WRITE | 6 | 4 | 31.6× | 190 | 72 | 40.0% | 425→6(all), 412→4(strongest), 475→4(random) |
| src/data/events/boss/normal/forgeColossus.ts | Forge Colossus | 69 | WRITE | 6 | 4 | 31.6× | 190 | 72 | 40.0% | 432→6(all), 418→4(random), 485→6(all) |
| src/data/events/boss/normal/behemothKing.ts | Behemoth King | 70 | WRITE | 12 | 9 | 32.0× | 385 | 82 | 43.2% | 442→9(strongest), 428→9(weakest), 492→12(all) |
| src/data/events/boss/normal/nightmareWeaver.ts | Nightmare Weaver | 70 | WRITE | 12 | 9 | 32.0× | 385 | 82 | 43.2% | 432→9(strongest), 418→12(all), 482→12(all) |
| src/data/events/boss/normal/thoughtEater.ts | Thought Eater | 70 | WRITE | 12 | 9 | 32.0× | 385 | 82 | 43.2% | 448→9(strongest), 435→12(all), 498→12(all) |
| src/data/events/boss/normal/dimensionRipper.ts | Dimension Ripper | 72 | WRITE | 11 | 8 | 33.0× | 362 | 77 | 40.5% | 465→11(all), 452→11(all), 518→8(random) |
| src/data/events/boss/normal/cosmicDragon.ts | Cosmic Dragon | 73 | WRITE | 11 | 8 | 33.4× | 367 | 79 | 41.6% | 478→8(weakest), 478→8(weakest), 465→11(all), 465→11(all), 528→11(all), 528→11(all) |
| src/data/events/boss/normal/titanBreaker.ts | Titan Breaker | 74 | WRITE | 11 | 8 | 33.9× | 372 | 80 | 42.1% | 485→8(strongest), 472→8(strongest), 532→11(all) |
| src/data/events/boss/normal/chronoWarden.ts | Chrono Warden | 75 | WRITE | 11 | 9 | 34.3× | 377 | 81 | 40.5% | 420→11(all), 390→11(all), 510→11(all) |
| src/data/events/boss/normal/entropyLord.ts | Entropy Lord | 75 | WRITE | 11 | 9 | 34.3× | 377 | 81 | 40.5% | 485→11(all), 472→11(all), 538→11(all) |
| src/data/events/boss/normal/deathIncarnate.ts | Death Incarnate | 76 | WRITE | 11 | 8 | 34.8× | 382 | 82 | 41.0% | 498→8(random), 485→11(all), 545→11(all) |
| src/data/events/boss/normal/elderHorror.ts | Elder Horror | 78 | WRITE | 11 | 8 | 35.6× | 392 | 84 | 42.0% | 505→8(strongest), 492→11(all), 552→11(all) |
| src/data/events/boss/normal/shadowParliament.ts | Shadow Parliament | 79 | WRITE | 11 | 8 | 36.1× | 397 | 85 | 42.5% | 512→8(random), 498→11(all), 558→11(all) |
| src/data/events/boss/normal/weaponAbsolute.ts | Weapon Absolute | 80 | WRITE | 26 | 19 | 36.6× | 950 | 99 | 47.1% | 518→19(strongest), 505→19(weakest), 565→26(all) |
| src/data/events/boss/normal/stormTyrant.ts | Storm Tyrant | 81 | WRITE | 26 | 19 | 37.0× | 962 | 100 | 47.6% | 525→19(strongest), 512→26(all), 572→26(all) |
| src/data/events/boss/normal/memoryPhantom.ts | Memory Phantom | 82 | WRITE | 25 | 19 | 37.5× | 936 | 97 | 46.2% | 518→25(all), 505→25(all), 578→25(all) |
| src/data/events/boss/normal/starEater.ts | Star Eater | 83 | WRITE | 25 | 19 | 37.9× | 948 | 99 | 47.1% | 538→25(all), 525→25(all), 585→25(all) |
| src/data/events/boss/normal/primordialWyrm.ts | Primordial Wyrm | 84 | WRITE | 25 | 19 | 38.4× | 959 | 100 | 47.6% | 545→19(strongest), 532→25(all), 592→25(all) |
| src/data/events/boss/normal/destinyBreaker.ts | Destiny Breaker | 85 | WRITE | 26 | 19 | 38.8× | 1009 | 105 | 47.7% | 545→19(strongest), 532→26(all), 592→19(random) |
| src/data/events/boss/normal/primordialTitan.ts | Primordial Titan | 85 | WRITE | 26 | 19 | 38.8× | 1009 | 105 | 47.7% | 510→26(all), 480→26(all), 600→26(all) |
| src/data/events/boss/normal/realityAnchor.ts | Reality Anchor | 86 | WRITE | 25 | 19 | 39.3× | 981 | 102 | 46.4% | 558→19(strongest), 545→25(all), 598→19(random) |
| src/data/events/boss/normal/demonEmperor.ts | Demon Emperor | 87 | WRITE | 25 | 19 | 39.7× | 993 | 103 | 46.8% | 565→19(strongest), 552→25(all), 605→25(all) |
| src/data/events/boss/normal/genesisCell.ts | Genesis Cell | 88 | WRITE | 25 | 19 | 40.1× | 1004 | 104 | 47.3% | 578→25(all), 565→19(weakest), 618→19(random) |
| src/data/events/boss/normal/infinityMage.ts | Infinity Mage | 89 | WRITE | 24 | 18 | 40.6× | 974 | 101 | 45.9% | 572→24(all), 558→24(all), 612→24(all) |
| src/data/events/boss/normal/paradoxEngine.ts | Paradox Engine | 90 | WRITE | 49 | 37 | 41.1× | 2011 | 119 | 51.7% | 598→37(strongest), 585→49(all), 632→37(random) |
| src/data/events/boss/normal/singularity.ts | Singularity | 91 | WRITE | 49 | 36 | 41.5× | 2034 | 121 | 52.6% | 592→36(strongest), 578→49(all), 625→49(all) |
| src/data/events/boss/normal/juggernautPrime.ts | Juggernaut Prime | 92 | WRITE | 48 | 36 | 42.0× | 2014 | 119 | 51.7% | 672→36(strongest), 658→48(all), 685→48(all) |
| src/data/events/boss/normal/ultimateWarrior.ts | Ultimate Warrior | 93 | WRITE | 48 | 36 | 42.4× | 2035 | 121 | 52.6% | 618→48(all), 605→36(strongest), 645→36(strongest) |
| src/data/events/boss/normal/dungeonHeart.ts | Dungeon Heart | 94 | WRITE | 47 | 35 | 42.9× | 2014 | 119 | 51.7% | 612→47(all), 598→35(strongest), 638→47(all) |
| src/data/events/boss/normal/chronosPrime.ts | Chronos Prime | 95 | WRITE | 49 | 36 | 43.3× | 2122 | 126 | 52.5% | 652→49(all), 638→49(all), 658→49(all) |
| src/data/events/boss/normal/apocalypseBeast.ts | Apocalypse Beast | 96 | WRITE | 48 | 36 | 43.8× | 2100 | 125 | 52.1% | 645→48(all), 632→48(all), 665→48(all) |
| src/data/events/boss/normal/universeArchitect.ts | Universe Architect | 97 | WRITE | 48 | 36 | 44.2× | 2122 | 126 | 52.5% | 638→48(all), 625→48(all), 652→48(all) |
| src/data/events/boss/normal/conceptDestroyer.ts | Concept Destroyer | 98 | WRITE | 47 | 35 | 44.6× | 2099 | 124 | 51.7% | 658→35(strongest), 645→47(all), 672→47(all) |
| src/data/events/boss/normal/omegaEntity.ts | Omega Entity | 99 | WRITE | 47 | 35 | 45.1× | 2120 | 126 | 52.5% | 665→47(all), 652→35(strongest), 678→47(all) |

## Zone Bosses (2× boost)
> Boost: **2×** applied on top of tier targetNetHpPct

| File | Title | Floor | Status | AllBase | SingBase | Scale× | Scaled | NetDmg | NetHP% | Changes |
|------|-------|-------|--------|---------|----------|--------|--------|--------|--------|---------|
| src/data/events/boss/zone/zoneBoss10.ts | The Dungeon Warden | 10 | WRITE | 5 | 4 | 5.0× | 25 | 25 | 35.7% | 20→5(all), 15→5(all), 25→5(all) |
| src/data/events/boss/zone/zoneBoss20.ts | Corrupted Drake | 20 | WRITE | 4 | 3 | 9.6× | 38 | 36 | 40.0% | 60→3(strongest), 50→4(all), 80→4(all) |
| src/data/events/boss/zone/zoneBoss30.ts | Demon Prince Azrathos | 30 | WRITE | 4 | 3 | 14.1× | 56 | 48 | 43.6% | 245→4(all), 88→3(random), 140→4(all), 193→4(all) |
| src/data/events/boss/zone/zoneBoss40.ts | Herald of the Void | 40 | WRITE | 5 | 4 | 18.6× | 93 | 68 | 52.3% | 210→5(all), 175→5(all), 245→5(all) |
| src/data/events/boss/zone/zoneBoss50.ts | Avatar of Eternal Winter | 50 | WRITE | 7 | 5 | 23.1× | 161 | 92 | 61.3% | 300→7(all), 240→7(all), 340→7(all) |
| src/data/events/boss/zone/zoneBoss60.ts | The Twin Archons | 60 | WRITE | 12 | 9 | 27.6× | 331 | 125 | 73.5% | 380→12(all), 480→12(all), 160→9(random), 400→12(all) |
| src/data/events/boss/zone/zoneBoss70.ts | Death Incarnate | 70 | WRITE | 23 | 17 | 32.0× | 737 | 158 | 83.2% | 600→23(all), 280→23(all), 440→23(all) |
| src/data/events/boss/zone/zoneBoss80.ts | The Fate Weaver | 80 | WRITE | 52 | 39 | 36.6× | 1901 | 198 | 94.3% | 630→52(all), 405→52(all), 563→52(all) |
| src/data/events/boss/zone/zoneBoss90.ts | The Nightmare King | 90 | WRITE | 98 | 74 | 41.1× | 4023 | 239 | 103.9% | 495→98(all), 450→98(all), 630→98(all) |

## Final Boss (3.5× boost)
> Boost: **3.5×** applied on top of tier targetNetHpPct

| File | Title | Floor | Status | AllBase | SingBase | Scale× | Scaled | NetDmg | NetHP% | Changes |
|------|-------|-------|--------|---------|----------|--------|--------|--------|--------|---------|
| src/data/events/boss/zone/finalBoss.ts | The Dungeon Lord | 100 | WRITE | 162 | 121 | 45.6× | 7379 | 438 | 182.5% | 1450→162(all), 1250→162(all), 1375→162(all), 1500→162(all), 2000→162(all) |

---
**192** bosses total — **192** needed changes — **192** files updated.
