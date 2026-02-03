import type { DungeonEvent } from '@/types'
import { GiPublicSpeaker } from 'react-icons/gi'

export const CHARISMATIC_LEADER: DungeonEvent = {
  id: 'charismatic-leader',
  type: 'choice',
  title: 'Dungeon Denizens',
  description: 'A ragged band of dungeon creatures huddles in the shadows—goblins, kobolds, and other forsaken beings. Their eyes are desperate, searching for purpose. They look to you for leadership, or perhaps just mercy.',
  choices: [
    {
      text: 'Inspire them with a rousing speech (High Charisma)',
      requirements: { stat: 'charisma', minValue: 28 },
      successChance: 0.75,
      statModifier: 'charisma',
      successOutcome: {
        text: 'Your passionate words ignite a fire in their hearts! They pledge themselves as loyal followers, sharing their hidden treasures and knowledge.',
        effects: [
          { type: 'heal', target: 'all', value: 60 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 150 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'rare'
          },
        ],
      },
      failureOutcome: {
        text: 'Your speech is too grandiose—they sense insincerity and turn hostile!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Lead by example—demonstrate strength (High Attack)',
      requirements: { stat: 'attack', minValue: 35 },
      successChance: 0.65,
      statModifier: 'attack',
      successOutcome: {
        text: 'You single-handedly defeat their strongest warrior in honorable combat. They bow before your might and offer tribute.',
        effects: [
          { type: 'damage', target: 'random', value: 30 },
          { type: 'xp', value: 180 },
          { type: 'gold', value: 120 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'rare'
          },
        ],
      },
      failureOutcome: {
        text: 'The duel goes poorly—you barely survive, and they mock your weakness.',
        effects: [
          { type: 'damage', target: 'random', value: 70 },
          { type: 'xp', value: 60 },
        ],
      },
    },
    {
      text: 'Share wisdom and knowledge (High Wisdom)',
      requirements: { stat: 'wisdom', minValue: 25 },
      successChance: 0.70,
      statModifier: 'wisdom',
      successOutcome: {
        text: 'You teach them survival tactics and dungeon lore. Grateful, they share ancient secrets and hidden paths.',
        effects: [
          { type: 'xp', value: 220 },
          { type: 'gold', value: 100 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'rare'
          },
        ],
      },
      failureOutcome: {
        text: 'Your lessons are too complex—they grow frustrated and drive you away.',
        effects: [
          { type: 'damage', target: 'random', value: 35 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Unite them with revolutionary fervor (Very High Charisma)',
      requirements: { stat: 'charisma', minValue: 38 },
      outcome: {
        text: 'Your words spark a revolutionary fire! The creatures unite in solidarity, forming a collective to resist their oppressors. They shower you with gifts and pledge eternal friendship.',
        effects: [
          { type: 'heal', target: 'all', value: 80 },
          { type: 'xp', value: 300 },
          { type: 'gold', value: 250 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'veryRare'
          },
          { 
            type: 'consumable',
            itemType: 'consumable',
            minRarity: 'rare'
          },
        ],
      },
    },
    {
      text: 'Organize a tactical uprising (Very High Attack)',
      requirements: { stat: 'attack', minValue: 45 },
      outcome: {
        text: 'Your martial prowess and tactical brilliance inspire a coordinated rebellion! The creatures arm themselves and prepare to overthrow their oppressors, sharing their war spoils with you.',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 280 },
          { type: 'gold', value: 220 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'veryRare'
          },
          { 
            type: 'consumable',
            itemType: 'consumable',
            minRarity: 'rare'
          },
        ],
      },
    },
    {
      text: 'Foster a philosophical collective (Very High Wisdom)',
      requirements: { stat: 'wisdom', minValue: 35 },
      outcome: {
        text: 'Your profound wisdom guides them to form a new society based on mutual aid and shared knowledge. Deeply moved, they gift you their most precious relics.',
        effects: [
          { type: 'xp', value: 320 },
          { type: 'gold', value: 200 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'veryRare'
          },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'rare'
          },
        ],
      },
    },
    {
      text: 'Offer gold for assistance (80 gold)',
      requirements: { gold: 80 },
      successChance: 0.80,
      successOutcome: {
        text: 'They accept your payment graciously and help clear dangerous paths ahead.',
        effects: [
          { type: 'gold', value: -80 },
          { type: 'xp', value: 120 },
        ],
      },
      failureOutcome: {
        text: 'They take your gold and betray you, ambushing your party!',
        effects: [
          { type: 'gold', value: -80 },
          { type: 'damage', target: 'all', value: 50 },
          { type: 'xp', value: 70 },
        ],
      },
    },
    {
      text: 'Command them without authority',
      successChance: 0.30,
      successOutcome: {
        text: 'Surprisingly, your authoritative tone cows them into submission. They obey reluctantly.',
        effects: [
          { type: 'xp', value: 100 },
          { type: 'gold', value: 50 },
        ],
      },
      failureOutcome: {
        text: 'They attack you for your arrogance and presumption!',
        effects: [
          { type: 'damage', target: 'all', value: 45 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Show mercy and kindness (Luck)',
      requirements: { stat: 'luck', minValue: 20 },
      outcome: {
        text: 'Your genuine compassion touches their hearts. By fortune, their shaman blesses your party with protective wards.',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 80 },
          { 
            type: 'consumable',
            itemType: 'consumable',
            minRarity: 'uncommon'
          },
        ],
      },
    },
    {
      text: 'Leave them be',
      successChance: 0.50,
      successOutcome: {
        text: 'You move on without incident. They seem relieved by your non-interference.',
        effects: [
          { type: 'xp', value: 30 },
        ],
      },
      failureOutcome: {
        text: 'They mistake your departure for cowardice and attack from behind!',
        effects: [
          { type: 'damage', target: 'random', value: 40 },
          { type: 'xp', value: 40 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiPublicSpeaker,
}
