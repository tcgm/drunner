import { Box, HStack, VStack, Text, Icon, useDisclosure, Tooltip } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Hero, Item, Consumable } from '@/types'
import * as GameIcons from 'react-icons/gi'
import HeroModal from './HeroModal'
import HeroTooltip from './HeroTooltip'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'
import { FloatingNumber } from '@components/ui/FloatingNumber'
import { GAME_CONFIG } from '@/config/gameConfig'
import { useGameStore } from '@/core/gameStore'
import { useConsumable as applyConsumable } from '@/systems/consumables/consumableManager'
import { getAbilityStatus } from '@/systems/abilities/abilityManager'
import { restoreItemIcon } from '@/utils/itemUtils'
import { ItemSlot } from '@components/ui/ItemSlot'
import { EquipmentPips } from './EquipmentPips'

const MotionBox = motion.create(Box)

interface PartyMemberCardProps {
  hero: Hero
  floatingEffects?: Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>
  isDungeon?: boolean
}

export default function PartyMemberCard({ hero, floatingEffects = [], isDungeon = false }: PartyMemberCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  const { updateHero, party, dungeon, useAbility: activateAbility } = useGameStore()
  
  const handleEffectComplete = (id: string) => {
    // Filtering is handled by AnimatePresence and the effect completion
  }
  
  const handleUseConsumable = (slotId: string) => {
    const item = hero.slots[slotId]
    if (item && 'consumableType' in item) {
      const result = applyConsumable(hero, slotId, dungeon.floor, party)
      if (result.hero) {
        updateHero(result.hero.id, result.hero)
        // TODO: Show message to user
        console.log(result.message)
      }
    }
  }
  
  const handleUseAbility = (abilityId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const result = activateAbility(hero.id, abilityId)
    // TODO: Show message to user (could use a toast or floating message)
    console.log(result.message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  
  const consumableSlots = ['consumable1', 'consumable2', 'consumable3']
  
  return (
    <>
      <HeroTooltip hero={hero}>
        <MotionBox
          className={`party-member-card ${hero.isAlive ? 'party-member-card--alive' : 'party-member-card--dead'}`}
          position="relative"
          bg={hero.isAlive ? 'gray.800' : 'gray.900'}
          borderRadius="md"
          borderWidth="2px"
          borderColor={hero.isAlive ? 'orange.600' : 'red.900'}
          opacity={hero.isAlive ? 1 : 0.6}
          cursor="pointer"
          onClick={onOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ 
            x: 4,
            boxShadow: hero.isAlive ? '0 0 12px rgba(237, 137, 54, 0.4)' : '0 0 12px rgba(245, 101, 101, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Floating Numbers */}
          <AnimatePresence>
            {floatingEffects.map((effect) => (
              <FloatingNumber
                key={effect.id}
                value={effect.value}
                type={effect.type}
                onComplete={() => handleEffectComplete(effect.id)}
              />
            ))}
          </AnimatePresence>

          <HStack className="party-member-card-content" spacing={2} p={2}>
            <HStack className="party-member-card-icon-section" spacing={1}>
              <motion.div
                animate={isHovered ? {
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                <Icon as={IconComponent} boxSize={8} color="orange.400" flexShrink={0} />
              </motion.div>
              
              {/* Equipment pips */}
              <VStack className="party-member-card-equipment-pips" spacing={0.5} align="start">
                <EquipmentPips 
                  items={Object.values(hero.slots || {}).filter((item): item is Item => item !== null && 'stats' in item)}
                  layout="vertical"
                  size="sm"
                />
              </VStack>
            </HStack>
            
            <VStack className="party-member-card-info" spacing={1} align="stretch" flex={1} minW={0}>
              <HStack className="party-member-card-header" spacing={2}>
                <Text className="party-member-card-name" fontWeight="bold" fontSize="xs" noOfLines={1} flex={1}>
                  {hero.name}
                </Text>
                <Text className="party-member-card-level" fontSize="xs" color="orange.300" flexShrink={0}>
                  Lv{hero.level}
                </Text>
              </HStack>
              
              <StatBar 
                label="HP"
                current={hero.stats.hp}
                max={hero.stats.maxHp}
                colorScheme="green"
              />
              
              <StatBar 
                label="XP"
                current={hero.xp}
                max={calculateXpForLevel(hero.level)}
                colorScheme="cyan"
                height={0.5}
              />

              {/* Abilities row */}
              {hero.abilities && hero.abilities.length > 0 && (
                <HStack spacing={1} pt={0}>
                  {hero.abilities.slice(0, 3).map(ability => {
                    const status = getAbilityStatus(ability, dungeon.floor)
                    return (
                      <Tooltip
                        key={ability.id}
                        label={`${ability.name}: ${ability.description}\n${status.statusText}`}
                        fontSize="xs"
                        placement="top"
                      >
                        <Box
                          w="20px"
                          h="20px"
                          bg={status.canUse ? 'purple.900' : 'gray.800'}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={status.canUse ? 'purple.500' : 'gray.600'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor={status.canUse && hero.isAlive ? 'pointer' : 'not-allowed'}
                          opacity={status.canUse && hero.isAlive ? 1 : 0.5}
                          onClick={(e) => {
                            if (status.canUse && hero.isAlive) {
                              handleUseAbility(ability.id, e)
                            }
                          }}
                          _hover={status.canUse && hero.isAlive ? {
                            bg: 'purple.800',
                            borderColor: 'purple.400'
                          } : undefined}
                          position="relative"
                        >
                          <Icon as={GameIcons.GiSparkles} boxSize={3} color={status.canUse ? 'purple.300' : 'gray.500'} />
                          {status.cooldownRemaining > 0 && (
                            <Text
                              position="absolute"
                              bottom="-2px"
                              right="-2px"
                              fontSize="8px"
                              fontWeight="bold"
                              color="white"
                              bg="gray.900"
                              borderRadius="full"
                              w="12px"
                              h="12px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              {status.cooldownRemaining}
                            </Text>
                          )}
                        </Box>
                      </Tooltip>
                    )
                  })}
                </HStack>
              )}
            </VStack>
            
            {/* Consumables column on the right */}
            <VStack spacing={0.5} flexShrink={0}>
              {consumableSlots.map(slotId => {
                const item = hero.slots[slotId] ? restoreItemIcon(hero.slots[slotId]) : null
                const consumable = item && 'consumableType' in item ? item as Consumable : null
                const isRevive = consumable?.effect?.type === 'revive'
                const canUse = isRevive ? !hero.isAlive : hero.isAlive
                
                if (!consumable) {
                  // Empty slot - show empty box with potion icon
                  return (
                    <Box
                      key={slotId}
                      w="24px"
                      h="24px"
                      bg="gray.900"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.700"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0.3}
                    >
                      <Icon as={GameIcons.GiApothecary} boxSize={4} color="gray.600" />
                    </Box>
                  )
                }
                
                return (
                  <Box
                    key={slotId}
                    onClick={(e) => {
                      if (canUse) {
                        e.stopPropagation()
                        handleUseConsumable(slotId)
                      }
                    }}
                    w="24px"
                    h="24px"
                    cursor={canUse ? 'pointer' : 'not-allowed'}
                    opacity={canUse ? 1 : 0.5}
                  >
                    <ItemSlot item={consumable} size="sm" isClickable={canUse || false} iconOnly={true} />
                  </Box>
                )
              })}
            </VStack>
          </HStack>
        </MotionBox>
      </HeroTooltip>

      <HeroModal hero={hero} isOpen={isOpen} onClose={onClose} isDungeon={isDungeon} />
    </>
  )
}

