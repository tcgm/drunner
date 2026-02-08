import type { Item } from '@/types'
import type { UniqueEffectDefinition, UniqueEffectResult } from '@/systems/items/uniqueEffects'
import demonCoreflailLight from '@/assets/icons/items/demonCoreflailLight.svg'

/**
 * Demon Coreflail - Legendary cursed weapon of mass destruction
 */
export const DEMON_COREFLAIL: Omit<Item, 'id'> & { uniqueEffect: UniqueEffectDefinition } = {
  name: 'Demon Coreflail',
  description: 'Some absolute madman mounted a subcritical sphere of pure destructive energy to a chain. It emits an eerie blue glow and makes your teeth ache. Horrifyingly effective. Probably lethal to wield.',
  type: 'weapon',
  rarity: 'legendary',
  icon: demonCoreflailLight,
  stats: {
    attack: 165, // Incredibly powerful
    magicPower: 45, // Radiates energy
    maxHp: -25, // Actively harmful to your health
    luck: -15, // This is a TERRIBLE idea
  },
  value: 12000,
  modifiers: ['cursed'],
  uniqueEffect: {
    triggers: ['onCombatStart', 'onFloorAdvance'],
    description: 'Lethal Radiation: Deals 8 damage to entire party at combat start and floor advance',
    handler: (context) => {
      const { party } = context
      const radiationDamage = 8
      const messages: string[] = []
      const effects: NonNullable<UniqueEffectResult['additionalEffects']> = []
      
      // Damage all alive heroes
      party.forEach(hero => {
        if (hero && hero.isAlive) {
          const actualDamage = Math.min(radiationDamage, hero.stats.hp)
          hero.stats.hp = Math.max(0, hero.stats.hp - radiationDamage)
          
          if (hero.stats.hp <= 0) {
            hero.isAlive = false
            messages.push(`${hero.name} succumbs to radiation poisoning!`)
          }
          
          effects.push({
            type: 'damage' as const,
            target: [hero.id],
            value: actualDamage,
            description: `Radiation damage: ${actualDamage}`
          })
        }
      })
      
      return {
        party,
        message: `⚛️ The Demon Coreflail bathes the party in lethal radiation! ${messages.join(' ')}`,
        additionalEffects: effects
      }
    }
  }
}
