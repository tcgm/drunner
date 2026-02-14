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
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import type { Consumable, Hero, Item } from '@/types'
import { generatePotionForFloor } from '@/systems/consumables/consumableGenerator'
import { generateItem } from '@/systems/loot/lootGenerator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { GiShoppingCart, GiCycle, GiShop, GiBarbedSun, GiGoldBar } from 'react-icons/gi'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

interface PotionShopModalProps {
  isOpen: boolean
  onClose: () => void
  bankGold: number
  party: (Hero | null)[]
  onPurchase: (potion: Consumable) => void
  onPurchaseItem: (item: Item) => void
  onSpendGold: (amount: number) => boolean
  bankInventory: Item[]
  bankStorageSlots: number
}

const SHOP_SIZE = GAME_CONFIG.shop.inventorySize

const getRarityColor = (rarity: string): string => {
  const rarityColors: Record<string, string> = {
    common: 'gray.500',
    uncommon: 'green.400',
    rare: 'blue.400',
    epic: 'purple.400',
    legendary: 'orange.400',
    mythic: 'red.400',
    junk: 'gray.600'
  }
  return rarityColors[rarity] || 'gray.500'
}

export function PotionShopModal({ isOpen, onClose, bankGold, party, onPurchase, onPurchaseItem, onSpendGold, bankInventory, bankStorageSlots }: PotionShopModalProps) {
  const [potions, setPotions] = useState<Consumable[]>([])
  const [featuredItem, setFeaturedItem] = useState<Item | null>(null)
  const [selectedPotion, setSelectedPotion] = useState<Consumable | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [purchasedPotionIds, setPurchasedPotionIds] = useState<Set<string>>(new Set())
  const [featuredItemPurchased, setFeaturedItemPurchased] = useState(false)

  // Calculate effective floor based on party's average level
  const getEffectiveFloor = () => {
    const activeHeroes = party.filter((h): h is Hero => h !== null)
    if (activeHeroes.length === 0) return 1
    
    const avgLevel = activeHeroes.reduce((sum, h) => sum + h.level, 0) / activeHeroes.length
    // Convert average level to floor using configured scaling multiplier
    return Math.max(1, Math.floor(avgLevel * GAME_CONFIG.shop.floorScaling))
  }

  // Generate initial shop inventory only once
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const floor = getEffectiveFloor()
      const newPotions: Consumable[] = []
      for (let i = 0; i < SHOP_SIZE; i++) {
        const potion = generatePotionForFloor(floor)
        newPotions.push(potion)
      }
      setPotions(newPotions)
      
      // Generate featured item with higher quality
      const item = generateItem(floor + 10, undefined, 'rare') // Boost floor and min rarity
      setFeaturedItem(restoreItemIcon(item))
      
      setSelectedPotion(null)
      setPurchasedPotionIds(new Set())
      setFeaturedItemPurchased(false)
      setHasInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasInitialized])

  const generateShopInventory = () => {
    const floor = getEffectiveFloor()
    const newPotions: Consumable[] = []
    for (let i = 0; i < SHOP_SIZE; i++) {
      const potion = generatePotionForFloor(floor)
      newPotions.push(potion)
    }
    setPotions(newPotions)
    
    // Generate new featured item
    const item = generateItem(floor + 10, undefined, 'rare')
    setFeaturedItem(restoreItemIcon(item))
    
    setSelectedPotion(null)
    setPurchasedPotionIds(new Set())
    setFeaturedItemPurchased(false)
  }

  // Calculate shop price (don't modify the item itself)
  const getShopPrice = (item: Item | Consumable) => {
    return Math.floor(item.value * GAME_CONFIG.shop.priceMultiplier)
  }

  const handleRefresh = () => {
    const refreshCost = getRefreshCost()
    if (bankGold >= refreshCost && onSpendGold(refreshCost)) {
      generateShopInventory()
    }
  }

  const handlePurchase = (potion: Consumable) => {
    const shopPrice = getShopPrice(potion)
    if (bankGold >= shopPrice && !purchasedPotionIds.has(potion.id)) {
      onPurchase(potion)
      setPurchasedPotionIds(prev => new Set(prev).add(potion.id))
      setSelectedPotion(null)
    }
  }

  const handleFeaturedItemPurchase = () => {
    if (featuredItem) {
      const shopPrice = getShopPrice(featuredItem)
      if (bankGold >= shopPrice && !featuredItemPurchased) {
        // Check if bank is full
        if (bankInventory.length >= bankStorageSlots) {
          // Bank is full, onPurchaseItem will handle opening the buy slots modal
          onPurchaseItem(featuredItem)
          return
        }
        
        onPurchaseItem(featuredItem)
        setFeaturedItemPurchased(true)
      }
    }
  }

  // Calculate dynamic refresh cost based on unpurchased items
  const getRefreshCost = () => {
    let remainingValue = 0
    
    // Add unpurchased potions
    potions.forEach(potion => {
      if (!purchasedPotionIds.has(potion.id)) {
        remainingValue += getShopPrice(potion)
      }
    })
    
    // Add featured item if not purchased
    if (featuredItem && !featuredItemPurchased) {
      remainingValue += getShopPrice(featuredItem)
    }
    
    // Calculate cost: base + (remaining value * multiplier)
    const cost = Math.ceil(
      GAME_CONFIG.shop.refreshBaseCost + 
      (remainingValue * GAME_CONFIG.shop.refreshCostMultiplier)
    )
    
    return cost
  }

  const canAffordRefresh = bankGold >= getRefreshCost()
  const canAfford = (potion: Consumable) => bankGold >= getShopPrice(potion)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent bg="gray.900" color="white" borderWidth="2px" borderColor="purple.500" h="95vh" maxH="95vh">
        <ModalHeader color="purple.400" borderBottom="1px solid" borderColor="gray.700">
          <HStack justify="space-between">
            <HStack>
              <Icon as={GiShop} boxSize={6} />
              <Text>Shop</Text>
            </HStack>
            <HStack spacing={4}>
              <Tooltip 
                label={canAffordRefresh ? `Refresh shop for ${getRefreshCost()} gold` : 'Not enough gold'} 
                placement="left"
              >
                <Button
                  size="sm"
                  leftIcon={<Icon as={GiCycle} />}
                  colorScheme="purple"
                  onClick={handleRefresh}
                  isDisabled={!canAffordRefresh}
                >
                  Refresh ({getRefreshCost()}g)
                </Button>
              </Tooltip>
              <HStack spacing={2} bg="gray.800" px={3} py={1} borderRadius="md">
                <Text fontSize="sm" color="gray.400">Gold:</Text>
                <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{bankGold}</Text>
              </HStack>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={2} px={3}>
          <Grid templateColumns="1fr 2fr 1fr" gap={2}>
            {/* Left Column - Potions */}
            <VStack spacing={1.5}>
              {potions.slice(0, Math.ceil(potions.length / 2)).map((potion) => {
                const isPurchased = purchasedPotionIds.has(potion.id)
                const affordable = canAfford(potion) && !isPurchased
                const isSelected = selectedPotion?.id === potion.id
                const potionWithIcon = restoreItemIcon(potion)

                return (
                  <Box
                    key={potion.id}
                    position="relative"
                    bg={isSelected ? 'gray.700' : 'gray.800'}
                    borderWidth="2px"
                    borderColor={isPurchased ? 'gray.700' : isSelected ? 'purple.400' : affordable ? 'gray.600' : 'red.500'}
                    borderRadius="md"
                    p={1}
                    cursor={affordable ? 'pointer' : 'not-allowed'}
                    onClick={() => affordable && handlePurchase(potion)}
                    _hover={affordable ? { 
                      borderColor: 'purple.400', 
                      bg: 'gray.700',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s'
                    } : {}}
                    transition="all 0.2s"
                    opacity={isPurchased ? 0.4 : affordable ? 1 : 0.6}
                    w="100%"
                  >
                    <VStack spacing={0.5}>
                      <ItemSlot
                        item={potionWithIcon}
                        isClickable={true}
                        size="sm"
                      />
                      <Button
                        size="xs"
                        colorScheme={isPurchased ? 'gray' : affordable ? 'green' : 'red'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePurchase(potion)
                        }}
                        isDisabled={!affordable}
                        width="100%"
                        fontSize="2xs"
                      >
                        {isPurchased ? 'Bought' : affordable ? `${potion.value}g` : 'X'}
                      </Button>
                    </VStack>
                  </Box>
                )
              })}
            </VStack>

            {/* Center Column - Featured Item */}
            <Box>
              {featuredItem ? (
                <Box
                  bg="gray.800"
                  borderWidth="3px"
                  borderColor={featuredItemPurchased ? 'gray.700' : 'orange.500'}
                  borderRadius="lg"
                  p={3}
                  boxShadow={featuredItemPurchased ? 'none' : '0 0 20px rgba(251, 146, 60, 0.3)'}
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  opacity={featuredItemPurchased ? 0.4 : 1}
                >
                  <VStack spacing={2}>
                    <Text fontSize="sm" fontWeight="bold" color="orange.400" textTransform="uppercase">
                      Featured Item
                    </Text>
                    <ItemSlot
                      item={featuredItem}
                      isClickable={true}
                      size="xl"
                    />
                    <Tooltip 
                      label={bankGold < getShopPrice(featuredItem) && !featuredItemPurchased ? `Need ${getShopPrice(featuredItem) - bankGold} more gold` : ''}
                      isDisabled={bankGold >= getShopPrice(featuredItem) || featuredItemPurchased}
                    >
                      <Button
                        size="md"
                        colorScheme={featuredItemPurchased ? 'gray' : bankGold >= getShopPrice(featuredItem) ? 'orange' : 'gray'}
                        onClick={handleFeaturedItemPurchase}
                        isDisabled={featuredItemPurchased || bankGold < getShopPrice(featuredItem)}
                        width="clamp(150px, 20vw, 220px)"
                        // leftIcon={<Icon as={GiGoldBar} />}
                      >
                        {featuredItemPurchased ? 'Bought' : (
                          <Text color={bankGold >= getShopPrice(featuredItem) ? 'gray.900' : 'red.400'} fontWeight="bold">
                            {getShopPrice(featuredItem)}g
                          </Text>
                        )}
                      </Button>
                    </Tooltip>
                  </VStack>
                </Box>
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No featured item available</Text>
                </Box>
              )}
            </Box>

            {/* Right Column - More Potions */}
            <VStack spacing={1.5}>
              {potions.slice(Math.ceil(potions.length / 2)).map((potion) => {
                const isPurchased = purchasedPotionIds.has(potion.id)
                const affordable = canAfford(potion) && !isPurchased
                const isSelected = selectedPotion?.id === potion.id
                const potionWithIcon = restoreItemIcon(potion)

                return (
                  <Box
                    key={potion.id}
                    position="relative"
                    bg={isSelected ? 'gray.700' : 'gray.800'}
                    borderWidth="2px"
                    borderColor={isPurchased ? 'gray.700' : isSelected ? 'purple.400' : affordable ? 'gray.600' : 'red.500'}
                    borderRadius="md"
                    p={1}
                    cursor={affordable ? 'pointer' : 'not-allowed'}
                    onClick={() => affordable && handlePurchase(potion)}
                    _hover={affordable ? { 
                      borderColor: 'purple.400', 
                      bg: 'gray.700',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s'
                    } : {}}
                    transition="all 0.2s"
                    opacity={isPurchased ? 0.4 : affordable ? 1 : 0.6}
                    w="100%"
                  >
                    <VStack spacing={0.5}>
                      <ItemSlot
                        item={potionWithIcon}
                        isClickable={true}
                        size="sm"
                      />
                      <Button
                        size="xs"
                        colorScheme={isPurchased ? 'gray' : affordable ? 'green' : 'red'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePurchase(potion)
                        }}
                        isDisabled={!affordable}
                        width="100%"
                        fontSize="2xs"
                      >
                        {isPurchased ? 'Bought' : affordable ? `${getShopPrice(potion)}g` : 'X'}
                      </Button>
                    </VStack>
                  </Box>
                )
              })}
            </VStack>
          </Grid>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="gray.700">
          <Button colorScheme="gray" onClick={onClose}>
            Close Shop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
