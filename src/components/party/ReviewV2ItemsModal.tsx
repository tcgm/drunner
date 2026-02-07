import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, VStack, HStack, Text, Select, Box, Progress } from '@chakra-ui/react'
import { useGameStore } from '@/core/gameStore'
import { ItemSlot } from '../ui/ItemSlot'
import type { Item } from '@/types'
import { ALL_MATERIALS } from '@/data/items/materials'
import { getBasesByType } from '@/data/items/bases'
import { useState, useEffect, useMemo } from 'react'

export function ReviewV2ItemsModal({ onClose }: { onClose: () => void }) {
    const v2Items = useGameStore((state) => state.v2Items)
    const convertV2Item = useGameStore((state) => state.convertV2Item)
    const skipV2Item = useGameStore((state) => state.skipV2Item)

    const [selectedMaterialId, setSelectedMaterialId] = useState('')
    const [selectedBaseTemplateId, setSelectedBaseTemplateId] = useState('')

    const currentItem = v2Items.length > 0 ? v2Items[0] : null

    // Reset selections and apply guesses when item changes
    useEffect(() => {
        if (!currentItem) return

        // Function to guess material and base from item properties
        const guessItemProperties = (item: Item) => {
            console.log(`[Guess] Starting guess for item "${item.name}", existing materialId: ${item.materialId}, baseTemplateId: ${item.baseTemplateId}`)

            // Get available bases for this item type (handles accessory1/accessory2 normalization)
            const availableBases = getBasesByType(item.type)

            // 1. Validate existing baseTemplateId - if it's in the old format, we need to re-guess
            let validatedBaseTemplateId = ''
            if (item.baseTemplateId) {
                // Check if any base matches this ID
                const matchingBase = availableBases.find(b => {
                    const expectedId = b.baseNames
                        ? `${b.type}_${b.baseNames[0].toLowerCase()}`
                        : `${b.type}_${b.type}`
                    return expectedId === item.baseTemplateId
                })
                if (matchingBase) {
                    validatedBaseTemplateId = item.baseTemplateId
                } else {
                    console.log(`[Guess] Existing baseTemplateId "${item.baseTemplateId}" is invalid/old format, will re-guess`)
                }
            }

            // If item already has valid IDs, use them
            if (item.materialId && validatedBaseTemplateId) {
                return { materialId: item.materialId, baseTemplateId: validatedBaseTemplateId }
            }

            // 2. Try to guess from name/description
            const searchText = `${item.name} ${item.description}`.toLowerCase()

            // Guess material by looking for material keywords
            let guessedMaterialId = item.materialId || ''
            if (!guessedMaterialId) {
                for (const material of ALL_MATERIALS) {
                    const materialKeywords = [material.prefix.toLowerCase(), material.id.toLowerCase()]
                    if (materialKeywords.some(keyword => searchText.includes(keyword))) {
                        guessedMaterialId = material.id
                        break
                    }
                }
            }

            // Guess base by looking for base name keywords (use validated ID, not raw item.baseTemplateId)
            let guessedBaseTemplateId = validatedBaseTemplateId || ''
            if (!guessedBaseTemplateId) {
                for (const base of availableBases) {
                    // Check if any of the base names appear in the item text
                    const baseKeywords = base.baseNames || []
                    // Try full keyword match first, then individual words
                    const matched = baseKeywords.some(keyword => {
                        const keywordLower = keyword.toLowerCase()
                        // Try exact phrase match
                        if (searchText.includes(keywordLower)) return true
                        // Try matching all individual words (e.g., "plate" and "armor" separately)
                        const words = keywordLower.split(' ')
                        return words.length > 1 && words.every(word => searchText.includes(word))
                    })
                    if (matched) {
                        // Use baseNames[0] format - NEVER description
                        guessedBaseTemplateId = base.baseNames
                            ? `${base.type}_${base.baseNames[0].toLowerCase()}`
                            : `${base.type}_${base.type}` // fallback
                        console.log(`[Guess] Item "${item.name}" matched base "${base.baseNames?.[0]}" (${guessedBaseTemplateId})`)
                        break
                    }
                }
                if (!guessedBaseTemplateId) {
                    console.log(`[Guess] Item "${item.name}" (${item.type}) - no base match found. Available: ${availableBases.map(b => b.baseNames?.[0]).join(', ')}`)
                }
            }

            return { materialId: guessedMaterialId, baseTemplateId: guessedBaseTemplateId }
        }

        const guessed = guessItemProperties(currentItem)
        console.log(`[ReviewV2ItemsModal] Setting selections - materialId: "${guessed.materialId}", baseTemplateId: "${guessed.baseTemplateId}"`)
        setSelectedMaterialId(guessed.materialId)
        setSelectedBaseTemplateId(guessed.baseTemplateId)
    }, [currentItem?.id])

    // Get available bases for this item type (handles accessory1/accessory2 normalization)
    // Must be called before any early returns to maintain hook order
    const availableBases = useMemo(() =>
        currentItem ? getBasesByType(currentItem.type) : []
        , [currentItem?.type])

    // Validate that selected values actually exist in the available options
    const isValidMaterial = useMemo(() => {
        if (!selectedMaterialId || selectedMaterialId.trim() === '') return false
        return ALL_MATERIALS.some(m => m.id === selectedMaterialId)
    }, [selectedMaterialId])

    const isValidBase = useMemo(() => {
        if (!selectedBaseTemplateId || selectedBaseTemplateId.trim() === '') return false
        return availableBases.some(b => {
            const baseId = b.baseNames
                ? `${b.type}_${b.baseNames[0].toLowerCase()}`
                : `${b.type}_${b.type}`
            return baseId === selectedBaseTemplateId
        })
    }, [selectedBaseTemplateId, availableBases])

    // Button is disabled if either selection is invalid/empty
    const isConvertDisabled = useMemo(() => {
        return !isValidMaterial || !isValidBase
    }, [isValidMaterial, isValidBase])

    // Log state changes
    useEffect(() => {
        console.log('[ReviewV2ItemsModal] Button state updated:', {
            currentItemId: currentItem?.id,
            selectedMaterialId,
            selectedBaseTemplateId,
            isValidMaterial,
            isValidBase,
            isConvertDisabled
        })
    }, [currentItem?.id, selectedMaterialId, selectedBaseTemplateId, isValidMaterial, isValidBase, isConvertDisabled])

    // Early return AFTER all hooks have been called
    if (v2Items.length === 0 || !currentItem) return null

    const currentIndex = 0
    const totalItems = v2Items.length

    const handleConvert = () => {
        if (!selectedMaterialId || !selectedBaseTemplateId ||
            selectedMaterialId === '' || selectedBaseTemplateId === '') {
            console.warn('[ReviewV2ItemsModal] Cannot convert: Missing material or base template')
            return
        }
        convertV2Item(currentItem.id, selectedMaterialId, selectedBaseTemplateId)
    }

    const handleSkip = () => {
        skipV2Item(currentItem.id)
    }

    return (
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false} size="xl" blockScrollOnMount={true} preserveScrollBarGap={false}>
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent
                maxH="95vh"
                overflowY="auto"
                mt={0}
                mb={0}
                onWheel={(e) => e.stopPropagation()}
                css={{
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: '#2D3748' },
                    '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '4px' }
                }}
            >
                <ModalHeader pb={3}>
                    <VStack align="stretch" spacing={1}>
                        <Text>Review Old Format Items</Text>
                        <Text fontSize="sm" fontWeight="normal" color="gray.400">
                            Item {currentIndex + 1} of {totalItems}
                        </Text>
                        <Progress value={((currentIndex + 1) / totalItems) * 100} size="sm" colorScheme="blue" />
                    </VStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody p={4}>
                    <VStack align="stretch" spacing={3}>
                        <Box>
                            <Text fontSize="sm" color="gray.400" mb={1}>
                                This item uses the old storage format. Help us migrate it by confirming its properties:
                            </Text>
                        </Box>

                        {/* Show the item */}
                        <Box p={3} bg="gray.800" borderRadius="md">
                            <HStack spacing={4}>
                                <ItemSlot item={currentItem} size="lg" />
                                <VStack align="start" flex={1}>
                                    <Text fontWeight="bold">{currentItem.name}</Text>
                                    <Text fontSize="sm" color="gray.400">{currentItem.description}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {currentItem.type} • {currentItem.rarity}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>

                        {/* Material selection */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                                Material:
                            </Text>
                            <Select
                                placeholder="Select material"
                                value={selectedMaterialId}
                                onChange={(e) => setSelectedMaterialId(e.target.value)}
                                bg="gray.800"
                            >
                                {ALL_MATERIALS.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.prefix} - {material.description}
                                    </option>
                                ))}
                            </Select>
                            {currentItem.materialId && (
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Current: {currentItem.materialId}
                                </Text>
                            )}
                        </Box>

                        {/* Base template selection */}
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                                Base Type:
                            </Text>
                            <Select
                                placeholder="Select base type"
                                value={selectedBaseTemplateId}
                                onChange={(e) => setSelectedBaseTemplateId(e.target.value)}
                                bg="gray.800"
                            >
                                {availableBases.map((base, index) => {
                                    // Use baseNames[0] format for the value - NEVER description
                                    const baseId = base.baseNames
                                        ? `${base.type}_${base.baseNames[0].toLowerCase()}`
                                        : `${base.type}_${base.type}` // fallback
                                    // Show both names and description for display
                                    const displayText = base.baseNames
                                        ? `${base.baseNames.join(', ')} - ${base.description}`
                                        : base.description
                                    return (
                                        <option key={`${base.type}_${index}`} value={baseId}>
                                            {displayText}
                                        </option>
                                    )
                                })}
                            </Select>
                            {currentItem.baseTemplateId && (
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Current: {currentItem.baseTemplateId}
                                </Text>
                            )}
                        </Box>

                        {/* Warning if selections don't match current values */}
                        {(selectedMaterialId || selectedBaseTemplateId) && (
                            <Box p={3} bg="blue.900" borderRadius="md" borderWidth={1} borderColor="blue.500">
                                <Text fontSize="sm">
                                    The item will be converted to use the new storage format with your selected values.
                                    This makes saves smaller and loading faster.
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3} width="100%" justify="space-between">
                        <Button
                            onClick={handleSkip}
                            variant="ghost"
                        >
                            Skip (Keep as V2)
                        </Button>
                        <Button
                            onClick={handleConvert}
                            colorScheme="blue"
                            isDisabled={isConvertDisabled}
                        >
                            Convert to New Format
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
