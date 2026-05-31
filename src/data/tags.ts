/**
 * Central event tag registry.
 *
 * Import TAGS here instead of using raw strings so everything stays in sync.
 * Biomes reference these values in their `allowedTags` array.
 * Events reference them in their `tags` array.
 *
 * Usage:
 *   import { TAGS } from '@data/tags'
 *   tags: [TAGS.UNDEAD, TAGS.SKELETON]
 */
export const TAGS = {
  // ── Creature families ──────────────────────────────────────────────────────
  BEAST:        'beast',
  GOBLIN:       'goblin',
  ORC:          'orc',
  TROLL:        'troll',
  HUMANOID:     'humanoid',
  UNDEAD:       'undead',
  SKELETON:     'skeleton',
  ZOMBIE:       'zombie',
  GHOST:        'ghost',
  WRAITH:       'wraith',
  LICH:         'lich',
  DEMON:        'demon',
  DEVIL:        'devil',
  ELEMENTAL:    'elemental',
  SPIRIT:       'spirit',
  CONSTRUCT:    'construct',
  GOLEM:        'golem',
  AUTOMATON:    'automaton',
  PLANT:        'plant',
  OOZE:         'ooze',
  FUNGUS:       'fungus',
  INSECT:       'insect',
  SPIDER:       'spider',
  BAT:          'bat',
  SNAKE:        'snake',
  DRAGON:       'dragon',
  DRAKE:        'drake',
  WOLF:         'wolf',
  COSMIC:       'cosmic',
  VOID:         'void',
  ABERRATION:   'aberration',
  CELESTIAL:    'celestial',
  FAE:          'fae',
  CULTIST:      'cultist',
  KNIGHT:       'knight',
  MIMIC:        'mimic',
  LYCANTHROPE:  'lycanthrope',
  SHAPESHIFTER: 'shapeshifter',
  VAMPIRE:      'vampire',
  DJINN:        'djinn',
  RAT:          'rat',
  SWARM:        'swarm',

  // ── Elemental / damage flavours ────────────────────────────────────────────
  FIRE:         'fire',
  ICE:          'ice',
  LIGHTNING:    'lightning',
  POISON:       'poison',
  ACID:         'acid',
  EARTH:        'earth',
  SHADOW:       'shadow',
  ARCANE:       'arcane',
  BLOOD:        'blood',
  PLAGUE:       'plague',
  CHAOS:        'chaos',
  STORM:        'storm',
  NIGHTMARE:    'nightmare',
  CHRONO:       'chrono',
  CRYSTAL:      'crystal',
  AQUATIC:      'aquatic',
  TITAN:        'titan',

  // ── Environments ───────────────────────────────────────────────────────────
  DUNGEON:      'dungeon',
  CAVE:         'cave',
  UNDERGROUND:  'underground',
  FOREST:       'forest',
  SWAMP:        'swamp',
  VOLCANIC:     'volcanic',
  ARCTIC:       'arctic',
  RUINS:        'ruins',
  INFERNAL:     'infernal',
  MECHANICAL:   'mechanical',
  ETHEREAL:     'ethereal',
  ABYSS:        'abyss',
  COSMIC_ENV:   'cosmic-env',
} as const

/** Union of every registered tag value. */
export type EventTag = typeof TAGS[keyof typeof TAGS]
