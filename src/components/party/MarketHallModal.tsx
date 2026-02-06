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
import type { Consumable, Hero, Item } from '@/types'
import { generateConsumable } from '@/systems/consumables/consumableGenerator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { 
  GiCampCookingPot, 
  GiCycle, 
  GiVikingLonghouse, 
  GiBread, 
  GiMeat, 
  GiBandageRoll,
  GiCoinsPile,
  GiShoppingBag
} from 'react-icons/gi'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'
import { getRandomFoodBase, ALL_FOOD_BASES } from '@/data/consumables/food'
import { getRandomSupplyBase, ALL_SUPPLY_BASES } from '@/data/consumables/supplies'
import { getRandomSize } from '@/data/consumables/sizes'
import { getRandomPotency } from '@/data/consumables/potencies'
import type { IconType } from 'react-icons'

interface MarketHallModalProps {
  isOpen: boolean
  onClose: () => void
  bankGold: number
  party: (Hero | null)[]
  onPurchase: (consumable: Consumable) => void
  onSpendGold: (amount: number) => boolean
}

interface Stall {
  id: string
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
  const [stalls, setStalls] = useState<Stall[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)
  const [purchasedItemIds, setPurchasedItemIds] = useState<Set<string>>(new Set())

  // Calculate effective floor based on party's average level
  const getEffectiveFloor = () => {
    const activeHeroes = party.filter((h): h is Hero => h !== null)
    if (activeHeroes.length === 0) return 1
    
    const avgLevel = activeHeroes.reduce((sum, h) => sum + h.level, 0) / activeHeroes.length
    return Math.max(1, Math.floor(avgLevel * GAME_CONFIG.market.floorScaling))
  }

  // Generate stall inventory
  const generateStalls = () => {
    const floor = getEffectiveFloor()
    
    // Food Stall - generates food items
    const foodItems: Consumable[] = []
    for (let i = 0; i < GAME_CONFIG.market.stallSize; i++) {
      const base = getRandomFoodBase()
      const size = getRandomSize()
      const potency = getRandomPotency()
      const rarityRoll = Math.random()
      const rarity = rarityRoll < GAME_CONFIG.market.rarityChances.food.rare ? 'rare' :
                     rarityRoll < GAME_CONFIG.market.rarityChances.food.uncommon ? 'uncommon' : 'common'
      const foodItem = generateConsumable(base.id, size.id, potency.id, rarity, floor + GAME_CONFIG.market.floorBonuses.food)
      foodItems.push(foodItem)
    }

    // Supply Stall - generates supply items
    const supplyItems: Consumable[] = []
    for (let i = 0; i < GAME_CONFIG.market.stallSize; i++) {
      const base = getRandomSupplyBase()
      const size = getRandomSize()
      const potency = getRandomPotency()
      const rarityRoll = Math.random()
      const rarity = rarityRoll < GAME_CONFIG.market.rarityChances.supplies.rare ? 'rare' :
                     rarityRoll < GAME_CONFIG.market.rarityChances.supplies.uncommon ? 'uncommon' : 'common'
      const supplyItem = generateConsumable(base.id, size.id, potency.id, rarity, floor + GAME_CONFIG.market.floorBonuses.supplies)
      supplyItems.push(supplyItem)
    }

    // Premium Stall - mixed items with better quality
    const premiumItems: Consumable[] = []
    for (let i = 0; i < GAME_CONFIG.market.stallSize; i++) {
      const isFood = Math.random() < 0.5
      const base = isFood ? getRandomFoodBase() : getRandomSupplyBase()
      const size = getRandomSize()
      const potency = getRandomPotency()
      const rarityRoll = Math.random()
      const rarity = rarityRoll < GAME_CONFIG.market.rarityChances.premium.rare ? 'rare' : 
                     rarityRoll < GAME_CONFIG.market.rarityChances.premium.uncommon ? 'uncommon' : 'common'
      const premiumItem = generateConsumable(base.id, size.id, potency.id, rarity, floor + GAME_CONFIG.market.floorBonuses.premium)
      premiumItems.push(premiumItem)
    }

    setStalls([
      {
        id: 'food',
        name: "Baker's Stall",
        icon: GiBread,
        items: foodItems,
        color: 'orange',
      },
      {
        id: 'supplies',
        name: "General Goods",
        icon: GiBandageRoll,
        items: supplyItems,
        color: 'teal',
      },
      {
        id: 'premium',
        name: "Premium Provisions",
        icon: GiShoppingBag,
        items: premiumItems,
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

  // Calculate market price based on stall type
  const getMarketPrice = (item: Consumable, stallId: string) => {
    const multiplier = stallId === 'food' ? GAME_CONFIG.market.priceMultipliers.food :
                       stallId === 'supplies' ? GAME_CONFIG.market.priceMultipliers.supplies :
                       GAME_CONFIG.market.priceMultipliers.premium
    return Math.floor(item.value * multiplier)
  }

  const handleRefresh = () => {
    const refreshCost = getRefreshCost()
    if (bankGold >= refreshCost && onSpendGold(refreshCost)) {
      generateStalls()
    }
  }

  const handlePurchase = (item: Consumable, stallId: string) => {
    const marketPrice = getMarketPrice(item, stallId)
    if (bankGold >= marketPrice && !purchasedItemIds.has(item.id)) {
      onPurchase(item)
      setPurchasedItemIds(prev => new Set(prev).add(item.id))
    }
  }

  // Calculate dynamic refresh cost based on unpurchased items
  const getRefreshCost = () => {
    let remainingValue = 0
    
    stalls.forEach(stall => {
      stall.items.forEach(item => {
        if (!purchasedItemIds.has(item.id)) {
          remainingValue += getMarketPrice(item, stall.id)
        }
      })
    })
    
    const cost = Math.ceil(
      GAME_CONFIG.market.refreshBaseCost + 
      (remainingValue * GAME_CONFIG.market.refreshCostMultiplier)
    )
    
    return cost
  }

  const canAffordRefresh = bankGold >= getRefreshCost()
  const canAfford = (item: Consumable, stallId: string) => bankGold >= getMarketPrice(item, stallId)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        bg="gray.900" 
        color="white" 
        borderWidth="3px" 
        borderColor="green.600" 
        h="95vh" 
        maxH="95vh"
        boxShadow="0 0 30px rgba(72, 187, 120, 0.3)"
      >
        <ModalHeader 
          bgGradient="linear(to-r, green.800, green.900)" 
          borderBottom="2px solid" 
          borderColor="green.700"
        >
          <HStack justify="space-between">
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
                label={canAffordRefresh ? `Refresh market for ${getRefreshCost()} gold` : 'Not enough gold'} 
                placement="left"
              >
                <Button
                  size="sm"
                  leftIcon={<Icon as={GiCycle} />}
                  colorScheme="green"
                  variant="solid"
                  onClick={handleRefresh}
                  isDisabled={!canAffordRefresh}
                >
                  Refresh ({getRefreshCost()}g)
                </Button>
              </Tooltip>
              <HStack spacing={2} bg="green.900" px={4} py={2} borderRadius="md" borderWidth="1px" borderColor="green.700">
                <Icon as={GiCoinsPile} color="yellow.400" />
                <Text fontSize="md" fontWeight="bold" color="yellow.300">{bankGold}</Text>
              </HStack>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="green.300" />
        <ModalBody py={4} px={4} bg="gray.850">
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
                <SimpleGrid columns={4} spacing={2}>
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
                          <ItemSlot
                            item={itemWithIcon}
                            isClickable={false}
                            size="md"
                          />
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
