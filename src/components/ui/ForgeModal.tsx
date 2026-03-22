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
  useDisclosure,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { GiAnvil, GiHammerNails, GiCrossedSwords } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RARITY_ORDER, getRarityColor, getRarityConfig, isRarityAtOrBelow, RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { ALL_MATERIALS, getMaterialById } from '@/data/items/materials'
import { getAlkahestCost, getForgeableRarities, getBreakdownCharge, getBreakdownThreshold } from '@/systems/forge/forgeSystem'
import { getNexusBonus } from '@/data/nexus'
import { BankInventoryModal } from '@/components/party/BankInventoryModal'
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
  const { isOpen: isPickerOpen, onOpen: onPickerOpen, onClose: onPickerClose } = useDisclosure()

  const [rarityThreshold, setRarityThreshold] = React.useState<ItemRarity>('uncommon')
  const [includeUnique, setIncludeUnique] = React.useState(false)
  const [includeSet, setIncludeSet] = React.useState(false)
  const [includeMods, setIncludeMods] = React.useState(true)

  const nexusMultiplier = 1 + getNexusBonus(
    GAME_CONFIG.forge.breakdown.nexusUpgradeId,
    nexusUpgrades
  ) / 100

  const breakableItems = React.useMemo(
    () => bankInventory.filter(item => item.materialId),
    [bankInventory]
  )

  /** Items that pass current filter */
  const selectedItems = React.useMemo(() => breakableItems.filter(item => {
    if (!isRarityAtOrBelow(item.rarity, rarityThreshold)) return false
    if (!includeUnique && item.isUnique) return false
    if (!includeSet && item.setId) return false
    if (!includeMods && item.modifiers && item.modifiers.length > 0) return false
    return true
  }), [breakableItems, rarityThreshold, includeUnique, includeSet, includeMods])

  /** Total charge preview grouped by material */
  const chargeByMaterial = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const item of selectedItems) {
      if (!item.materialId) continue
      const charge = getBreakdownCharge(
        item.rarity,
        !!(item.isUnique && !item.setId),
        !!item.setId,
        nexusMultiplier,
      )
      map.set(item.materialId, (map.get(item.materialId) ?? 0) + charge)
    }
    return map
  }, [selectedItems, nexusMultiplier])

  // Deduplicated tracked materials
  const trackedMaterials = React.useMemo(() => {
    const ids = new Set<string>([
      ...Object.keys(materialChargeProgress),
      ...breakableItems.map(i => i.materialId!).filter(Boolean),
    ])
    return Array.from(ids)
      .map(id => getMaterialById(id))
      .filter((m): m is NonNullable<typeof m> => m !== undefined)
  }, [materialChargeProgress, breakableItems])

  const handleConfirm = () => {
    for (const item of selectedItems) onBreakDown(item.id)
  }

  const handleBreakDownItems = (itemIds: string[]) => {
    for (const id of itemIds) onBreakDown(id)
  }

  return (
    <VStack spacing={4} align="stretch">

      {/* Charge meters */}
      {trackedMaterials.length > 0 ? (
        <Box>
          <Text fontSize="xs" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
            Fragment Progress
          </Text>
          <VStack spacing={2} align="stretch">
            {trackedMaterials.map(mat => {
              const current = materialChargeProgress[mat.id] ?? 0
              const pending = chargeByMaterial.get(mat.id) ?? 0
              const threshold = getBreakdownThreshold(mat.rarity)
              const pct = threshold === Infinity ? 0 : Math.min(100, (current / threshold) * 100)
              const pendingPct = threshold === Infinity ? 0 : Math.min(100 - pct, (pending / threshold) * 100)
              const rarityColor = getRarityColor(mat.rarity)
              return (
                <HStack key={mat.id} spacing={3}>
                  <Text fontSize="xs" color={rarityColor} minW="80px" fontWeight="semibold" noOfLines={1}>
                    {mat.name}
                  </Text>
                  <Box flex={1} position="relative" h="8px">
                    {/* current fill */}
                    <Box
                      position="absolute" inset={0}
                      borderRadius="full" bg="gray.700" overflow="hidden"
                    >
                      <Box h="full" borderRadius="full" style={{ width: `${pct}%`, background: rarityColor }} />
                    </Box>
                    {/* pending overlay */}
                    {pending > 0 && (
                      <Box
                        position="absolute" inset={0}
                        borderRadius="full" overflow="hidden"
                        pointerEvents="none"
                      >
                        <Box
                          h="full" borderRadius="full" opacity={0.45}
                          style={{
                            marginLeft: `${pct}%`,
                            width: `${pendingPct}%`,
                            background: rarityColor,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <HStack spacing={1} minW="90px" justify="flex-end">
                    <Text fontSize="xs" color="gray.400">
                      {current.toLocaleString()}
                    </Text>
                    {pending > 0 && (
                      <Text fontSize="xs" color="orange.300">+{pending.toLocaleString()}</Text>
                    )}
                    <Text fontSize="xs" color="gray.600">
                      / {threshold === Infinity ? '∞' : threshold.toLocaleString()}
                    </Text>
                  </HStack>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      ) : (
        <Text fontSize="sm" color="gray.500" textAlign="center" py={2}>
          Break down items to start filling fragment meters.
        </Text>
      )}

      <Divider borderColor="gray.700" />

      {/* Rule panel — Shifty-Guy style */}
      <Box>
        <FormLabel fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={2}>
          Break everything at or below:
        </FormLabel>
        <Select
          size="sm"
          value={rarityThreshold}
          onChange={e => setRarityThreshold(e.target.value as ItemRarity)}
          bg="gray.800"
          borderColor="gray.600"
          color="white"
          _hover={{ borderColor: 'orange.600' }}
          sx={{ option: { background: '#1a202c', color: 'white' } }}
        >
          {RARITY_ORDER.map(r => (
            <option key={r} value={r}>{RARITY_CONFIGS[r].name}</option>
          ))}
        </Select>
      </Box>

      <SimpleGrid columns={3} spacing={2}>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch size="sm" id="bd-unique" isChecked={includeUnique}
            onChange={e => setIncludeUnique(e.target.checked)} colorScheme="orange" />
          <FormLabel htmlFor="bd-unique" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
            Include unique
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch size="sm" id="bd-set" isChecked={includeSet}
            onChange={e => setIncludeSet(e.target.checked)} colorScheme="orange" />
          <FormLabel htmlFor="bd-set" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
            Include set
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch size="sm" id="bd-mods" isChecked={includeMods}
            onChange={e => setIncludeMods(e.target.checked)} colorScheme="orange" />
          <FormLabel htmlFor="bd-mods" mb={0} fontSize="xs" color="gray.400" cursor="pointer">
            Include modded
          </FormLabel>
        </FormControl>
      </SimpleGrid>

      {/* Preview */}
      {selectedItems.length > 0 ? (
        <Box bg="gray.800" borderRadius="md" p={3}>
          <Text fontSize="xs" color="gray.400" mb={2} fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
            Will break down ({selectedItems.length} items)
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {(() => {
              const counts = new Map<ItemRarity, number>()
              for (const item of selectedItems) counts.set(item.rarity, (counts.get(item.rarity) ?? 0) + 1)
              return Array.from(counts.entries()).map(([rarity, count]) => {
                const cfg = RARITY_CONFIGS[rarity]
                return (
                  <Badge key={rarity} px={2} py={0.5} borderRadius="md" fontSize="xs"
                    style={{ background: cfg.backgroundColor, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                    {count}× {cfg.name}
                  </Badge>
                )
              })
            })()}
          </Flex>
        </Box>
      ) : (
        <Box bg="gray.800" borderRadius="md" p={3} textAlign="center">
          <Text fontSize="sm" color="gray.500">No matching items for current filters.</Text>
        </Box>
      )}

      {nexusMultiplier > 1 && (
        <Text fontSize="xs" color="orange.300">
          Smelter's Intuition: ×{nexusMultiplier.toFixed(2)} charge bonus active
        </Text>
      )}

      {/* Actions */}
      <VStack spacing={2}>
        <Button
          colorScheme="red"
          leftIcon={<Icon as={GiCrossedSwords} />}
          isDisabled={selectedItems.length === 0}
          width="full"
          onClick={handleConfirm}
        >
          Break Down {selectedItems.length > 0 ? `${selectedItems.length} Items` : ''}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          width="full"
          isDisabled={breakableItems.length === 0}
          onClick={onPickerOpen}
        >
          Pick specific items manually…
        </Button>
      </VStack>

      {/* Bank picker modal — manual fallback */}
      <BankInventoryModal
        isOpen={isPickerOpen}
        onClose={onPickerClose}
        bankInventory={breakableItems}
        pendingSlot={null}
        onEquipItem={() => {}}
        selectedHeroIndex={null}
        party={[]}
        onBreakDownItems={handleBreakDownItems}
      />
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
