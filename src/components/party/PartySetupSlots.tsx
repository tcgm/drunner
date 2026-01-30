import { Box, Flex, VStack, Heading, Text, Badge, Button, HStack, SimpleGrid, Tooltip } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, Item } from '../../types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { formatDefenseReduction } from '@/utils/defenseUtils'

// Rarity color mapping
const RARITY_COLORS = GAME_CONFIG.colors.rarity as Record<string, string>

interface PartySlotsProps {
  party: (Hero | null)[]
  onAddHero: (index: number) => void
  onRemoveHero: (index: number) => void
  onSelectHero: (index: number) => void
}

export function PartySetupSlots({
  party,
  onAddHero,
  onRemoveHero,
  onSelectHero
}: PartySlotsProps) {
  const partyCount = party.filter(h => h !== null).length
  
  return (
    <Box className="party-setup-slots" flex={1} minW={0} display="flex" flexDirection="column" bg="gray.950" p={3}>
      <VStack spacing={2} h="full">
        <SimpleGrid columns={3} w="full" flexShrink={0} gap={4} alignItems="center">
          <Heading size="sm" color="orange.300">
            Your Party
          </Heading>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Select a class or hero from the left, then click a slot to add
          </Text>
          <Badge colorScheme="orange" fontSize="sm" px={2} justifySelf="end">
            {partyCount}/{party.length}
          </Badge>
        </SimpleGrid>
        
        <HStack spacing={4} w="full" flex={1} minH={0}>
          {party.map((hero, index) => {
            const isEmpty = !hero
            const IconComponent = hero ? ((GameIcons as Record<string, IconType>)[hero.class.icon] || GameIcons.GiSwordman) as IconType : null
            
            return (
              <Box
                className={`party-setup-slot ${isEmpty ? 'party-setup-slot--empty' : 'party-setup-slot--filled'}`}
                key={index}
                position="relative"
                flex={1}
                h="full"
                bg={isEmpty ? 'gray.800' : 'linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(45, 55, 72, 0.9) 100%)'}
                borderRadius="xl"
                borderWidth="3px"
                borderColor={isEmpty ? 'gray.700' : 'orange.800'}
                cursor="pointer"
                onClick={() => isEmpty ? onAddHero(index) : onSelectHero(index)}
                transition="all 0.3s"
                _hover={isEmpty 
                  ? { borderColor: 'gray.500', transform: 'scale(1.02)', bg: 'gray.750' }
                  : { borderColor: 'orange.500', transform: 'scale(1.02)', boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)' }
                }
                overflow="hidden"
                boxShadow={isEmpty ? 'none' : '0 4px 16px rgba(0,0,0,0.4)'}
              >
                {isEmpty ? (
                  <Flex h="full" align="center" justify="center" direction="column">
                    <Icon as={GameIcons.GiCircle} boxSize={12} color="gray.600" mb={2} />
                    <Text color="gray.500" fontSize="sm" fontWeight="bold" textAlign="center" px={2}>
                      Empty Slot
                    </Text>
                    <Text color="gray.600" fontSize="xs" mt={1}>Slot {index + 1}</Text>
                  </Flex>
                ) : (
                  <>
                    {/* Background Icon Effect */}
                    <Box
                      position="absolute"
                      top="-20px"
                      right="-20px"
                      opacity={0.08}
                      transform="rotate(-15deg)"
                    >
                      {IconComponent && <Icon as={IconComponent} boxSize={40} color="orange.400" />}
                    </Box>
                    
                    <VStack spacing={1} p={3} position="relative" zIndex={1} h="full">
                      {/* Main Icon */}
                      <Box
                        bg="linear-gradient(135deg, rgba(194, 65, 12, 0.3) 0%, rgba(234, 88, 12, 0.3) 100%)"
                        borderRadius="lg"
                        p={2}
                        borderWidth="2px"
                        borderColor="orange.700"
                        boxShadow="0 0 20px rgba(234, 88, 12, 0.2)"
                        position="relative"
                      >
                        {IconComponent && <Icon as={IconComponent} boxSize={12} color="orange.300" />}
                        {/* Glow effect */}
                        <Box
                          position="absolute"
                          inset={0}
                          borderRadius="lg"
                          bg="orange.500"
                          opacity={0.1}
                          filter="blur(10px)"
                        />
                        {/* Equipment pips around icon */}
                        {(() => {
                          const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
                          if (equippedItems.length === 0) return null
                          const angleStep = 360 / equippedItems.length
                          const radius = 35
                          return equippedItems.map((item, idx) => {
                            const angle = (angleStep * idx - 90) * (Math.PI / 180)
                            const x = Math.cos(angle) * radius
                            const y = Math.sin(angle) * radius
                            return (
                              <Tooltip key={idx} label={item.name} fontSize="xs" placement="top">
                                <Box
                                  position="absolute"
                                  left="50%"
                                  top="50%"
                                  transform={`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`}
                                  w="8px"
                                  h="8px"
                                  borderRadius="full"
                                  bg={RARITY_COLORS[item.rarity] || 'gray.500'}
                                  boxShadow={`0 0 6px ${RARITY_COLORS[item.rarity] || 'gray.500'}`}
                                  borderWidth="1px"
                                  borderColor="gray.900"
                                />
                              </Tooltip>
                            )
                          })
                        })()}
                      </Box>
                      
                      {/* Hero Info */}
                      <VStack spacing={0.5} w="full" flex={1}>
                        <Text fontWeight="bold" fontSize="sm" color="orange.200" w="full" textAlign="center" isTruncated>
                          {hero.name}
                        </Text>
                        <Badge colorScheme="orange" fontSize="xs">
                          Lv{hero.level}
                        </Badge>
                        
                        {/* Stats Grid */}
                        <SimpleGrid columns={2} spacing={1} w="full" pt={1} fontSize="xs">
                          <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                            <Text color="gray.500">HP</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.hp.base}>{hero.stats.hp}/{hero.stats.maxHp}</Text>
                          </VStack>
                          <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                            <Text color="gray.500">ATK</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>{hero.stats.attack}</Text>
                          </VStack>
                          <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                            <Text color="gray.500">DEF</Text>
                              <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>
                                {hero.stats.defense} <Text as="span" fontSize="2xs" color="gray.500">{formatDefenseReduction(hero.stats.defense)}</Text>
                              </Text>
                          </VStack>
                          <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                            <Text color="gray.500">SPD</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>{hero.stats.speed}</Text>
                          </VStack>
                        </SimpleGrid>
                      </VStack>
                      
                      {/* Remove Button */}
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="solid"
                        w="full"
                        leftIcon={<Icon as={GameIcons.GiCancel} />}
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveHero(index)
                        }}
                        fontSize="xs"
                        mt="auto"
                      >
                        Remove
                      </Button>
                    </VStack>
                    
                    {/* Slot Number Badge */}
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="gray.900"
                      borderRadius="full"
                      w={7}
                      h={7}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      fontWeight="bold"
                      color="gray.400"
                      borderWidth="2px"
                      borderColor="gray.700"
                    >
                      {index + 1}
                    </Box>
                    
                    {/* Selected glow */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      h="3px"
                      bg="linear-gradient(90deg, transparent, orange.400, transparent)"
                      boxShadow="0 0 10px rgba(251, 146, 60, 0.8)"
                    />
                  </>
                )}
              </Box>
            )
          })}
        </HStack>
      </VStack>
    </Box>
  )
}
