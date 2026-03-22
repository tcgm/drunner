/**
 * ForgeModal – Forge building UI
 *
 * Two tabs:
 *   Craft      – Pick a material from stash, choose target rarity, see alkahest cost, forge.
 *   Break Down – Select bank items to destroy for per-material charge progress → fragment rewards.
 */

import './ForgeModal.css'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Progress,
  SimpleGrid,
  Tooltip,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { GiAnvil, GiHammerNails, GiCrossedSwords } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RARITY_ORDER, getRarityColor, getRarityConfig } from '@/systems/rarity/raritySystem'
import { ALL_MATERIALS, getMaterialById } from '@/data/items/materials'
import { getAlkahestCost, getForgeableRarities, getBreakdownCharge, getBreakdownThreshold } from '@/systems/forge/forgeSystem'
import { getNexusBonus, getActiveNexusUpgrades } from '@/data/nexus'
import type { Item, ItemRarity } from '@/types'

// ─── Base item type options ───────────────────────────────────────────────────

const BASE_TYPES: { label: string; value: string }[] = [
  { label: 'Weapon', value: 'weapon' },
  { label: 'Helmet', value: 'head' },
  { label: 'Chest', value: 'chest' },
  { label: 'Legs', value: 'legs' },
  { label: 'Boots', value: 'feet' },
  { label: 'Gloves', value: 'hands' },
  { label: 'Accessory', value: 'accessory1' },
  { label: 'Off-hand', value: 'offhand' },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface ForgeModalProps {
  isOpen: boolean
  onClose: () => void
  alkahest: number
  materialStash: Record<string, number>
  materialChargeProgress: Record<string, number>
  bankInventory: Item[]
  deepestFloor: number
  nexusUpgrades: Record<string, number>
  forgeItem: (materialId: string, baseType: string, variantName: string, targetRarity: ItemRarity, useStash: boolean) => Item | null
  breakDownItem: (itemId: string) => void
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function RarityLabel({ rarity }: { rarity: ItemRarity }) {
  const color = getRarityColor(rarity)
  return (
    <Text as="span" color={color} fontWeight="semibold" fontSize="xs" textTransform="capitalize">
      {rarity}
    </Text>
  )
}

// ─── Craft tab ────────────────────────────────────────────────────────────────

interface CraftTabProps {
  alkahest: number
  materialStash: Record<string, number>
  deepestFloor: number
  onForge: (materialId: string, baseType: string, targetRarity: ItemRarity) => void
}

function CraftTab({ alkahest, materialStash, deepestFloor, onForge }: CraftTabProps) {
  const availableMaterials = ALL_MATERIALS.filter(m => (materialStash[m.id] ?? 0) > 0)

  const [selectedMaterialId, setSelectedMaterialId] = React.useState<string | null>(
    availableMaterials.length > 0 ? availableMaterials[0].id : null
  )
  const [selectedBaseType, setSelectedBaseType] = React.useState(BASE_TYPES[0].value)
  const [selectedRarity, setSelectedRarity] = React.useState<ItemRarity | null>(null)

  const material = selectedMaterialId ? getMaterialById(selectedMaterialId) : null
  const forgeableRarities = material ? getForgeableRarities(material, deepestFloor) : []

  // Auto-select first forgeable rarity when material changes
  React.useEffect(() => {
    if (forgeableRarities.length > 0 && (selectedRarity === null || !forgeableRarities.includes(selectedRarity))) {
      setSelectedRarity(forgeableRarities[0])
    }
  }, [selectedMaterialId]) // eslint-disable-line react-hooks/exhaustive-deps

  const alkahestCost = material && selectedRarity
    ? getAlkahestCost(material, selectedRarity, { fromStash: true })
    : 0

  const canForge = material != null
    && selectedRarity !== null
    && alkahest >= alkahestCost
    && (materialStash[material.id] ?? 0) > 0

  if (availableMaterials.length === 0) {
    return (
      <VStack py={8} spacing={3} color="gray.500">
        <Icon as={GiAnvil} boxSize={10} />
        <Text>No material fragments in stash.</Text>
        <Text fontSize="sm">Break down items at the Forge or collect fragments from dungeon runs.</Text>
      </VStack>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Material picker */}
      <Box>
        <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
          Material Fragment
        </Text>
        <SimpleGrid columns={[3, 4, 5]} spacing={2}>
          {availableMaterials.map(mat => {
            const qty = materialStash[mat.id] ?? 0
            const isSelected = selectedMaterialId === mat.id
            const rarityColor = getRarityColor(mat.rarity)
            return (
              <Tooltip key={mat.id} label={`${mat.name} — ${qty} fragment${qty !== 1 ? 's' : ''}`} hasArrow placement="top">
                <Box
                  as="button"
                  className="forge-material-btn"
                  onClick={() => setSelectedMaterialId(mat.id)}
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={isSelected ? rarityColor : 'gray.600'}
                  bg={isSelected ? `${rarityColor}18` : 'blackAlpha.400'}
                  textAlign="center"
                  position="relative"
                >
                  <Text fontSize="xs" color={rarityColor} fontWeight="semibold" noOfLines={1}>
                    {mat.name}
                  </Text>
                  {mat.icon && (
                    <Icon as={mat.icon} boxSize={5} color={rarityColor} display="block" mx="auto" my={1} />
                  )}
                  <Badge
                    className="forge-stash-badge"
                    colorScheme="orange"
                    fontSize="10px"
                    position="absolute"
                    top={1}
                    right={1}
                    borderRadius="full"
                    minW="16px"
                    textAlign="center"
                  >
                    {qty}
                  </Badge>
                </Box>
              </Tooltip>
            )
          })}
        </SimpleGrid>
      </Box>

      <Divider borderColor="gray.700" />

      {/* Base item type */}
      <Box>
        <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
          Item Type
        </Text>
        <Flex wrap="wrap" gap={2}>
          {BASE_TYPES.map(bt => (
            <Button
              key={bt.value}
              size="xs"
              variant={selectedBaseType === bt.value ? 'solid' : 'outline'}
              colorScheme={selectedBaseType === bt.value ? 'orange' : 'gray'}
              onClick={() => setSelectedBaseType(bt.value)}
            >
              {bt.label}
            </Button>
          ))}
        </Flex>
      </Box>

      <Divider borderColor="gray.700" />

      {/* Rarity picker */}
      <Box>
        <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
          Target Rarity
        </Text>
        {material ? (
          <Flex wrap="wrap" gap={2}>
            {RARITY_ORDER.filter(r => {
              const rarityConfig = getRarityConfig(r)
              // Show native rarity and above, but grey out locked ones
              const nativeIdx = RARITY_ORDER.indexOf(material.rarity)
              return RARITY_ORDER.indexOf(r) >= nativeIdx && rarityConfig
            }).map(rarity => {
              const isLocked = !forgeableRarities.includes(rarity)
              const color = getRarityColor(rarity)
              const isSelected = selectedRarity === rarity
              return (
                <Tooltip
                  key={rarity}
                  label={isLocked ? 'Reach a deeper floor to unlock' : undefined}
                  isDisabled={!isLocked}
                  hasArrow
                >
                  <Button
                    size="xs"
                    isDisabled={isLocked}
                    onClick={() => !isLocked && setSelectedRarity(rarity)}
                    borderColor={isSelected ? color : 'gray.600'}
                    color={isSelected ? color : 'gray.400'}
                    variant={isSelected ? 'outline' : 'ghost'}
                    _hover={isLocked ? {} : { color, borderColor: color }}
                    textTransform="capitalize"
                  >
                    {rarity}
                  </Button>
                </Tooltip>
              )
            })}
          </Flex>
        ) : (
          <Text fontSize="sm" color="gray.500">Select a material first.</Text>
        )}
      </Box>

      <Divider borderColor="gray.700" />

      {/* Cost summary */}
      <HStack justify="space-between" bg="blackAlpha.400" p={3} borderRadius="md">
        <VStack spacing={0} align="flex-start">
          <Text fontSize="xs" color="gray.400">Alkahest cost</Text>
          <HStack spacing={1}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={alkahest >= alkahestCost ? 'orange.300' : 'red.400'}
            >
              {alkahestCost.toLocaleString()}
            </Text>
            <Text fontSize="xs" color="gray.500">/ {alkahest.toLocaleString()} available</Text>
          </HStack>
        </VStack>
        <VStack spacing={0} align="flex-end">
          <Text fontSize="xs" color="gray.400">Stash discount</Text>
          <Text fontSize="sm" color="green.400">-{Math.round((1 - GAME_CONFIG.forge.stashCostMultiplier) * 100)}%</Text>
        </VStack>
      </HStack>

      {/* Forge button */}
      <Button
        colorScheme="orange"
        isDisabled={!canForge}
        onClick={() => {
          if (material && selectedRarity) {
            onForge(material.id, selectedBaseType, selectedRarity)
          }
        }}
        leftIcon={<Icon as={GiHammerNails} />}
        size="lg"
      >
        Forge Item
      </Button>
    </VStack>
  )
}

// ─── Break Down tab ───────────────────────────────────────────────────────────

interface BreakDownTabProps {
  bankInventory: Item[]
  materialChargeProgress: Record<string, number>
  nexusUpgrades: Record<string, number>
  onBreakDown: (itemId: string) => void
}

function BreakDownTab({ bankInventory, materialChargeProgress, nexusUpgrades, onBreakDown }: BreakDownTabProps) {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null)

  const breakableItems = bankInventory.filter(item => item.materialId)

  // Deduplicated material IDs from stash progress keys + items in bank
  const trackedMaterials = React.useMemo(() => {
    const ids = new Set<string>([
      ...Object.keys(materialChargeProgress),
      ...breakableItems.map(i => i.materialId!).filter(Boolean),
    ])
    return Array.from(ids)
      .map(id => getMaterialById(id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined)
  }, [materialChargeProgress, breakableItems])

  const selectedItem = selectedItemId ? bankInventory.find(i => i.id === selectedItemId) ?? null : null

  const nexusMultiplier = 1 + getNexusBonus(
    GAME_CONFIG.forge.breakdown.nexusUpgradeId,
    nexusUpgrades
  ) / 100

  const previewCharge = selectedItem
    ? getBreakdownCharge(
        selectedItem.rarity,
        !!(selectedItem.isUnique && !selectedItem.setId),
        !!selectedItem.setId,
        nexusMultiplier,
      )
    : 0

  if (breakableItems.length === 0) {
    return (
      <VStack py={8} spacing={3} color="gray.500">
        <Icon as={GiCrossedSwords} boxSize={10} />
        <Text>No breakable items in bank.</Text>
        <Text fontSize="sm">Items with a known material can be broken down for charge progress.</Text>
      </VStack>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Charge meters */}
      {trackedMaterials.length > 0 && (
        <Box>
          <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
            Fragment Progress
          </Text>
          <VStack spacing={2} align="stretch">
            {trackedMaterials.map(mat => {
              const current = materialChargeProgress[mat.id] ?? 0
              const threshold = getBreakdownThreshold(mat.rarity)
              const pct = threshold === Infinity ? 0 : Math.min(100, (current / threshold) * 100)
              const rarityColor = getRarityColor(mat.rarity)
              return (
                <HStack key={mat.id} spacing={3}>
                  <Text fontSize="xs" color={rarityColor} minW="80px" fontWeight="semibold" noOfLines={1}>
                    {mat.name}
                  </Text>
                  <Box flex={1}>
                    <Progress
                      value={pct}
                      size="sm"
                      borderRadius="full"
                      bg="gray.700"
                      sx={{ '> div': { background: rarityColor } }}
                    />
                  </Box>
                  <Text fontSize="xs" color="gray.400" minW="70px" textAlign="right">
                    {current.toLocaleString()} / {threshold === Infinity ? '∞' : threshold.toLocaleString()}
                  </Text>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      )}

      <Divider borderColor="gray.700" />

      {/* Item list */}
      <Box>
        <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
          Select Item to Break Down
        </Text>
        <Box maxH="240px" overflowY="auto" pr={1}>
          <VStack spacing={1} align="stretch">
            {breakableItems.map(item => {
              const mat = item.materialId ? getMaterialById(item.materialId) : null
              const rarityColor = getRarityColor(item.rarity)
              const isSelected = selectedItemId === item.id
              const charge = getBreakdownCharge(
                item.rarity,
                !!(item.isUnique && !item.setId),
                !!item.setId,
                nexusMultiplier,
              )
              return (
                <HStack
                  key={item.id}
                  className="forge-item-row"
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={isSelected ? '#E07B1A' : 'gray.700'}
                  bg={isSelected ? 'rgba(224, 123, 26, 0.10)' : 'blackAlpha.300'}
                  onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                  spacing={3}
                >
                  {item.icon && <Icon as={item.icon as React.ElementType} boxSize={5} color={rarityColor} flexShrink={0} />}
                  <VStack spacing={0} align="flex-start" flex={1} minW={0}>
                    <Text fontSize="sm" color={rarityColor} fontWeight="semibold" noOfLines={1}>
                      {item.name}
                    </Text>
                    {mat && (
                      <Text fontSize="xs" color="gray.500">
                        {mat.name} · <RarityLabel rarity={mat.rarity} />
                      </Text>
                    )}
                  </VStack>
                  <Tooltip label={`+${charge.toLocaleString()} charge`} hasArrow placement="left">
                    <Badge colorScheme="orange" fontSize="10px" whiteSpace="nowrap">
                      +{charge.toLocaleString()}
                    </Badge>
                  </Tooltip>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      </Box>

      {/* Preview + action */}
      <Box bg="blackAlpha.400" p={3} borderRadius="md">
        {selectedItem && (
          <HStack justify="space-between" mb={3}>
            <Text fontSize="sm" color="gray.300">
              Breaking down: <Text as="span" color={getRarityColor(selectedItem.rarity)} fontWeight="bold">{selectedItem.name}</Text>
            </Text>
            <Badge colorScheme="orange">+{previewCharge.toLocaleString()} charge</Badge>
          </HStack>
        )}
        {nexusMultiplier > 1 && (
          <Text fontSize="xs" color="orange.300" mb={2}>
            Smelter&apos;s Intuition: ×{nexusMultiplier.toFixed(2)} charge bonus applied
          </Text>
        )}
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          isDisabled={!selectedItem}
          width="full"
          onClick={() => {
            if (selectedItem) {
              onBreakDown(selectedItem.id)
              setSelectedItemId(null)
            }
          }}
          leftIcon={<Icon as={GiCrossedSwords} />}
        >
          Break Down Selected Item
        </Button>
      </Box>
    </VStack>
  )
}

// ─── ForgeModal ───────────────────────────────────────────────────────────────

export function ForgeModal({
  isOpen,
  onClose,
  alkahest,
  materialStash,
  materialChargeProgress,
  bankInventory,
  deepestFloor,
  nexusUpgrades,
  forgeItem,
  breakDownItem,
}: ForgeModalProps) {
  const handleForge = (materialId: string, baseType: string, targetRarity: ItemRarity) => {
    const result = forgeItem(materialId, baseType, '', targetRarity, true)
    if (!result) {
      console.warn('[ForgeModal] forgeItem returned null — likely insufficient resources')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="orange.800"
        boxShadow="0 0 40px rgba(224, 123, 26, 0.2)"
        maxH="85vh"
        mx={3}
      >
        <ModalHeader borderBottom="1px solid" borderColor="gray.700" pb={3}>
          <HStack spacing={3}>
            <Icon as={GiAnvil} color="orange.300" boxSize={7} />
            <VStack spacing={0} align="flex-start">
              <Text color="orange.200" fontWeight="bold" fontSize="lg" lineHeight={1.2}>
                Forge
              </Text>
              <Text color="gray.400" fontSize="xs" fontWeight="normal">
                Craft items from material fragments or break down gear for charge
              </Text>
            </VStack>
            <Box flex={1} />
            <HStack spacing={1} bg="blackAlpha.600" px={3} py={1} borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" color="orange.300">
                {alkahest.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="gray.500">Alkahest</Text>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" top={3} right={3} />

        <ModalBody py={4} px={4}>
          <Tabs variant="soft-rounded" colorScheme="orange" size="sm">
            <TabList mb={4}>
              <Tab _selected={{ bg: 'orange.900', color: 'orange.200', borderColor: 'orange.700' }}>
                <Icon as={GiHammerNails} mr={2} />
                Craft
              </Tab>
              <Tab _selected={{ bg: 'red.900', color: 'red.200', borderColor: 'red.700' }}>
                <Icon as={GiCrossedSwords} mr={2} />
                Break Down
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel className="forge-modal-tab-panel">
                <CraftTab
                  alkahest={alkahest}
                  materialStash={materialStash}
                  deepestFloor={deepestFloor}
                  onForge={handleForge}
                />
              </TabPanel>
              <TabPanel className="forge-modal-tab-panel">
                <BreakDownTab
                  bankInventory={bankInventory}
                  materialChargeProgress={materialChargeProgress}
                  nexusUpgrades={nexusUpgrades}
                  onBreakDown={breakDownItem}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
