import type { DungeonEvent } from '@/types'

export const KITSUNE_SHRINE: DungeonEvent = {
  id: 'kitsune-shrine',
  type: 'rest',
  title: 'Shrine of the Nine-Tailed Fox',
  description: 'A mischievous kitsune with nine flowing tails lounges at an ornate shrine, eyeing your party with playful interest.',
  choices: [
    {
      text: 'Ask for her blessing (requires high Luck ≥ 15)',
      requirements: {
        stat: 'luck',
        minValue: 15,
      },
      outcome: {
        text: 'Impressed by your fortune, the kitsune grants you her blessing! Your party feels incredibly lucky!',
        effects: [
          { type: 'heal', target: 'all', value: 80 },
          { type: 'gold', value: 150 },
          { type: 'xp', value: 120 },
        ],
      },
    },
    {
      text: 'Let the Rogue try their luck',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'The Rogue\'s natural luck resonates with the kitsune! She rewards your kindred spirit!',
        effects: [
          { type: 'heal', target: 'all', value: 70 },
          { type: 'gold', value: 200 },
        ],
      },
    },
    {
      text: 'Have the Bard charm her',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'The Bard\'s performance delights the kitsune! She claps and showers you with gifts!',
        effects: [
          { type: 'heal', target: 'all', value: 90 },
          { type: 'revive', target: 'all', value: 60 },
          { type: 'xp', value: 100 },
        ],
      },
    },
    {
      text: 'Make an offering at the shrine',
      requirements: {
        gold: 100,
      },
      outcome: {
        text: 'The kitsune accepts your offering with a sly smile and blesses you.',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'heal', target: 'all', value: 60 },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Try to trick the trickster',
      requirements: {
        gold: 50,
      },
      outcome: {
        text: 'You attempt to outwit the fox spirit, but she sees through your ruse immediately! She laughs and plays a trick on you instead!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'gold', value: -50 },
        ],
      },
    },
    {
      text: 'Flatter her appearance',
      outcome: {
        text: 'The kitsune giggles at your compliments but decides to test you with an illusion! You barely escape unharmed.',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Leave quietly',
      outcome: {
        text: 'The kitsune pouts as you leave but tosses a small pouch of gold after you anyway.',
        effects: [
          { type: 'gold', value: 30 },
        ],
      },
    },
  ],
  depth: 4,
}
