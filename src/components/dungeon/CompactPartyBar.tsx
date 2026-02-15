import './CompactPartyBar.css'
import { HStack, Box, VStack, Text, Progress, Spacer, Icon, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Button, Badge } from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import type { Hero, Consumable, Item } from '@/types'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import { calculateTotalStats } from '@/utils/statCalculator'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'
import { useGameStore } from '@/core/gameStore'
import { useConsumable as applyConsumable } from '@/systems/consumables/consumableManager'
import { getAbilityStatus } from '@/systems/abilities/abilityManager'
import { refreshHeroAbilities } from '@/utils/abilityUtils'
import { getAbilityDescription } from '@/utils/abilityDisplay'

interface CompactPartyBarProps {
  party: Hero[]
  onClick?: () => void
}

export default function CompactPartyBar({ party, onClick }: CompactPartyBarProps) {
  const { updateHero, dungeon, useAbility: activateAbility } = useGameStore()
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

  const handleUseConsumable = (hero: Hero, slotId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const item = hero.slots[slotId]
    if (item && 'consumableType' in item) {
      const result = applyConsumable(hero, slotId, dungeon.floor, party)
      if (result.hero) {
        updateHero(result.hero.id, result.hero)
        console.log(result.message)
      }
    }
  }

  const handleUseAbility = (heroId: string, abilityId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const result = activateAbility(heroId, abilityId)
    console.log(result.message)
  }

  return (
    <HStack
      className="compact-party-bar portrait-only"
      bg="gray.800"
      borderRadius="md"
      p={2}
      spacing={1.5}
      overflowX="auto"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      // _hover={onClick ? { bg: "gray.750" } : undefined}
      transition="background 0.2s"
    >
      {party.map((hero) => {
        const totalStats = calculateTotalStats(hero)
        const hpPercent = (hero.stats.hp / totalStats.maxHp) * 100
        const isAlive = hero.isAlive
        const IconComponent = ((GameIcons as Record<string, IconType>)[hero.class.icon] || GameIcons.GiSwordman) as IconType
        const heroWithIcons = refreshHeroAbilities(hero)
        const consumableSlots = ['consumable1', 'consumable2', 'consumable3']

        // Determine HP color
        let hpColor = "green.400"
        if (hpPercent < 25) hpColor = "red.500"
        else if (hpPercent < 50) hpColor = "orange.500"
        else if (hpPercent < 75) hpColor = "yellow.500"

        // Filter abilities that are usable outside combat
        const usableAbilities = (heroWithIcons.abilities || []).filter(ability => {
          const target = ability.effect.target
          return target !== 'enemy' && target !== 'all-enemies'
        })

        return (
          <VStack
            key={hero.id}
            className="compact-party-card"
            flex="1 1 0"
            bg={isAlive ? "gray.800" : "gray.900"}
            borderRadius="md"
            p={2}
            borderWidth="2px"
            borderColor={isAlive ? "orange.600" : "red.900"}
            opacity={isAlive ? 1 : 0.6}
            spacing={1}
            position="relative"
            zIndex={openPopoverId === hero.id ? 10 : 1}
            onClick={(e) => {
              // Only trigger parent onClick if not clicking on consumable/ability
              if ((e.target as HTMLElement).closest('.compact-action-button')) {
                return
              }
              onClick?.()
            }}
          >

            {/* Name and Level */}
            <HStack spacing={1} justify="center" w="full">
              
              {/* Hero Icon */}
              <Icon 
                as={IconComponent} 
                boxSize={4} 
                color={isAlive ? "orange.400" : "gray.500"}
              />
              <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={isAlive ? "orange.300" : "gray.500"}
                  flex={1}
                  textAlign="center"
                >
                  {hero.name}
                </Text>
                <Spacer/>
                <Text fontSize="2xs" color="gray.400">
                Lv{hero.level}
              </Text>
            </HStack>
            

            {/* HP Bar and Status */}
            {isAlive ? (
              <>
                <Progress
                  value={hpPercent}
                  size="xs"
                  colorScheme={hpColor.split('.')[0]}
                  borderRadius="full"
                  w="full"
                  mb={0.5}
                />
                <Text fontSize="2xs" color="gray.300" textAlign="center">
                  {hero.stats.hp}/{totalStats.maxHp}
                </Text>
              </>
            ) : (
              <Text fontSize="2xs" color="red.400" textAlign="center" fontWeight="bold">
                K/O
              </Text>
            )}

            {/* Consumables and Abilities Row */}
            <HStack spacing={0.5} w="full" justify="center" h={"20px"}>
              {consumableSlots.map(slotId => {
                const item = hero.slots[slotId] ? restoreItemIcon(hero.slots[slotId]) : null
                const consumable = item && 'consumableType' in item ? item as Consumable : null
                const isRevive = consumable?.effects?.some(effect => effect.type === 'revive') ?? false
                const canUse = isRevive ? !hero.isAlive : hero.isAlive
                
                if (!consumable) {
                  return (
                    <Box
                      key={slotId}
                      className="compact-action-button"
                      w="20px"
                      h="20px"
                      minW="20px"
                      minH="20px"
                      bg="gray.900"
                      borderRadius="sm"
                      borderWidth="1px"
                      borderColor="gray.700"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0.3}
                    >
                      <Icon as={GameIcons.GiApothecary} boxSize={3} color="gray.600" />
                    </Box>
                  )
                }
                
                return (
                  <Box
                    key={slotId}
                    className="compact-action-button"
                    w="20px"
                    h="20px"
                    minW="20px"
                    minH="20px"
                    cursor={canUse ? 'pointer' : 'not-allowed'}
                    opacity={canUse ? 1 : 0.5}
                    borderRadius="sm"
                    boxShadow={isRevive && canUse ? '0 0 6px 1px rgba(255, 215, 0, 0.6)' : undefined}
                    onClick={(e) => canUse ? handleUseConsumable(hero, slotId, e) : e.stopPropagation()}
                  >
                    <ItemSlot
                      item={consumable}
                      size="sm"
                      isClickable={false}
                      iconOnly={true}
                    />
                  </Box>
                )
              })}

              {/* Abilities Button */}
              <Popover 
                placement="bottom-start" 
                closeOnBlur={true} 
                strategy="fixed"
                isLazy
                onOpen={() => setOpenPopoverId(hero.id)}
                onClose={() => setOpenPopoverId(null)}
              >
                <PopoverTrigger>
                  <Box
                    className="compact-action-button"
                    as="button"
                    w="20px"
                    h="20px"
                    minW="20px"
                    minH="20px"
                    bg={usableAbilities.length > 0 ? 'purple.900' : 'gray.800'}
                    borderRadius="sm"
                    borderWidth="1px"
                    borderColor={usableAbilities.length > 0 ? 'purple.600' : 'gray.700'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={0}
                    cursor={usableAbilities.length > 0 && isAlive ? 'pointer' : 'not-allowed'}
                    opacity={usableAbilities.length > 0 && isAlive ? 1 : 0.5}
                    position="relative"
                    _hover={usableAbilities.length > 0 && isAlive ? {
                      bg: 'purple.800',
                      borderColor: 'purple.500'
                    } : undefined}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Icon as={GameIcons.GiSparkles} boxSize={3} color={usableAbilities.length > 0 ? 'purple.300' : 'gray.500'} />
                    {usableAbilities.filter(a => getAbilityStatus(a, dungeon.floor, dungeon.depth).canUse).length > 0 && (
                      <Box
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        w="8px"
                        h="8px"
                        bg="green.400"
                        borderRadius="full"
                        border="1px solid"
                        borderColor="gray.900"
                      />
                    )}
                  </Box>
                </PopoverTrigger>
                <PopoverContent
                  bg="gray.900"
                  borderColor="purple.500"
                  borderWidth="2px"
                  maxW="280px"
                  zIndex="popover"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <PopoverArrow bg="gray.900" />
                  <PopoverCloseButton />
                  <PopoverHeader color="purple.400" fontWeight="bold" fontSize="sm">
                    {hero.name}'s Abilities
                  </PopoverHeader>
                  <PopoverBody pb={3} px={2} maxH="50vh" overflowY="auto">
                    <VStack align="stretch" spacing={2}>
                      {usableAbilities.length === 0 ? (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          No abilities available
                        </Text>
                      ) : (
                        usableAbilities.map(ability => {
                          const status = getAbilityStatus(ability, dungeon.floor, dungeon.depth)
                          const AbilityIcon = ability.icon || GameIcons.GiSparkles
                          const abilityDesc = getAbilityDescription(ability, heroWithIcons)

                          return (
                            <Button
                              key={ability.id}
                              size="sm"
                              h="auto"
                              py={2}
                              variant="outline"
                              colorScheme="purple"
                              isDisabled={!status.canUse || !isAlive}
                              opacity={status.canUse && isAlive ? 1 : 0.5}
                              onClick={(e) => {
                                if (status.canUse && isAlive) {
                                  handleUseAbility(hero.id, ability.id, e)
                                }
                              }}
                            >
                              <HStack w="full" justify="space-between">
                                <HStack spacing={2}>
                                  <Icon as={AbilityIcon} boxSize={4} />
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" fontWeight="bold">{ability.name}</Text>
                                    <Text fontSize="2xs" color="gray.400" noOfLines={1}>{abilityDesc}</Text>
                                  </VStack>
                                </HStack>
                                {status.cooldownRemaining > 0 && (
                                  <Badge colorScheme="red" fontSize="2xs">{status.cooldownRemaining}</Badge>
                                )}
                              </HStack>
                            </Button>
                          )
                        })
                      )}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </VStack>
        )
      })}

      {party.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center" w="full">
          No party members
        </Text>
      )}
    </HStack>
  )
}
