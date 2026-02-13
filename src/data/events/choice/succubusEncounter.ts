import type { DungeonEvent } from '@/types'
import { GiLips } from 'react-icons/gi'

export const SUCCUBUS_ENCOUNTER: DungeonEvent = {
    id: 'succubus-encounter',
    type: 'choice',
    title: 'Succubus Temptation',
    description: [
        'A seductive figure emerges from the shadows, her eyes gleaming with otherworldly allure. The succubus smiles knowingly, her presence both intoxicating and dangerous. "Adventurers..." she purrs, "Shall we play?"',
        'Crimson wings unfold as a beautiful demon steps into view, her gaze penetrating your very soul. "Lost, are we?" the succubus asks with a knowing smile. "Perhaps I can help... for a price."',
        'The air grows heavy with perfume as a succubus materializes before you. She stretches languidly, her tail swishing with amusement. "You\'ve wandered far from safety, little mortals. Care to test your resolve?"',
        'A sultry laugh echoes through the chamber as a demoness appears, draped in shadows and moonlight. "How delightful," she muses, circling your party. "It\'s been so long since I\'ve had... company."'
    ],
    choices: [
        {
            text: 'Endure kisses (High Defense)',
            requirements: { stat: 'defense', minValue: 30 },
            successChance: 0.70,
            statModifier: 'defense',
            successOutcome: {
                text: [
                    'You steel yourself against her draining embrace. The succubus, impressed by your resilience, rewards you with dark gifts and forbidden knowledge before departing.',
                    'Her kisses drain at your vitality, but you endure. "Such... strength," she gasps, pulling away with newfound respect. She leaves behind treasures and whispered secrets.',
                    'The life-draining caress threatens to overwhelm you, but you stand firm. Surprised and intrigued, the succubus laughs melodiously. "Remarkable. Take these—you\'ve earned them."',
                    'Each kiss saps your strength, yet you refuse to fall. The succubus\'s eyes widen with admiration. "You are... different. Here, a token of my favor." She vanishes with a wink.'
                ],
                effects: [
                    { type: 'damage', target: 'random', value: 40 },
                    { type: 'xp', value: 250 },
                    { type: 'gold', value: 180 },
                    {
                        type: 'item',
                        itemType: 'random',
                        minRarity: 'rare',
                        rarityBoost: 20
                    },
                ],
            },
            failureOutcome: {
                text: [
                    'Her kisses drain your very life force! You barely push her away, weakened but alive.',
                    'The draining touch is overwhelming. You collapse, gasping for breath as she feeds. She departs satisfied, leaving you barely conscious.',
                    'Your defenses crumble under her assault. Life energy pours from you until she finally pulls away. "Delicious," she whispers, disappearing.',
                    'Too weak to resist, you feel your essence drain away. When she finally releases you, the world spins. "So fragile," she tuts before vanishing.'
                ],
                effects: [
                    { type: 'damage', target: 'random', value: 85 },
                    { type: 'xp', value: 100 },
                ],
            },
        },
        {
            text: 'Resist with willpower (High Wisdom)',
            requirements: { stat: 'wisdom', minValue: 28 },
            successChance: 0.75,
            statModifier: 'wisdom',
            successOutcome: {
                text: [
                    'Your mental fortitude breaks through her enchantments. Frustrated but respectful, she vanishes—leaving behind tribute to your strong will.',
                    'You feel the charm magic trying to take hold, but your mind is a fortress. The succubus frowns, then smirks. "Clever mortal. You\'ve earned this." She fades away.',
                    'Her enchantments wash over you like water off stone. She stamps her foot in mock frustration. "Fine! Take your prize, iron-willed one."',
                    'Willpower anchors you against her psychic assault. "Impossible!" she exclaims. After a moment, she laughs. "Well played. Here\'s your reward."'
                ],
                effects: [
                    { type: 'xp', value: 220 },
                    { type: 'gold', value: 150 },
                    {
                        type: 'item',
                        itemType: 'random',
                        minRarity: 'uncommon',
                        rarityBoost: 15
                    },
                ],
            },
            failureOutcome: {
                text: [
                    'Her charm overwhelms your defenses. You snap out of it hours later, dizzy and depleted.',
                    'The enchantment crashes through your mental barriers. Time becomes meaningless. When awareness returns, she is gone and you are drained.',
                    'Her magic proves too strong. Your will crumbles as she toys with your mind. Eventually, she tires of the game and leaves you collapsed.',
                    'The spell takes hold instantly. You become her puppet, dancing to her whims until she grows bored and releases you, laughing.'
                ],
                effects: [
                    { type: 'damage', target: 'all', value: 50 },
                    { type: 'xp', value: 70 },
                ],
            },
        },
        {
            text: 'Charm her back (High Charisma)',
            requirements: { stat: 'charisma', minValue: 32 },
            successChance: 0.60,
            statModifier: 'charisma',
            successOutcome: {
                text: [
                    'You match her wit and charm with your own! Delighted by the challenge, she grants you a powerful boon and promises to remember you.',
                    'Your silver tongue and charisma catch her off-guard. She laughs with genuine delight! "Fascinating! I simply must reward such boldness." She bestows lavish gifts.',
                    'The demon finds herself charmed by *you* instead. "Oh my," she breathes, clearly smitten. "Take these treasures, and know that you\'ve made an impression."',
                    'You flirt, jest, and banter as equals. The succubus is thoroughly enchanted. "I haven\'t had this much fun in centuries! Here—and do come visit again."'
                ],
                effects: [
                    { type: 'heal', target: 'random', value: 50 },
                    { type: 'xp', value: 280 },
                    { type: 'gold', value: 200 },
                    {
                        type: 'item',
                        itemType: 'random',
                        minRarity: 'rare',
                        rarityBoost: 25
                    },
                ],
            },
            failureOutcome: {
                text: [
                    'She laughs at your clumsy advances and toys with you cruelly before disappearing.',
                    'Your attempts at charm fall embarrassingly flat. The succubus cackles. "How adorable! Let me show you how it\'s really done." She toys with you mercilessly.',
                    'Every word you speak makes things worse. She grins wickedly, enjoying your humiliation. "Oh, this is too good!" She extracts a painful price for her amusement.',
                    'Your flirtations are met with mocking laughter. "Really? That\'s your best?" She teaches you a harsh lesson before vanishing, still giggling.'
                ],
                effects: [
                    { type: 'damage', target: 'random', value: 60 },
                    { type: 'xp', value: 90 },
                    { type: 'gold', value: -50 },
                ],
            },
        },
        {
            text: 'Attack immediately',
            outcome: {
                text: [
                    'You strike before she can react! The succubus transforms into mist, cursing you before fleeing.',
                    'Your weapon flashes out in a surprise attack. She shrieks, dissolving into smoke. "Mortals!" she hisses. "Always so violent!" Her voice fades with her form.',
                    'You don\'t give her a chance to speak. Steel finds flesh before she can react. With a cry of rage, she dissipates, leaving behind scattered coins.',
                    'One decisive strike sends her reeling. "How dare you!" She vanishes in a swirl of shadows and curses, dropping valuables in her haste.'
                ],
                effects: [
                    { type: 'damage', target: 'random', value: 35 },
                    { type: 'xp', value: 120 },
                    { type: 'gold', value: 80 },
                ],
            },
        },
        {
            text: 'Flee from temptation',
            outcome: {
                text: [
                    'You turn and run, her mocking laughter echoing behind you.',
                    'Discretion proves the better part of valor. You flee while her amused laughter rings in your ears. "Come back anytime!" she calls.',
                    'Without a word, you bolt. The succubus\'s delighted giggles follow you down the corridor. "Running away? How precious!"',
                    'You don\'t risk it. As you retreat, she blows you a kiss. "Wise choice, little mortal. Perhaps next time you\'ll be braver!"'
                ],
                effects: [
                    { type: 'xp', value: 50 },
                ],
            },
        },
    ],
    depth: 15,
    icon: GiLips,
}
