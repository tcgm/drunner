import type { DungeonEvent } from '@/types'
import { GiCrossedSwords } from 'react-icons/gi'

export const RIVAL_ADVENTURERS: DungeonEvent = {
  id: 'rival-adventurers',
  type: 'choice',
  title: 'Rival Adventurers',
  description: 'You round a corner and find yourselves face-to-face with another adventuring party. They\'re bloodied and battle-worn, clutching weapons and eyeing your equipment with barely concealed greed. Their leader - a scarred warrior with cold eyes - steps forward. "This floor\'s treasure is ours. Turn back now, or we\'ll add your gear to our collection." Behind them, you notice fresh loot scattered on the ground. They\'ve been here a while, and they\'re not leaving without a fight.',
  choices: [
    {
      text: 'Challenge them to honorable combat',
      outcome: {
        text: 'You step forward, weapon raised. "We settle this the old way - party against party, winner takes all." The rival leader grins with respect. The battle is fierce and bloody, weapons clashing in the narrow corridor. Their mage hurls fire while your warriors press forward. Eventually, your superior teamwork prevails - they yield, battered but alive. With grudging respect, they hand over their recent spoils and limp away. "We\'ll remember this," their leader calls back. "Next time, we won\'t go easy on you."',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 120 },
          { type: 'gold', value: 200 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Negotiate a peaceful split',
      requirements: {
        gold: 100,
      },
      outcome: {
        text: 'You place a pouch of gold on the ground between you. "There\'s enough dungeon for everyone. Take this as a gesture of good faith, and we share what we find on this floor." The rival party\'s rogue counts the coins, then nods. "Fair enough. But we\'re watching you - try anything clever and the deal\'s off." You proceed cautiously, occasionally glimpsing them in adjacent passages. At the floor\'s end, you meet to divide the spoils. They take the best items, but there\'s still value left for you. As you part ways, their cleric mutters a blessing over you - perhaps there\'s honor among treasure hunters after all.',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'xp', value: 80 },
          { type: 'gold', value: 120 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 3 },
        ],
      },
    },
    {
      text: 'Propose a temporary alliance',
      outcome: {
        text: '"Look, we\'re all bleeding, we\'re all tired, and there\'s something worse deeper in." You gesture at the claw marks on the walls. "Whatever made those is still down here. Two parties stand a better chance than one." The rival leader considers, then nods curtly. "One floor. Then we split ways." Together, you clear the next section with brutal efficiency. Their berserker charges while your mage provides cover fire. When a pack of undead ambushes you from a side passage, both parties work as one machine. At the floor\'s end, the rival leader clasps your arm. "You fight well. Here - take this. If we meet again... well, maybe we won\'t be enemies." They press a share of loot into your hands before descending deeper.',
        effects: [
          { type: 'heal', target: 'all', value: 30 },
          { type: 'xp', value: 140 },
          { type: 'gold', value: 150 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 8 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Sneak past while they argue (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You signal your party to hold position while you scout ahead. The rival party is distracted, arguing over how to divide their recent haul. "I found it!" "But I killed the guardian!" Their voices echo in the stone corridor. Using every trick you know - shadows, silence spells, careful footwork - you lead your party through a side passage they haven\'t noticed. As you slip past, you spot an unguarded pack near their cleric. Your fingers are already moving before you think twice. A quick grab, a silent retreat, and you\'re past them. Minutes later, angry shouts echo behind you. "Where did they go?!" "And where\'s my healing potion bag?!" You grin - the roguish way is often the most profitable.',
        effects: [
          { type: 'xp', value: 100 },
          { type: 'gold', value: 80 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 6 },
        ],
      },
    },
    {
      text: 'Attempt intimidation (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 35,
      },
      successChance: 0.6,
      statModifier: 'attack',
      successOutcome: {
        text: 'You step forward, weapons gleaming, and the sheer aura of power radiating from your party makes the air heavy. "We\'ve killed things down here that would haunt your nightmares. Cleared floors you couldn\'t survive. See these weapons? Still wet with blood from the last party that challenged us." Your strongest warrior flexes, armor clanking. "So here\'s what\'s going to happen - you leave everything valuable, and you walk away with your lives." The rival leader looks at their party - exhausted, wounded, outclassed. "Take it," they mutter. "All of it. Let\'s get out of here." They flee, abandoning their hard-won treasure. Your reputation grows.',
        effects: [
          { type: 'xp', value: 160 },
          { type: 'gold', value: 300 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 8 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 5 },
        ],
      },
      failureOutcome: {
        text: 'You try to appear threatening, but the rival leader just laughs. "Nice try, but we\'ve seen scarier things in the tavern." Their archer nocks an arrow. "You want our stuff? Come and take it." What follows is a chaotic, brutal melee. They fight dirty - poisoned blades, trip wires, alchemical bombs. You win eventually, but at great cost. As the last rival falls, you realize the treasure they were guarding has been destroyed in the fighting. Nothing left but broken pottery and your wounds. The rival leader, bleeding out, smiles grimly. "If I can\'t have it... neither can you."',
        effects: [
          { type: 'damage', target: 'all', value: 65, isTrueDamage: true },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Appeal to their better nature (Paladin/Cleric)',
      requirements: {
        class: 'Paladin',
      },
      outcome: {
        text: '"We\'re all adventurers here," you say, stepping forward with open hands. "We all risk our lives in the dark, fighting monsters, searching for glory. Are we really going to kill each other over gold and trinkets? There\'s enough suffering in this dungeon without adding to it." Your words carry the weight of divine conviction, and holy light subtly glows around you. The rival party shifts uncomfortably. Their cleric speaks up: "They\'re right. We didn\'t come here to murder other adventurers." The leader hesitates, then sighs. "Fine. You can pass. Take this - call it a peace offering." They toss you a valuable item. "Maybe we\'ll work together sometime. If we both survive this hell." You exchange respectful nods and part ways, a rare moment of honor in the depths.',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 100 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiCrossedSwords,
}
