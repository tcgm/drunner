/**
 * ShiftyGuyModal – post-dungeon-run bulk item scrapper
 * A shady merchant approaches after every run and offers to take low-rarity
 * items off the player's hands in exchange for alkahest (at a slight discount)
 * plus a modest gold handling fee.
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Divider,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Badge,
  Flex,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { GiHoodedFigure, GiTwoCoins, GiPowder, GiTrashCan, GiInfo } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RARITY_ORDER, getRarityIndex, isRarityAtOrBelow, RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import type { Item, ItemRarity } from '@/types'

interface ShiftyGuyModalProps {
  isOpen: boolean
  lastRunItems: Item[]
  bankGold: number
  onAccept: (rarityThreshold: ItemRarity, includeUnique: boolean, includeSet: boolean, includeMods: boolean) => void
  onDecline: () => void
}

// All rarities are selectable as the "take everything at or below" threshold.
const SELECTABLE_RARITIES: ItemRarity[] = RARITY_ORDER

export function ShiftyGuyModal({ isOpen, lastRunItems: items, bankGold, onAccept, onDecline }: ShiftyGuyModalProps) {
  const lastRunItems = items
  const [rarityThreshold, setRarityThreshold] = useState<ItemRarity>(
    GAME_CONFIG.shiftyGuy.defaultRarityThreshold
  )
  const [includeUnique, setIncludeUnique] = useState<boolean>(GAME_CONFIG.shiftyGuy.defaultIncludeUnique)
  const [includeSet, setIncludeSet] = useState<boolean>(GAME_CONFIG.shiftyGuy.defaultIncludeSet)
  const [includeMods, setIncludeMods] = useState<boolean>(GAME_CONFIG.shiftyGuy.defaultIncludeMods)

  /** Items from the run that pass the current filter settings */
  const selectedItems = useMemo(() => {
    return lastRunItems.filter(item => {
      if (!isRarityAtOrBelow(item.rarity, rarityThreshold)) return false
      if (!includeUnique && item.isUnique) return false
      if (!includeSet && item.setId) return false
      if (!includeMods && item.modifiers && item.modifiers.length > 0) return false
      return true
    })
  }, [lastRunItems, rarityThreshold, includeUnique, includeSet, includeMods])

  const totalValue = useMemo(
    () => selectedItems.reduce((sum, item) => sum + (item.value ?? 0), 0),
    [selectedItems]
  )

  const manualAlkahest = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate)
  const alkahestGained = Math.floor(manualAlkahest * GAME_CONFIG.shiftyGuy.alkahestReturnPercent)
  const goldFee = Math.floor(totalValue * GAME_CONFIG.shiftyGuy.goldCostPercent)
  const canAfford = bankGold >= goldFee
  const hasItems = selectedItems.length > 0

  // Group selected items by rarity for the summary panel
  const byRarity = useMemo(() => {
    const map = new Map<ItemRarity, number>()
    for (const item of selectedItems) {
      map.set(item.rarity, (map.get(item.rarity) ?? 0) + 1)
    }
    // Return sorted lowest → highest
    return Array.from(map.entries()).sort(
      ([a], [b]) => getRarityIndex(a) - getRarityIndex(b)
    )
  }, [selectedItems])

  const handleAccept = () => {
    onAccept(rarityThreshold, includeUnique, includeSet, includeMods)
  }

  const thresholdConfig = RARITY_CONFIGS[rarityThreshold]

  return (
    <Modal isOpen={isOpen} onClose={onDecline} size="lg" isCentered closeOnOverlayClick={false}
    scrollBehavior='inside'>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent
        bg="gray.900"
        borderWidth="2px"
        borderColor="yellow.700"
        boxShadow="0 0 30px rgba(202,138,4,0.3)"
      >
        {/* Header – character + dialogue */}
        <Box px={6} pt={6} pb={2}>
          <HStack spacing={4} align="flex-start">
            <Flex
              flexShrink={0}
              boxSize="64px"
              borderRadius="full"
              bg="gray.800"
              border="2px solid"
              borderColor="yellow.700"
              align="center"
              justify="center"
            >
              <Icon as={GiHoodedFigure} boxSize={8} color="yellow.500" />
            </Flex>
            <Box
              bg="gray.800"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.600"
              p={3}
              flex={1}
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                left: '-8px',
                top: '14px',
                borderStyle: 'solid',
                borderWidth: '8px 8px 8px 0',
                borderColor: 'transparent gray.600 transparent transparent',
              }}
            >
              <Text fontSize="sm" color="yellow.200" fontStyle="italic" lineHeight="tall">
                "Psst... You look like someone who just came back from the deep.
                Tell you what – I'll take that trash off your hands.
                Save you the trouble of melting it all down yourself.
                My fee's modest, and you still walk away with{' '}
                <Text as="span" color="purple.300" fontWeight="bold">
                  alkahest
                </Text>{' '}
                in your pocket. What do you say?"
              </Text>
            </Box>
          </HStack>

          <Text mt={3} fontSize="xs" color="gray.500" textAlign="center">
            {lastRunItems.length} item{lastRunItems.length !== 1 ? 's' : ''} from your last run available
          </Text>
        </Box>

        <ModalBody px={6} py={4}>
          <VStack spacing={4} align="stretch">

            {/* Rarity threshold selector */}
            <Box>
              <FormLabel fontSize="sm" color="gray.300" mb={1.5}>
                Take everything at or below:
              </FormLabel>
              <Select
                size="sm"
                value={rarityThreshold}
                onChange={e => setRarityThreshold(e.target.value as ItemRarity)}
                bg="gray.800"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: 'yellow.600' }}
                sx={{
                  option: { background: '#1a202c', color: 'white' }
                }}
              >
                {SELECTABLE_RARITIES.map(r => (
                  <option key={r} value={r}>
                    {RARITY_CONFIGS[r].name}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Exception toggles */}
            <SimpleGrid columns={3} spacing={2}>
              <FormControl display="flex" alignItems="center" gap={2}>
                <Switch
                  size="sm"
                  id="toggle-unique"
                  isChecked={includeUnique}
                  onChange={e => setIncludeUnique(e.target.checked)}
                  colorScheme="yellow"
                />
                <FormLabel htmlFor="toggle-unique" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
                  Include unique
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center" gap={2}>
                <Switch
                  size="sm"
                  id="toggle-set"
                  isChecked={includeSet}
                  onChange={e => setIncludeSet(e.target.checked)}
                  colorScheme="yellow"
                />
                <FormLabel htmlFor="toggle-set" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
                  Include set
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center" gap={2}>
                <Switch
                  size="sm"
                  id="toggle-mods"
                  isChecked={includeMods}
                  onChange={e => setIncludeMods(e.target.checked)}
                  colorScheme="yellow"
                />
                <FormLabel htmlFor="toggle-mods" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
                  Include modded
                </FormLabel>
              </FormControl>
            </SimpleGrid>

            <Divider borderColor="gray.700" />

            {/* Item breakdown */}
            {hasItems ? (
              <Box bg="gray.800" borderRadius="md" p={3}>
                <Text fontSize="xs" color="gray.400" mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                  Items Selected ({selectedItems.length})
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {byRarity.map(([rarity, count]) => {
                    const cfg = RARITY_CONFIGS[rarity]
                    return (
                      <Badge
                        key={rarity}
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        fontSize="xs"
                        style={{ background: cfg.backgroundColor, color: cfg.color, border: `1px solid ${cfg.color}40` }}
                      >
                        {count}× {cfg.name}
                      </Badge>
                    )
                  })}
                </Flex>
              </Box>
            ) : (
              <Box bg="gray.800" borderRadius="md" p={3} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No eligible items match your current filters.
                </Text>
              </Box>
            )}

            {/* Deal summary */}
            <Box
              bg="gray.800"
              borderRadius="md"
              borderWidth="1px"
              borderColor={hasItems ? 'yellow.800' : 'gray.700'}
              p={3}
            >
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <HStack spacing={1}>
                    <Icon as={GiTwoCoins} color="yellow.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.300">Gold fee (handling charge)</Text>
                    <Tooltip
                      label={`${(GAME_CONFIG.shiftyGuy.goldCostPercent * 100).toFixed(0)}% of selected items' total sell value`}
                      placement="top"
                      hasArrow
                    >
                      <Box as="span" cursor="help">
                        <Icon as={GiInfo} color="gray.500" boxSize={3} />
                      </Box>
                    </Tooltip>
                  </HStack>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={goldFee > 0 ? (canAfford ? 'yellow.300' : 'red.400') : 'gray.500'}
                  >
                    {goldFee > 0 ? `−${goldFee.toLocaleString()}` : '—'}
                    {goldFee > 0 && !canAfford && (
                      <Text as="span" fontSize="xs" color="red.400" ml={1}>(not enough gold)</Text>
                    )}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <HStack spacing={1}>
                    <Icon as={GiPowder} color="purple.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.300">Alkahest received</Text>
                    <Tooltip
                      label={`${(GAME_CONFIG.shiftyGuy.alkahestReturnPercent * 100).toFixed(0)}% of what manual discarding would give. Manual: ${manualAlkahest.toLocaleString()}`}
                      placement="top"
                      hasArrow
                    >
                      <Box as="span" cursor="help">
                        <Icon as={GiInfo} color="gray.500" boxSize={3} />
                      </Box>
                    </Tooltip>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color={alkahestGained > 0 ? 'purple.300' : 'gray.500'}>
                    {alkahestGained > 0 ? `+${alkahestGained.toLocaleString()}` : '—'}
                  </Text>
                </HStack>

                {hasItems && (
                  <Box pt={1} borderTop="1px solid" borderColor="gray.700">
                    <Text fontSize="xs" color="gray.500">
                      You save {((1 - GAME_CONFIG.shiftyGuy.alkahestReturnPercent) * 100).toFixed(0)}% alkahest vs manual (that's his cut), but skip all{' '}
                      {selectedItems.length} scrappings.
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>

          </VStack>
        </ModalBody>

        <ModalFooter gap={3} pt={2} pb={5} px={6}>
          <Button
            variant="outline"
            colorScheme="gray"
            size="sm"
            onClick={onDecline}
            leftIcon={<Icon as={GiTrashCan} />}
          >
            No thanks
          </Button>
          <Button
            colorScheme="yellow"
            size="sm"
            isDisabled={!hasItems || !canAfford}
            onClick={handleAccept}
            leftIcon={<Icon as={GiTwoCoins} />}
          >
            Make the deal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
