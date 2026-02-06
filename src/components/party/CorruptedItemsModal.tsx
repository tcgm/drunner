import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Box,
    Text,
    Button,
    Badge,
    Flex,
    Divider,
    Icon,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { useState } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedBones, GiDiceTwentyFacesTwenty, GiAlarmClock } from 'react-icons/gi'
import type { Item } from '../../types'
import { getRarityColors } from '@/systems/rarity/rarities'
import { GAME_CONFIG } from '@/config/gameConfig'

interface CorruptedItemsModalProps {
    isOpen: boolean
    onClose: () => void
    corruptedItems: Item[]
    onRerollItem: (itemId: string) => void
    onSellForGold: (itemId: string) => void
    onSellForAlkahest: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
}

export function CorruptedItemsModal({
    isOpen,
    onClose,
    corruptedItems,
    onRerollItem,
    onSellForGold,
    onSellForAlkahest,
    onDeleteItem
}: CorruptedItemsModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const toast = useToast()

    const currentItem = corruptedItems[currentIndex]
    const hasMoreItems = currentIndex < corruptedItems.length - 1

    const handleReroll = () => {
        onRerollItem(currentItem.id)
        toast({
            title: "Item Rerolled",
            description: `Received a random ${currentItem.rarity} item`,
            status: "success",
            duration: 2000,
        })
        moveToNext()
    }

    const handleSellForGold = () => {
        const goldAmount = currentItem.value
        onSellForGold(currentItem.id)
        toast({
            title: "Sold for Gold",
            description: `Received ${goldAmount} gold`,
            status: "success",
            duration: 2000,
        })
        moveToNext()
    }

    const handleSellForAlkahest = () => {
        const alkahestAmount = Math.floor(currentItem.value * GAME_CONFIG.items.alkahestConversionRate)
        onSellForAlkahest(currentItem.id)
        toast({
            title: "Sold for Alkahest",
            description: `Received ${alkahestAmount} alkahest`,
            status: "success",
            duration: 2000,
        })
        moveToNext()
    }

    const handleDelete = () => {
        onDeleteItem(currentItem.id)
        toast({
            title: "Item Deleted",
            description: "The corrupted item has been removed",
            status: "info",
            duration: 2000,
        })
        moveToNext()
    }

    const moveToNext = () => {
        if (hasMoreItems) {
            setCurrentIndex(prev => prev + 1)
        } else {
            // All items resolved
            onClose()
            setCurrentIndex(0)
        }
    }

    if (!currentItem) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false} closeOnEsc={false} scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="gray.800" borderColor="red.500" borderWidth="2px" maxH="90vh">
                <ModalHeader color="red.400">
                    <HStack spacing={3}>
                        <Icon as={GiAlarmClock} boxSize={6} />
                        <Text>Corrupted Item Found</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle fontSize="sm">Save Data Issue</AlertTitle>
                                <AlertDescription fontSize="xs">
                                    This item's data is corrupted and cannot be loaded properly.
                                    Choose how you want to resolve it.
                                </AlertDescription>
                            </Box>
                        </Alert>

                        {/* Progress indicator */}
                        <Text fontSize="sm" color="gray.400" textAlign="center">
                            Item {currentIndex + 1} of {corruptedItems.length}
                        </Text>

                        {/* Current item display */}
                        <Box
                            p={4}
                            borderWidth="2px"
                            borderRadius="lg"
                            borderColor={getRarityColors(currentItem.rarity).border || 'gray.600'}
                            bg="gray.900"
                        >
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" color={getRarityColors(currentItem.rarity).text || 'white'}>
                                        {currentItem.name}
                                    </Text>
                                    <Badge colorScheme={currentItem.rarity === 'legendary' ? 'orange' : 'gray'}>
                                        {currentItem.rarity}
                                    </Badge>
                                </HStack>
                                <Text fontSize="sm" color="gray.400">
                                    {currentItem.description}
                                </Text>
                                <HStack>
                                    <Text fontSize="xs" color="gray.500">Type: {currentItem.type}</Text>
                                    <Text fontSize="xs" color="gray.500">Value: {currentItem.value}g</Text>
                                </HStack>
                            </VStack>
                        </Box>

                        <Divider />

                        {/* Resolution options */}
                        <VStack spacing={3} align="stretch">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.300">
                                Choose an action:
                            </Text>

                            <Button
                                leftIcon={<Icon as={GiDiceTwentyFacesTwenty} />}
                                colorScheme="purple"
                                onClick={handleReroll}
                                size="md"
                            >
                                <VStack spacing={0} align="start" flex={1}>
                                    <Text>Reroll for Random Item</Text>
                                    <Text fontSize="xs" opacity={0.7}>
                                        Get a random {currentItem.rarity} item of the same rarity
                                    </Text>
                                </VStack>
                            </Button>

                            <Button
                                leftIcon={<Icon as={GiTwoCoins} />}
                                colorScheme="yellow"
                                onClick={handleSellForGold}
                                size="md"
                            >
                                <VStack spacing={0} align="start" flex={1}>
                                    <Text>Sell for Gold</Text>
                                    <Text fontSize="xs" opacity={0.7}>
                                        Get {currentItem.value} gold (100% value)
                                    </Text>
                                </VStack>
                            </Button>

                            <Button
                                leftIcon={<Icon as={GiSwapBag} />}
                                colorScheme="cyan"
                                onClick={handleSellForAlkahest}
                                size="md"
                            >
                                <VStack spacing={0} align="start" flex={1}>
                                    <Text>Sell for Alkahest</Text>
                                    <Text fontSize="xs" opacity={0.7}>
                                        Get {Math.floor(currentItem.value * GAME_CONFIG.items.alkahestConversionRate)} alkahest
                                    </Text>
                                </VStack>
                            </Button>

                            <Button
                                leftIcon={<Icon as={GiCrossedBones} />}
                                colorScheme="red"
                                variant="outline"
                                onClick={handleDelete}
                                size="md"
                            >
                                <VStack spacing={0} align="start" flex={1}>
                                    <Text>Delete Item</Text>
                                    <Text fontSize="xs" opacity={0.7}>
                                        Permanently remove with no compensation
                                    </Text>
                                </VStack>
                            </Button>
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
