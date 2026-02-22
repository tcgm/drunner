import eliteWizardHatIcon from '@/assets/icons/items/eliteWizardHat.svg'
import type { Item } from '@/types'

/**
 * Grey Pilgrim's Hat - Mythic unique helmet of unfathomable wisdom
 * Totally not Gandalf's hat. Definitely not. Not even a little.
 */
export const GREY_PILGRIMS_HAT: Omit<Item, 'id'> = {
  name: 'Mage Hat, The Grey',
  description: "A wide-brimmed hat of indeterminate age, radiating wisdom so dense it bends the air around it. The previous owner was a grey-robed wanderer who was very insistent that it was just a hat.",
  type: 'helmet',
  rarity: 'mythic',
  minRarity: 'mythic',
  maxRarity: 'divine',
  icon: eliteWizardHatIcon,
  stats: {
    defense: 25,
    magicPower: 120,
    wisdom: 110,
    charisma: 60,
    luck: 40,
  },
  value: 28000,
}
