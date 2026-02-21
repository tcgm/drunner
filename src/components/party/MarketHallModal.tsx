import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  Box,
  Icon,
  Badge,
  Tooltip,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useOrientation } from '@/contexts/OrientationContext'
import type { Consumable, Hero, Item } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { 
  GiCycle, 
  GiBread, 
  GiBandageRoll,
  GiCoinsPile,
  GiShoppingBag,
  GiVikingLonghouse,
  GiCoins,
  GiTwoCoins
} from 'react-icons/gi'
import { ItemSlot } from '@/components/ui/ItemSlot'
import './MarketHallModal.css'
import { restoreItemIcon } from '@/utils/itemUtils'
import { generateMarketInventory } from '@/systems/market/marketGenerator'
import { getMarketPrice, getMarketRefreshCost } from '@/systems/shop/shopUtils'
import type { MarketStallId } from '@/systems/shop/shopUtils'
import type { IconType } from 'react-icons'

interface MarketHallModalProps {
  isOpen: boolean
  onClose: () => void
  bankGold: number
  party: (Hero | null)[]
  onPurchase: (consumable: Consumable, price: number) => void
  onSpendGold: (amount: number) => boolean
}

interface Stall {
  id: MarketStallId
  name: string
  icon: IconType
  items: Consumable[]
  color: string
}

export function MarketHallModal({ 
  isOpen, 
  onClose, 
  bankGold, 
  party, 
  onPurchase, 
  onSpendGold 
}: MarketHallModalProps) {
  const { isPortrait } = useOrientation()
  const [stalls, setStalls] = useState<Stall[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)
  const [purchasedItemIds, setPurchasedItemIds] = useState<Set<string>>(new Set())
  const [isRefreshOnCooldown, setIsRefreshOnCooldown] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Generate stall inventory using market generator
  const generateStalls = () => {
    const marketStalls = generateMarketInventory(party)

    setStalls([
      {
        id: 'food',
        name: "Baker's Stall",
        icon: GiBread,
        items: marketStalls[0].items,
        color: 'orange',
      },
      {
        id: 'supplies',
        name: "General Goods",
        icon: GiBandageRoll,
        items: marketStalls[1].items,
        color: 'teal',
      },
      {
        id: 'premium',
        name: "Premium Provisions",
        icon: GiShoppingBag,
        items: marketStalls[2].items,
        color: 'yellow',
      },
    ])

    setPurchasedItemIds(new Set())
  }

  // Generate initial stalls only once
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      generateStalls()
      setHasInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasInitialized])

  // Reset cooldown when modal closes
  useEffect(() => {
    if (!isOpen && (isRefreshOnCooldown || cooldownRemaining > 0)) {
      setIsRefreshOnCooldown(false)
      setCooldownRemaining(0)
    }
  }, [isOpen, isRefreshOnCooldown, cooldownRemaining])

  // Calculate market price based on stall type
  // (getMarketPrice imported from shopUtils)

  const handleRefresh = () => {
    if (isRefreshOnCooldown) return
    
    const refreshCost = getRefreshCost()
    if (bankGold >= refreshCost && onSpendGold(refreshCost)) {
      generateStalls()
      
      // Start cooldown
      setIsRefreshOnCooldown(true)
      setCooldownRemaining(GAME_CONFIG.market.refreshCooldown)
    }
  }

  // Handle cooldown timer
  useEffect(() => {
    if (!isRefreshOnCooldown || cooldownRemaining <= 0) {
      if (isRefreshOnCooldown) {
        setIsRefreshOnCooldown(false)
        setCooldownRemaining(0)
      }
      return
    }

    const interval = setInterval(() => {
      setCooldownRemaining(prev => {
        const next = Math.max(0, prev - 100)
        if (next === 0) {
          setIsRefreshOnCooldown(false)
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRefreshOnCooldown, cooldownRemaining])

  const handlePurchase = (item: Consumable, stallId: MarketStallId) => {
    const marketPrice = getMarketPrice(item, stallId)
    if (bankGold >= marketPrice && !purchasedItemIds.has(item.id)) {
      onPurchase(item, marketPrice)
      setPurchasedItemIds(prev => new Set(prev).add(item.id))
    }
  }

  // Calculate dynamic refresh cost based on unpurchased items
  const getRefreshCost = () => {
    let remainingValue = 0
    
    stalls.forEach(stall => {
      stall.items.forEach(item => {
        if (!purchasedItemIds.has(item.id)) {
          remainingValue += getMarketPrice(item, stall.id as MarketStallId)
        }
      })
    })
    
    const cost = getMarketRefreshCost(remainingValue)
    
    return cost
  }

  const canAffordRefresh = bankGold >= getRefreshCost()
  const canAfford = (item: Consumable, stallId: MarketStallId) => bankGold >= getMarketPrice(item, stallId)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isPortrait ? 'full' : '6xl'} isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        bg="gray.900" 
        color="white" 
        borderWidth="3px" 
        borderColor="green.600" 
        h={isPortrait ? '100%' : '95vh'} 
        maxH={isPortrait ? '100%' : '95vh'}
        display={isPortrait ? 'flex' : undefined}
        flexDirection={isPortrait ? 'column' : undefined}
        boxShadow="0 0 30px rgba(72, 187, 120, 0.3)"
      >
        <ModalHeader 
          bgGradient="linear(to-r, green.800, green.900)" 
          borderBottom="2px solid" 
          borderColor="green.700"
        >
          <HStack justify="space-between" pr={6}>
            <HStack spacing={3}>
              <Icon as={GiVikingLonghouse} boxSize={7} color="green.400" />
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" color="green.300">Market Hall</Text>
                <Text fontSize="xs" color="green.500" fontWeight="normal">
                  Provisions & Supplies
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={4}>
              <Tooltip 
                label={
                  isRefreshOnCooldown ? `Cooldown: ${(cooldownRemaining / 1000).toFixed(1)}s` :
                  canAffordRefresh ? `Refresh market for ${getRefreshCost()} gold` : 'Not enough gold'
                } 
                placement="left"
              >
                <Button
                  size="sm"
                  leftIcon={<Icon as={GiCycle} />}
                  colorScheme="green"
                  variant="solid"
                  onClick={handleRefresh}
                  isDisabled={!canAffordRefresh || isRefreshOnCooldown}
                >
                  {isRefreshOnCooldown ? `Cooldown (${(cooldownRemaining / 1000).toFixed(1)}s)` : `Refresh (${getRefreshCost()}g)`}
                </Button>
              </Tooltip>
              <HStack spacing={2} bg="green.900" px={4} py={2} borderRadius="md" borderWidth="1px" borderColor="green.700">
                <Icon as={GiTwoCoins} color="yellow.400" />
                <Text fontSize="md" fontWeight="bold" color="yellow.300">{bankGold}</Text>
              </HStack>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="green.300" />
        <ModalBody
          py={isPortrait ? 1.5 : 4}
          px={isPortrait ? 1.5 : 4}
          bg="gray.850"
          display={isPortrait ? 'flex' : undefined}
          flexDirection={isPortrait ? 'column' : undefined}
          flex={isPortrait ? '1' : undefined}
          minH={isPortrait ? '0' : undefined}
          overflow={isPortrait ? 'hidden' : undefined}
        >
          {isPortrait ? (
            /* Portrait: three vertical stall columns side-by-side */
            <HStack spacing={1.5} align="stretch" h="100%" overflow="hidden">
              {stalls.map((stall) => (
                <Box
                  key={stall.id}
                  flex="1"
                  w="0"
                  bg="gray.800"
                  borderWidth="2px"
                  borderColor={`${stall.color}.700`}
                  borderRadius="lg"
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                  boxShadow={`0 2px 8px rgba(0, 0, 0, 0.3)`}
                >
                  {/* Compact portrait stall header */}
                  <VStack spacing={0.5} px={1.5} py={2} borderBottom="1px solid" borderColor="gray.700" flexShrink={0}>
                    <Icon as={stall.icon} boxSize={4} color={`${stall.color}.400`} />
                    <Text fontSize="2xs" fontWeight="bold" color={`${stall.color}.300`} textAlign="center" noOfLines={1}>
                      {stall.name}
                    </Text>
                    <Badge colorScheme={stall.color} fontSize="2xs">
                      {stall.items.filter(item => !purchasedItemIds.has(item.id)).length}
                    </Badge>
                  </VStack>
                  {/* Stall items — scrollable vertical list */}
                  <VStack spacing={1.5} p={1.5} overflowY="auto" flex="1" align="stretch">
                    {stall.items.map((item) => {
                      const isPurchased = purchasedItemIds.has(item.id)
                      const affordable = canAfford(item, stall.id) && !isPurchased
                      const itemWithIcon = restoreItemIcon(item)
                      const marketPrice = getMarketPrice(item, stall.id)
                      return (
                        <Box
                          key={item.id}
                          bg={isPurchased ? 'gray.900' : 'gray.700'}
                          borderWidth="2px"
                          borderColor={
                            isPurchased ? 'gray.600' :
                            affordable ? `${stall.color}.500` :
                            'red.600'
                          }
                          borderRadius="md"
                          p={1.5}
                          cursor={affordable ? 'pointer' : 'not-allowed'}
                          onClick={() => affordable && handlePurchase(item, stall.id)}
                          _hover={affordable ? {
                            borderColor: `${stall.color}.400`,
                            bg: 'gray.600',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4)`,
                            transition: 'all 0.2s'
                          } : {}}
                          transition="all 0.2s"
                          opacity={isPurchased ? 0.4 : 1}
                          position="relative"
                        >
                          <VStack spacing={1}>
                            <Box className="market-item-slot">
                              <ItemSlot item={itemWithIcon} isClickable={false} size="md" />
                            </Box>
                            <Divider borderColor="gray.600" />
                            <Button
                              size="xs"
                              colorScheme={isPurchased ? 'gray' : affordable ? stall.color : 'red'}
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePurchase(item, stall.id)
                              }}
                              isDisabled={!affordable}
                              width="100%"
                              fontSize="2xs"
                              leftIcon={isPurchased ? undefined : <Icon as={GiCoinsPile} boxSize={3} />}
                            >
                              {isPurchased ? 'Sold' : `${marketPrice}g`}
                            </Button>
                          </VStack>
                          {item.rarity !== 'common' && !isPurchased && (
                            <Badge
                              position="absolute"
                              top={1}
                              right={1}
                              colorScheme={
                                item.rarity === 'uncommon' ? 'green' :
                                item.rarity === 'rare' ? 'blue' :
                                item.rarity === 'epic' ? 'purple' : 'orange'
                              }
                              fontSize="2xs"
                            >
                              {item.rarity}
                            </Badge>
                          )}
                        </Box>
                      )
                    })}
                  </VStack>
                </Box>
              ))}
            </HStack>
          ) : (
            /* Landscape: stalls stacked vertically with 7-column item grid */
            <VStack spacing={4} align="stretch">
              {stalls.map((stall) => (
                <Box 
                  key={stall.id}
                  bg="gray.800"
                  borderWidth="2px"
                  borderColor={`${stall.color}.700`}
                  borderRadius="lg"
                  p={3}
                  boxShadow={`0 2px 8px rgba(0, 0, 0, 0.3)`}
                >
                  {/* Stall Header */}
                  <HStack mb={3} pb={2} borderBottom="1px solid" borderColor="gray.700">
                    <Icon as={stall.icon} boxSize={5} color={`${stall.color}.400`} />
                    <Text fontSize="md" fontWeight="bold" color={`${stall.color}.300`}>
                      {stall.name}
                    </Text>
                    <Badge colorScheme={stall.color} fontSize="xs">
                      {stall.items.filter(item => !purchasedItemIds.has(item.id)).length} available
                    </Badge>
                  </HStack>

                  {/* Stall Items */}
                  <SimpleGrid columns={7} spacing={2}>
                    {stall.items.map((item) => {
                      const isPurchased = purchasedItemIds.has(item.id)
                      const affordable = canAfford(item, stall.id) && !isPurchased
                      const itemWithIcon = restoreItemIcon(item)
                      const marketPrice = getMarketPrice(item, stall.id)

                      return (
                        <Box
                          key={item.id}
                          bg={isPurchased ? 'gray.900' : 'gray.700'}
                          borderWidth="2px"
                          borderColor={
                            isPurchased ? 'gray.600' : 
                            affordable ? `${stall.color}.500` : 
                            'red.600'
                          }
                          borderRadius="md"
                          p={2}
                          cursor={affordable ? 'pointer' : 'not-allowed'}
                          onClick={() => affordable && handlePurchase(item, stall.id)}
                          _hover={affordable ? { 
                            borderColor: `${stall.color}.400`,
                            bg: 'gray.600',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4)`,
                            transition: 'all 0.2s'
                          } : {}}
                          transition="all 0.2s"
                          opacity={isPurchased ? 0.4 : 1}
                          position="relative"
                        >
                          <VStack spacing={1}>
                            <Box className="market-item-slot">
                              <ItemSlot
                                item={itemWithIcon}
                                isClickable={false}
                                size="md"
                              />
                            </Box>
                            <Divider borderColor="gray.600" />
                            <Button
                              size="xs"
                              colorScheme={isPurchased ? 'gray' : affordable ? stall.color : 'red'}
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePurchase(item, stall.id)
                              }}
                              isDisabled={!affordable}
                              width="100%"
                              fontSize="xs"
                              leftIcon={isPurchased ? undefined : <Icon as={GiCoinsPile} boxSize={3} />}
                            >
                              {isPurchased ? 'Sold' : `${marketPrice}g`}
                            </Button>
                          </VStack>
                          {item.rarity !== 'common' && !isPurchased && (
                            <Badge
                              position="absolute"
                              top={1}
                              right={1}
                              colorScheme={
                                item.rarity === 'uncommon' ? 'green' :
                                item.rarity === 'rare' ? 'blue' :
                                item.rarity === 'epic' ? 'purple' : 'orange'
                              }
                              fontSize="2xs"
                            >
                              {item.rarity}
                            </Badge>
                          )}
                        </Box>
                      )
                    })}
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter 
          borderTop="2px solid" 
          borderColor="green.700"
          bg="gray.900"
        >
          <Button 
            colorScheme="green" 
            variant="outline"
            onClick={onClose}
            leftIcon={<Icon as={GiVikingLonghouse} />}
          >
            Leave Market
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
